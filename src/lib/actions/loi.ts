"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

export interface LOIData {
  proposed_price: number
  terms: string
  conditions: string
  valid_until: string
}

/**
 * Create a Letter of Intent for a room.
 */
export async function createLOI(roomId: string, data: LOIData) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify user is a participant
  const { data: room } = await supabase
    .from("deal_rooms")
    .select("buyer_id, seller_id, deal_id")
    .eq("id", roomId)
    .single()

  if (!room || (room.buyer_id !== user.id && room.seller_id !== user.id)) {
    throw new Error("이 대화방에 접근할 수 없습니다.")
  }

  const { data: loi, error } = await supabase
    .from("lois")
    .insert({
      room_id: roomId,
      deal_id: room.deal_id,
      proposer_id: user.id,
      proposed_price: data.proposed_price,
      terms: data.terms,
      conditions: data.conditions,
      valid_until: data.valid_until,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating LOI:", error)
    throw new Error("LOI 제출에 실패했습니다.")
  }

  // Insert a system message
  await supabase.from("messages").insert({
    room_id: roomId,
    sender_id: user.id,
    content: `LOI(의향서)가 제출되었습니다. 제안 금액: ${new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(data.proposed_price)}`,
    message_type: "system",
  })

  return loi
}

/**
 * Accept, reject, or counter an LOI.
 */
export async function respondToLOI(
  loiId: string,
  status: "accepted" | "rejected" | "countered",
  notes?: string
) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Get the LOI
  const { data: loi } = await supabase
    .from("lois")
    .select("*, room:deal_rooms!room_id(buyer_id, seller_id)")
    .eq("id", loiId)
    .single()

  if (!loi) {
    throw new Error("LOI를 찾을 수 없습니다.")
  }

  const room = loi.room as { buyer_id: string; seller_id: string } | null
  if (!room || (room.buyer_id !== user.id && room.seller_id !== user.id)) {
    throw new Error("이 LOI에 접근할 수 없습니다.")
  }

  // Cannot respond to own LOI
  if (loi.proposer_id === user.id) {
    throw new Error("본인의 LOI에는 응답할 수 없습니다.")
  }

  const updateData: Record<string, unknown> = {
    status,
    responded_at: new Date().toISOString(),
  }
  if (notes) {
    updateData.response_notes = notes
  }

  const { error } = await supabase
    .from("lois")
    .update(updateData)
    .eq("id", loiId)

  if (error) {
    console.error("Error responding to LOI:", error)
    throw new Error("LOI 응답에 실패했습니다.")
  }

  // Insert system message
  const statusLabels: Record<string, string> = {
    accepted: "수락",
    rejected: "거절",
    countered: "역제안",
  }

  await supabase.from("messages").insert({
    room_id: loi.room_id,
    sender_id: user.id,
    content: `LOI(의향서)가 ${statusLabels[status]}되었습니다.${notes ? ` 메모: ${notes}` : ""}`,
    message_type: "system",
  })

  // If accepted, update room status
  if (status === "accepted") {
    await supabase
      .from("deal_rooms")
      .update({ status: "active", updated_at: new Date().toISOString() })
      .eq("id", loi.room_id)
  }
}

/**
 * Get LOIs for a room.
 */
export async function getLOIs(roomId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify user is a participant
  const { data: room } = await supabase
    .from("deal_rooms")
    .select("buyer_id, seller_id")
    .eq("id", roomId)
    .single()

  if (!room || (room.buyer_id !== user.id && room.seller_id !== user.id)) {
    return []
  }

  const { data, error } = await supabase
    .from("lois")
    .select(
      `
      *,
      proposer:profiles!proposer_id (
        id,
        display_name,
        avatar_url
      )
    `
    )
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching LOIs:", error)
    return []
  }

  return data ?? []
}

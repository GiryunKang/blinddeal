"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

export interface LOIData {
  proposed_price: number
  proposed_terms: string
  conditions: string[]
  valid_until: string
}

/**
 * Create a Letter of Intent for a room.
 */
export async function createLOI(roomId: string, data: LOIData): Promise<{ success: true; data: NonNullable<unknown> } | { success: false; error: string }> {
  // Validate proposed_price
  if (!Number.isFinite(data.proposed_price) || data.proposed_price <= 0) {
    return { success: false, error: "제안 금액은 0보다 큰 유효한 숫자여야 합니다." }
  }

  // Validate valid_until is future date
  const validUntilDate = new Date(data.valid_until)
  if (isNaN(validUntilDate.getTime()) || validUntilDate <= new Date()) {
    return { success: false, error: "유효 기간은 미래 날짜여야 합니다." }
  }

  // Sanitize text inputs
  const sanitizedTerms = data.proposed_terms.slice(0, 5000)
  const sanitizedConditions = (data.conditions || []).map(c => c.slice(0, 500)).slice(0, 20)

  const user = await requireAuth()
  const supabase = await createClient()

  // Verify user is a participant
  const { data: room } = await supabase
    .from("deal_rooms")
    .select("buyer_id, seller_id")
    .eq("id", roomId)
    .single()

  if (!room || (room.buyer_id !== user.id && room.seller_id !== user.id)) {
    return { success: false, error: "이 대화방에 접근할 수 없습니다." }
  }

  // Prevent duplicate active LOI
  const { data: existingLOI } = await supabase
    .from("loi_documents")
    .select("id")
    .eq("room_id", roomId)
    .eq("status", "sent")
    .maybeSingle()

  if (existingLOI) {
    return { success: false, error: "이미 대기 중인 의향서가 있습니다. 기존 의향서가 처리된 후 다시 제출해주세요." }
  }

  const { data: loi, error } = await supabase
    .from("loi_documents")
    .insert({
      room_id: roomId,
      sender_id: user.id,
      proposed_price: data.proposed_price,
      proposed_terms: sanitizedTerms,
      conditions: Array.isArray(sanitizedConditions) ? sanitizedConditions : [sanitizedConditions],
      valid_until: data.valid_until,
      status: "sent",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating LOI:", error)
    return { success: false, error: "LOI 제출에 실패했습니다." }
  }

  // Insert a system message
  await supabase.from("messages").insert({
    room_id: roomId,
    sender_id: user.id,
    content: `LOI(의향서)가 제출되었습니다. 제안 금액: ${new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(data.proposed_price)}`,
    message_type: "system",
  })

  return { success: true, data: loi }
}

/**
 * Accept, reject, or counter an LOI.
 */
export async function respondToLOI(
  loiId: string,
  status: "accepted" | "rejected" | "countered",
  notes?: string
): Promise<{ success: true } | { success: false; error: string }> {
  const user = await requireAuth()
  const supabase = await createClient()

  // Get the LOI
  const { data: loi } = await supabase
    .from("loi_documents")
    .select("*, room:deal_rooms!room_id(buyer_id, seller_id, deal_id)")
    .eq("id", loiId)
    .single()

  if (!loi) {
    return { success: false, error: "LOI를 찾을 수 없습니다." }
  }

  const room = loi.room as { buyer_id: string; seller_id: string; deal_id: string } | null
  if (!room || (room.buyer_id !== user.id && room.seller_id !== user.id)) {
    return { success: false, error: "이 LOI에 접근할 수 없습니다." }
  }

  // Cannot respond to own LOI
  if (loi.sender_id === user.id) {
    return { success: false, error: "본인의 LOI에는 응답할 수 없습니다." }
  }

  const updateData: Record<string, unknown> = {
    status,
    responded_at: new Date().toISOString(),
  }
  if (notes) {
    updateData.response_notes = notes
  }

  const { error } = await supabase
    .from("loi_documents")
    .update(updateData)
    .eq("id", loiId)

  if (error) {
    console.error("Error responding to LOI:", error)
    return { success: false, error: "LOI 응답에 실패했습니다." }
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

  // If accepted, update room status and sync deal status
  if (status === "accepted") {
    await supabase
      .from("deal_rooms")
      .update({ status: "loi_exchanged", updated_at: new Date().toISOString() })
      .eq("id", loi.room_id)

    if (room?.deal_id) {
      await supabase
        .from("deals")
        .update({ status: "under_negotiation" })
        .eq("id", room.deal_id)
    }
  }

  return { success: true }
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
    .from("loi_documents")
    .select(
      `
      *,
      sender:profiles!sender_id (
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

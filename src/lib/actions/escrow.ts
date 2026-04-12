"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

export async function createEscrow(
  roomId: string,
  dealId: string,
  amount: number
) {
  await requireAuth()
  const supabase = await createClient()

  const { data: room } = await supabase
    .from("deal_rooms")
    .select("buyer_id, seller_id")
    .eq("id", roomId)
    .single()

  if (!room) {
    throw new Error("에스크로 파트너 연결 등록에 실패했습니다.")
  }

  const { data: existing } = await supabase
    .from("escrow_accounts")
    .select("id")
    .eq("room_id", roomId)
    .maybeSingle()

  if (existing) {
    throw new Error("이미 에스크로 파트너 연결이 존재합니다.")
  }

  const { data, error } = await supabase
    .from("escrow_accounts")
    .insert({
      room_id: roomId,
      deal_id: dealId,
      buyer_id: room.buyer_id,
      seller_id: room.seller_id,
      total_amount: amount,
      currency: "KRW",
      status: "created",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating escrow:", error)
    throw new Error("에스크로 파트너 연결 등록에 실패했습니다.")
  }

  return data
}

export async function getEscrow(roomId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: room } = await supabase
    .from("deal_rooms")
    .select("buyer_id, seller_id")
    .eq("id", roomId)
    .single()

  if (!room || (room.buyer_id !== user.id && room.seller_id !== user.id)) {
    return null
  }

  const { data, error } = await supabase
    .from("escrow_accounts")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    return null
  }

  return data
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  created: ["funded"],
  funded: ["in_review", "released", "disputed"],
  in_review: ["releasing", "disputed"],
  releasing: ["released"],
  released: [],
  refunded: [],
  disputed: ["refunded"],
}

export async function updateEscrowStatus(
  escrowId: string,
  status: "created" | "funded" | "in_review" | "releasing" | "released" | "refunded" | "disputed"
) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify authorization: only buyer or seller of this escrow can update it
  const { data: escrowRecord } = await supabase
    .from("escrow_accounts")
    .select("buyer_id, seller_id, status")
    .eq("id", escrowId)
    .single()

  if (!escrowRecord || (escrowRecord.buyer_id !== user.id && escrowRecord.seller_id !== user.id)) {
    throw new Error("권한이 없습니다.")
  }

  // Validate state transition
  const currentStatus = escrowRecord.status
  const allowed = VALID_TRANSITIONS[currentStatus] ?? []
  if (!allowed.includes(status)) {
    throw new Error(`현재 상태(${currentStatus})에서 ${status}로 변경할 수 없습니다.`)
  }

  const updateData: Record<string, unknown> = {
    status,
  }

  if (status === "funded") {
    updateData.funded_at = new Date().toISOString()
  } else if (status === "released") {
    updateData.released_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from("escrow_accounts")
    .update(updateData)
    .eq("id", escrowId)
    .select()
    .single()

  if (error) {
    console.error("Error updating escrow status:", error)
    throw new Error("에스크로 상태 업데이트에 실패했습니다.")
  }

  return data
}

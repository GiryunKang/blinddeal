"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

export async function createEscrow(
  roomId: string,
  dealId: string,
  amount: number
) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("escrows")
    .insert({
      room_id: roomId,
      deal_id: dealId,
      amount,
      currency: "KRW",
      status: "pending",
      created_by: user.id,
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
    .from("escrows")
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

export async function updateEscrowStatus(
  escrowId: string,
  status: "pending" | "funded" | "released" | "disputed" | "refunded"
) {
  await requireAuth()
  const supabase = await createClient()

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "funded") {
    updateData.funded_at = new Date().toISOString()
  } else if (status === "released") {
    updateData.released_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from("escrows")
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

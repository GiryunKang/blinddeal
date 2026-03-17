"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"
import { checkNDA } from "./nda"

/**
 * Start an inquiry for a deal.
 * - If a room already exists for this deal+user, return the existing roomId.
 * - If the deal is private and NDA not signed, return { needsNDA: true }.
 * - Otherwise, create a new room and return the roomId.
 */
export async function startInquiry(dealId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Get deal info
  const { data: deal, error: dealError } = await supabase
    .from("deals")
    .select("id, owner_id, visibility")
    .eq("id", dealId)
    .single()

  if (dealError || !deal) {
    throw new Error("딜을 찾을 수 없습니다.")
  }

  // Cannot inquire your own deal
  if (deal.owner_id === user.id) {
    throw new Error("본인의 딜에는 문의할 수 없습니다.")
  }

  // Check if room already exists
  const { data: existingRoom } = await supabase
    .from("deal_rooms")
    .select("id")
    .eq("deal_id", dealId)
    .eq("buyer_id", user.id)
    .single()

  if (existingRoom) {
    return { roomId: existingRoom.id }
  }

  // Check NDA requirement for private deals
  if (deal.visibility === "private") {
    const ndaResult = await checkNDA(dealId)
    if (!ndaResult.signed) {
      return { needsNDA: true }
    }
  }

  // Create a new room
  const { data: room, error } = await supabase
    .from("deal_rooms")
    .insert({
      deal_id: dealId,
      buyer_id: user.id,
      seller_id: deal.owner_id,
      status: "pending",
    })
    .select("id")
    .single()

  if (error || !room) {
    console.error("Error creating room:", error)
    throw new Error("대화방 생성에 실패했습니다.")
  }

  // Insert a system message
  await supabase.from("messages").insert({
    room_id: room.id,
    sender_id: user.id,
    content: "딜 문의가 시작되었습니다.",
    message_type: "system",
  })

  return { roomId: room.id }
}

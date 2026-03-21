"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

/**
 * Get all deal rooms for the current user (as buyer or seller).
 * Joins with deal and participant profiles.
 */
export async function getRooms() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("deal_rooms")
      .select(
        `
        *,
        deal:deals!deal_id (
          id,
          title,
          deal_category,
          asking_price,
          status,
          slug
        ),
        buyer:profiles!buyer_id (
          id,
          display_name,
          avatar_url,
          company_name
        ),
        seller:profiles!seller_id (
          id,
          display_name,
          avatar_url,
          company_name
        )
      `
      )
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching rooms:", error)
      return { success: false, error: "대화방 목록을 불러올 수 없습니다.", data: [] }
    }

    // Fetch last message for each room
    const roomsWithLastMessage = await Promise.all(
      (data ?? []).map(async (room) => {
        const { data: messages } = await supabase
          .from("messages")
          .select("content, created_at, sender_id, is_read")
          .eq("room_id", room.id)
          .order("created_at", { ascending: false })
          .limit(1)

        return {
          ...room,
          last_message: messages?.[0] ?? null,
        }
      })
    )

    return { success: true, data: roomsWithLastMessage }
  } catch (err) {
    console.error("Unexpected error fetching rooms:", err)
    return { success: false, error: "대화방 목록을 불러오는 중 오류가 발생했습니다.", data: [] }
  }
}

/**
 * Get a single room with deal and participant profiles.
 */
export async function getRoom(roomId: string) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("deal_rooms")
      .select(
        `
        *,
        deal:deals!deal_id (
          id,
          title,
          deal_category,
          asking_price,
          status,
          slug,
          description
        ),
        buyer:profiles!buyer_id (
          id,
          display_name,
          avatar_url,
          company_name
        ),
        seller:profiles!seller_id (
          id,
          display_name,
          avatar_url,
          company_name
        )
      `
      )
      .eq("id", roomId)
      .single()

    if (error || !data) {
      console.error("Error fetching room:", error)
      return { success: false, error: "대화방을 찾을 수 없습니다.", data: null }
    }

    // Verify user is a participant
    if (data.buyer_id !== user.id && data.seller_id !== user.id) {
      return { success: false, error: "이 대화방에 접근할 수 없습니다.", data: null }
    }

    return { success: true, data }
  } catch (err) {
    console.error("Unexpected error fetching room:", err)
    return { success: false, error: "대화방을 불러오는 중 오류가 발생했습니다.", data: null }
  }
}

/**
 * Create a new deal room (current user as buyer, deal owner as seller).
 */
export async function createRoom(dealId: string) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    // Get the deal to find the owner
    const { data: deal, error: dealError } = await supabase
      .from("deals")
      .select("id, owner_id")
      .eq("id", dealId)
      .single()

    if (dealError || !deal) {
      return { success: false, error: "딜을 찾을 수 없습니다." }
    }

    // Cannot create a room with yourself
    if (deal.owner_id === user.id) {
      return { success: false, error: "본인의 딜에는 문의할 수 없습니다." }
    }

    // Check if room already exists
    const { data: existing } = await supabase
      .from("deal_rooms")
      .select("id")
      .eq("deal_id", dealId)
      .eq("buyer_id", user.id)
      .single()

    if (existing) {
      return { success: true, roomId: existing.id }
    }

    // Create the room
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
      return { success: false, error: "대화방 생성에 실패했습니다." }
    }

    // Insert a system message
    await supabase.from("messages").insert({
      room_id: room.id,
      sender_id: user.id,
      content: "대화방이 생성되었습니다.",
      message_type: "system",
    })

    return { success: true, roomId: room.id }
  } catch (err) {
    console.error("Unexpected error creating room:", err)
    return { success: false, error: "대화방 생성 중 오류가 발생했습니다." }
  }
}

/**
 * Get messages for a room, ordered by created_at.
 * Joins with sender profile.
 */
export async function getMessages(roomId: string) {
  try {
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
      .from("messages")
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
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching messages:", error)
      return []
    }

    return data ?? []
  } catch (err) {
    console.error("Unexpected error fetching messages:", err)
    return []
  }
}

/**
 * Insert a message into a room.
 */
export async function sendMessage(
  roomId: string,
  content: string,
  type: "text" | "file" | "system" = "text"
) {
  try {
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

    const { error } = await supabase.from("messages").insert({
      room_id: roomId,
      sender_id: user.id,
      content,
      message_type: type,
    })

    if (error) {
      console.error("Error sending message:", error)
      return { success: false, error: "메시지 전송에 실패했습니다." }
    }

    // Update room's updated_at
    await supabase
      .from("deal_rooms")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", roomId)

    return { success: true }
  } catch (err) {
    console.error("Unexpected error sending message:", err)
    return { success: false, error: "메시지 전송 중 오류가 발생했습니다." }
  }
}

/**
 * Update room status.
 */
export async function updateRoomStatus(
  roomId: string,
  status: "pending" | "active" | "completed" | "cancelled"
) {
  try {
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

    const { error } = await supabase
      .from("deal_rooms")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", roomId)

    if (error) {
      console.error("Error updating room status:", error)
      return { success: false, error: "상태 변경에 실패했습니다." }
    }

    // Insert a system message
    const statusLabels: Record<string, string> = {
      pending: "대기 중",
      active: "활성",
      completed: "완료",
      cancelled: "취소",
    }

    await supabase.from("messages").insert({
      room_id: roomId,
      sender_id: user.id,
      content: `대화방 상태가 '${statusLabels[status]}'(으)로 변경되었습니다.`,
      message_type: "system",
    })

    return { success: true }
  } catch (err) {
    console.error("Unexpected error updating room status:", err)
    return { success: false, error: "상태 변경 중 오류가 발생했습니다." }
  }
}

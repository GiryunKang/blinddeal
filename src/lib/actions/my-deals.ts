"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

/**
 * Get all deals owned by the current user.
 */
export async function getMyDeals() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching my deals:", error)
    return []
  }

  return data ?? []
}

/**
 * Get all deals the user has expressed interest in, joined with deal info.
 */
export async function getMyInterests() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("deal_interests")
    .select(
      `
      *,
      deal:deals!deal_id (
        id,
        title,
        slug,
        deal_category,
        asking_price,
        status,
        thumbnail_url,
        visibility
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching my interests:", error)
    return []
  }

  return data ?? []
}

/**
 * Get all deal rooms the user participates in, with deal info and latest message.
 */
export async function getMyRooms() {
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
        slug,
        deal_category,
        asking_price,
        status
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
    .limit(10)

  if (error) {
    console.error("Error fetching my rooms:", error)
    return []
  }

  // Fetch last message for each room
  const roomsWithLastMessage = await Promise.all(
    (data ?? []).map(async (room) => {
      const { data: messages } = await supabase
        .from("messages")
        .select("content, created_at, sender_id")
        .eq("room_id", room.id)
        .order("created_at", { ascending: false })
        .limit(1)

      return {
        ...room,
        last_message: messages?.[0] ?? null,
      }
    })
  )

  return roomsWithLastMessage
}

/**
 * Get count of deals by status for the current user.
 */
export async function getMyDealStats() {
  const user = await requireAuth()
  const supabase = await createClient()

  const statuses = [
    "draft",
    "pending_review",
    "active",
    "under_negotiation",
    "due_diligence",
    "closing",
    "closed",
  ] as const

  const counts: Record<string, number> = {}

  // Fetch all deals and group by status
  const { data, error } = await supabase
    .from("deals")
    .select("status")
    .eq("owner_id", user.id)

  if (error) {
    console.error("Error fetching deal stats:", error)
    for (const s of statuses) counts[s] = 0
    return counts
  }

  for (const s of statuses) counts[s] = 0
  for (const deal of data ?? []) {
    if (deal.status in counts) {
      counts[deal.status]++
    }
  }

  return counts
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

export async function getMatchPreferences() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("match_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching match preferences:", error)
  }

  return data
}

export interface MatchPreferencesData {
  deal_categories: string[]
  min_price: number | null
  max_price: number | null
  regions: string[]
  industries: string[]
  keywords: string[]
  notify_email: boolean
  notify_push: boolean
}

export async function saveMatchPreferences(data: MatchPreferencesData) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Check if existing preferences exist
  const { data: existing } = await supabase
    .from("match_preferences")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (existing) {
    // Update
    const { error } = await supabase
      .from("match_preferences")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)

    if (error) {
      console.error("Error updating match preferences:", error)
      throw new Error("매칭 설정 저장에 실패했습니다.")
    }
  } else {
    // Insert
    const { error } = await supabase.from("match_preferences").insert({
      user_id: user.id,
      ...data,
    })

    if (error) {
      console.error("Error creating match preferences:", error)
      throw new Error("매칭 설정 저장에 실패했습니다.")
    }
  }

  return { success: true }
}

export async function getNotifications(page: number = 1) {
  const user = await requireAuth()
  const supabase = await createClient()
  const limit = 20

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) {
    console.error("Error fetching notifications:", error)
    return { notifications: [], count: 0 }
  }

  return { notifications: data ?? [], count: count ?? 0 }
}

export async function markNotificationRead(id: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error marking notification as read:", error)
    throw new Error("알림 처리에 실패했습니다.")
  }

  return { success: true }
}

export async function markAllNotificationsRead() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  if (error) {
    console.error("Error marking all notifications as read:", error)
    throw new Error("알림 처리에 실패했습니다.")
  }

  return { success: true }
}

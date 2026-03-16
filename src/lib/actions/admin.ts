"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

async function requireAdmin() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    throw new Error("관리자 권한이 필요합니다.")
  }

  return user
}

export async function getAdminStats() {
  await requireAdmin()
  const supabase = await createClient()

  const [usersRes, dealsRes, roomsRes, escrowsRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("deals").select("id", { count: "exact", head: true }),
    supabase
      .from("deal_rooms")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("escrows")
      .select("amount")
      .eq("status", "released"),
  ])

  const totalRevenue = (escrowsRes.data ?? []).reduce(
    (sum: number, e: { amount: number }) => sum + (e.amount || 0),
    0
  )

  return {
    totalUsers: usersRes.count ?? 0,
    totalDeals: dealsRes.count ?? 0,
    activeRooms: roomsRes.count ?? 0,
    totalRevenue,
  }
}

export async function getPendingDeals() {
  await requireAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("deals")
    .select(
      `
      *,
      owner:profiles!owner_id (
        id,
        display_name,
        avatar_url,
        company_name
      )
    `
    )
    .eq("status", "pending_review")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching pending deals:", error)
    return []
  }

  return data ?? []
}

export async function approveDeal(dealId: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("deals")
    .update({ status: "active", approved_at: new Date().toISOString() })
    .eq("id", dealId)
    .select()
    .single()

  if (error) {
    console.error("Error approving deal:", error)
    throw new Error("딜 승인에 실패했습니다.")
  }

  return data
}

export async function rejectDeal(dealId: string, reason: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("deals")
    .update({
      status: "rejected",
      rejection_reason: reason,
      rejected_at: new Date().toISOString(),
    })
    .eq("id", dealId)
    .select()
    .single()

  if (error) {
    console.error("Error rejecting deal:", error)
    throw new Error("딜 거절에 실패했습니다.")
  }

  return data
}

export async function getPendingVerifications() {
  await requireAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("verification_records")
    .select(
      `
      *,
      profile:profiles!user_id (
        id,
        display_name,
        avatar_url,
        company_name,
        email
      )
    `
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching pending verifications:", error)
    return []
  }

  return data ?? []
}

export async function approveVerification(recordId: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("verification_records")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", recordId)
    .select()
    .single()

  if (error) {
    console.error("Error approving verification:", error)
    throw new Error("인증 승인에 실패했습니다.")
  }

  // Update profile verification status
  if (data?.user_id) {
    await supabase
      .from("profiles")
      .update({ is_verified: true })
      .eq("id", data.user_id)
  }

  return data
}

export async function getUsers(page: number = 1) {
  await requireAdmin()
  const supabase = await createClient()

  const limit = 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) {
    console.error("Error fetching users:", error)
    return { users: [], count: 0 }
  }

  return { users: data ?? [], count: count ?? 0 }
}

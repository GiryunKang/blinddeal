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

  if (data?.user_id) {
    const levelMap: Record<string, number> = {
      phone: 1,
      business_registration: 2,
      corporate_registration: 2,
      asset_proof: 3,
      credit_rating: 3,
      expert_letter: 4,
      identity_pass: 4,
    }
    const newLevel = levelMap[data.verification_type] ?? 0

    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("verification_level")
      .eq("id", data.user_id)
      .single()

    const currentLevel = currentProfile?.verification_level ?? 0
    const finalLevel = Math.max(newLevel, currentLevel)

    if (newLevel > currentLevel) {
      await supabase
        .from("profiles")
        .update({ verification_level: finalLevel })
        .eq("id", data.user_id)
    }

    await supabase.from("notifications").insert({
      user_id: data.user_id,
      type: "system",
      title: "인증이 승인되었습니다",
      body: `인증 등급이 Lv.${finalLevel}로 업데이트되었습니다. 더 많은 딜에 접근할 수 있습니다.`,
      link: "/profile/verification",
    })
  }

  return data
}

export async function rejectVerification(recordId: string, reason?: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("verification_records")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      notes: reason || null,
    })
    .eq("id", recordId)
    .select()
    .single()

  if (error) {
    throw new Error("인증 거절에 실패했습니다.")
  }

  if (data?.user_id) {
    await supabase.from("notifications").insert({
      user_id: data.user_id,
      type: "system",
      title: "인증 요청이 반려되었습니다",
      body: reason
        ? `사유: ${reason}. 서류를 확인 후 다시 제출해주세요.`
        : "서류를 확인 후 다시 제출해주세요.",
      link: "/profile/verification",
    })
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

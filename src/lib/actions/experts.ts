"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

export type ExpertType = "법무" | "회계" | "세무" | "감정" | "컨설팅"

export interface ExpertFilters {
  type?: ExpertType
  search?: string
  page?: number
  limit?: number
}

export async function getExperts(filters: ExpertFilters = {}) {
  const supabase = await createClient()

  const {
    type,
    search,
    page = 1,
    limit = 12,
  } = filters

  let query = supabase
    .from("experts")
    .select(
      `
      *,
      profile:profiles!user_id (
        id,
        display_name,
        avatar_url,
        company_name,
        bio
      )
    `,
      { count: "exact" }
    )
    .eq("is_available", true)

  if (type) {
    query = query.contains("specialty", [type])
  }

  if (search) {
    query = query.or(
      `introduction.ilike.%${search}%`
    )
  }

  query = query.order("rating", { ascending: false })

  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching experts:", error)
    return { experts: [], count: 0 }
  }

  return { experts: data ?? [], count: count ?? 0 }
}

export async function getExpert(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("experts")
    .select(
      `
      *,
      profile:profiles!user_id (
        id,
        display_name,
        avatar_url,
        company_name,
        bio,
        phone,
        email
      )
    `
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching expert:", error)
    return null
  }

  return data
}

export async function requestExpertAssignment(
  dealId: string,
  expertId: string,
  role: string
) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("expert_assignments")
    .insert({
      deal_id: dealId,
      expert_id: expertId,
      requested_by: user.id,
      role,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Error requesting expert assignment:", error)
    throw new Error("전문가 배정 요청에 실패했습니다.")
  }

  return data
}

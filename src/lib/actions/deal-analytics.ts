"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

export async function getDealAnalytics(dealId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify ownership
  const { data: deal } = await supabase
    .from("deals")
    .select("id, view_count, interest_count, owner_id")
    .eq("id", dealId)
    .eq("owner_id", user.id)
    .single()

  if (!deal) {
    return null
  }

  // Count NDA agreements
  const { count: ndaCount } = await supabase
    .from("nda_agreements")
    .select("id", { count: "exact", head: true })
    .eq("deal_id", dealId)

  // Count unique interest users as approximate unique visitors
  const { count: interestCount } = await supabase
    .from("deal_interests")
    .select("id", { count: "exact", head: true })
    .eq("deal_id", dealId)

  return {
    viewCount: deal.view_count ?? 0,
    uniqueVisitors: deal.view_count ?? 0, // approximate
    interestCount: interestCount ?? 0,
    ndaCount: ndaCount ?? 0,
  }
}

export async function getDealInterestUsers(dealId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify ownership
  const { data: deal } = await supabase
    .from("deals")
    .select("id")
    .eq("id", dealId)
    .eq("owner_id", user.id)
    .single()

  if (!deal) {
    return []
  }

  const { data: interests } = await supabase
    .from("deal_interests")
    .select(
      `
      id,
      created_at,
      user:profiles!user_id (
        id,
        display_name,
        user_type,
        verification_level,
        avatar_url,
        company_name
      )
    `
    )
    .eq("deal_id", dealId)
    .order("created_at", { ascending: false })

  return interests ?? []
}

export async function getDealNDAUsers(dealId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify ownership
  const { data: deal } = await supabase
    .from("deals")
    .select("id")
    .eq("id", dealId)
    .eq("owner_id", user.id)
    .single()

  if (!deal) {
    return []
  }

  const { data: ndaUsers } = await supabase
    .from("nda_agreements")
    .select(
      `
      id,
      signed_at,
      nda_version,
      user:profiles!user_id (
        id,
        display_name,
        user_type,
        verification_level,
        avatar_url,
        company_name
      )
    `
    )
    .eq("deal_id", dealId)
    .order("signed_at", { ascending: false })

  return ndaUsers ?? []
}

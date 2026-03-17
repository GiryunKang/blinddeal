"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

interface MatchBreakdown {
  category: number
  price: number
  region: number
  industry: number
  keywords: number
}

export interface MatchResult {
  score: number
  breakdown: MatchBreakdown
}

interface DealForMatching {
  id: string
  deal_category: string
  asking_price: number | null
  city: string | null
  district: string | null
  industry: string | null
  tags: string[] | null
  title: string
  description: string
  [key: string]: unknown
}

interface MatchPreferences {
  deal_categories: string[]
  min_price: number | null
  max_price: number | null
  regions: string[]
  industries: string[]
  keywords: string[]
}

export async function calculateMatchScore(
  deal: DealForMatching,
  prefs: MatchPreferences
): Promise<MatchResult> {
  const breakdown: MatchBreakdown = {
    category: 0,
    price: 0,
    region: 0,
    industry: 0,
    keywords: 0,
  }

  // Category match (30pts)
  if (
    prefs.deal_categories &&
    prefs.deal_categories.length > 0 &&
    prefs.deal_categories.includes(deal.deal_category)
  ) {
    breakdown.category = 30
  }

  // Price range match (25pts)
  if (deal.asking_price !== null) {
    const min = prefs.min_price
    const max = prefs.max_price
    if (min === null && max === null) {
      // No price preference => full score
      breakdown.price = 25
    } else if (min !== null && max !== null) {
      if (deal.asking_price >= min && deal.asking_price <= max) {
        breakdown.price = 25
      } else {
        // Partial score if within 20% range
        const range = max - min
        const distance = deal.asking_price < min
          ? min - deal.asking_price
          : deal.asking_price - max
        const ratio = range > 0 ? distance / range : 1
        if (ratio <= 0.2) {
          breakdown.price = Math.round(25 * (1 - ratio))
        }
      }
    } else if (min !== null && deal.asking_price >= min) {
      breakdown.price = 25
    } else if (max !== null && deal.asking_price <= max) {
      breakdown.price = 25
    }
  } else {
    // No price set on deal, give partial score
    breakdown.price = 10
  }

  // Region match (20pts)
  if (prefs.regions && prefs.regions.length > 0) {
    const dealRegions = [deal.city, deal.district].filter(Boolean) as string[]
    const matched = prefs.regions.some((r) =>
      dealRegions.some((dr) => dr.includes(r) || r.includes(dr))
    )
    if (matched) {
      breakdown.region = 20
    }
  } else {
    // No region preference => full score
    breakdown.region = 20
  }

  // Industry match (15pts)
  if (prefs.industries && prefs.industries.length > 0) {
    if (deal.industry && prefs.industries.includes(deal.industry)) {
      breakdown.industry = 15
    }
  } else {
    breakdown.industry = 15
  }

  // Keyword overlap (10pts)
  if (prefs.keywords && prefs.keywords.length > 0) {
    const dealText = `${deal.title} ${deal.description} ${(deal.tags || []).join(" ")}`.toLowerCase()
    const matchedCount = prefs.keywords.filter((kw) =>
      dealText.includes(kw.toLowerCase())
    ).length
    const ratio = matchedCount / prefs.keywords.length
    breakdown.keywords = Math.round(10 * ratio)
  } else {
    breakdown.keywords = 10
  }

  const score =
    breakdown.category +
    breakdown.price +
    breakdown.region +
    breakdown.industry +
    breakdown.keywords

  return { score, breakdown }
}

export async function getMatchedDeals(userId?: string) {
  const user = userId ? { id: userId } : await requireAuth()
  const supabase = await createClient()

  // Get user's match preferences
  const { data: prefs } = await supabase
    .from("match_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!prefs) {
    return { deals: [], hasPreferences: false }
  }

  // Get active deals (exclude user's own deals)
  const { data: deals } = await supabase
    .from("deals")
    .select(
      `
      *,
      owner:profiles!owner_id (
        id,
        display_name,
        avatar_url,
        verification_level,
        company_name
      )
    `
    )
    .in("status", ["active", "under_negotiation"])
    .neq("owner_id", user.id)

  if (!deals || deals.length === 0) {
    return { deals: [], hasPreferences: true }
  }

  // Calculate match scores
  const scored = await Promise.all(
    deals.map(async (deal) => ({
      ...deal,
      matchResult: await calculateMatchScore(deal as DealForMatching, prefs),
    }))
  )

  // Sort by score descending
  scored.sort((a, b) => b.matchResult.score - a.matchResult.score)

  return { deals: scored, hasPreferences: true }
}

export async function getMatchedBuyers(dealId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify ownership
  const { data: deal } = await supabase
    .from("deals")
    .select("*")
    .eq("id", dealId)
    .eq("owner_id", user.id)
    .single()

  if (!deal) {
    throw new Error("딜을 찾을 수 없거나 권한이 없습니다.")
  }

  // Get all users with match preferences (excluding deal owner)
  const { data: allPrefs } = await supabase
    .from("match_preferences")
    .select(
      `
      *,
      user:profiles!user_id (
        id,
        display_name,
        avatar_url,
        verification_level,
        company_name,
        user_type
      )
    `
    )
    .neq("user_id", user.id)

  if (!allPrefs || allPrefs.length === 0) {
    return []
  }

  const dealForMatching = deal as DealForMatching

  const allScored = await Promise.all(
    allPrefs.map(async (pref) => ({
      user: pref.user,
      matchResult: await calculateMatchScore(dealForMatching, pref),
    }))
  )

  const scored = allScored
    .filter((item) => item.matchResult.score >= 30)
    .sort((a, b) => b.matchResult.score - a.matchResult.score)

  return scored
}

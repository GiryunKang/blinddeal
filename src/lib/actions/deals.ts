"use server"

import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/auth"

export interface DealFilters {
  category?: "real_estate" | "ma"
  dealType?: string
  minPrice?: number
  maxPrice?: number
  city?: string
  industry?: string
  visibility?: "public" | "private"
  search?: string
  sortBy?: "latest" | "popular" | "price_high" | "price_low"
  page?: number
  limit?: number
}

export async function getDeals(filters: DealFilters = {}) {
  try {
    const supabase = await createClient()
    const user = await getUser()

    const {
      category,
      dealType,
      minPrice,
      maxPrice,
      city,
      industry,
      visibility,
      search,
      sortBy = "latest",
      page = 1,
      limit = 12,
    } = filters

    let query = supabase
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
      `,
        { count: "exact" }
      )

    // Only show active/under_negotiation deals (plus owner's own)
    if (user) {
      query = query.or(
        `status.in.("active","under_negotiation"),owner_id.eq.${user.id}`
      )
    } else {
      query = query.in("status", ["active", "under_negotiation"])
    }

    // Apply filters
    if (category) {
      query = query.eq("deal_category", category)
    }

    if (dealType) {
      query = query.eq("deal_type", dealType)
    }

    if (minPrice !== undefined) {
      query = query.gte("asking_price", minPrice)
    }

    if (maxPrice !== undefined) {
      query = query.lte("asking_price", maxPrice)
    }

    if (city) {
      query = query.eq("city", city)
    }

    if (industry) {
      query = query.eq("industry", industry)
    }

    if (visibility) {
      query = query.eq("visibility", visibility)
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,city.ilike.%${search}%,industry.ilike.%${search}%`
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "popular":
        query = query.order("view_count", { ascending: false })
        break
      case "price_high":
        query = query.order("asking_price", { ascending: false, nullsFirst: false })
        break
      case "price_low":
        query = query.order("asking_price", { ascending: true, nullsFirst: false })
        break
      case "latest":
      default:
        query = query.order("created_at", { ascending: false })
        break
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching deals:", error)
      return { deals: [], count: 0 }
    }

    return { deals: data ?? [], count: count ?? 0 }
  } catch (err) {
    console.error("Unexpected error fetching deals:", err)
    return { deals: [], count: 0 }
  }
}

export async function getDealBySlug(slug: string) {
  try {
    const supabase = await createClient()

    const { data: deal, error } = await supabase
      .from("deals")
      .select(
        `
        *,
        owner:profiles!owner_id (
          id,
          display_name,
          avatar_url,
          verification_level,
          company_name,
          bio
        )
      `
      )
      .eq("slug", slug)
      .single()

    if (error || !deal) {
      return null
    }

    // Increment view count
    await supabase.rpc("increment_deal_view_count", {
      deal_uuid: deal.id,
    })

    return deal
  } catch (err) {
    console.error("Unexpected error fetching deal by slug:", err)
    return null
  }
}

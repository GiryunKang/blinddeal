"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

function generateSlug(title: string): string {
  // Remove everything except alphanumeric and spaces
  const base = title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove non-ASCII (including Korean)
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  const suffix = Math.random().toString(36).substring(2, 10)

  // If title was all Korean (base is empty), use just the suffix
  return base ? `${base}-${suffix}` : `deal-${suffix}`
}

export async function createDeal(formData: FormData) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const title = (formData.get("title") as string)?.trim()
    const description = (formData.get("description") as string)?.trim()
    const dealCategory = formData.get("deal_category") as string
    const dealType = formData.get("deal_type") as string
    const askingPriceStr = formData.get("asking_price") as string
    const visibility = (formData.get("visibility") as string) || "public"
    const requiredVerificationLevel = parseInt(
      (formData.get("required_verification_level") as string) || "0",
      10
    )

    // Server-side validation
    if (!title) {
      return { success: false, error: "딜 제목을 입력해주세요." }
    }
    if (!description) {
      return { success: false, error: "상세 설명을 입력해주세요." }
    }
    if (!dealType) {
      return { success: false, error: "딜 유형을 선택해주세요." }
    }

    const askingPrice = askingPriceStr ? parseInt(askingPriceStr, 10) : null
    if (askingPrice !== null && (isNaN(askingPrice) || askingPrice <= 0)) {
      return { success: false, error: "매각 희망가는 0보다 큰 숫자여야 합니다." }
    }

    const slug = generateSlug(title)

    // Build the insert object
    const dealData: Record<string, unknown> = {
      owner_id: user.id,
      title,
      slug,
      description,
      deal_category: dealCategory,
      deal_type: dealType,
      asking_price: askingPrice,
      visibility,
      required_verification_level: requiredVerificationLevel,
      status: "active",
    }

    // Real estate fields
    if (dealCategory === "real_estate") {
      const address = formData.get("address") as string
      const city = formData.get("city") as string
      const district = formData.get("district") as string
      const propertyAreaSqm = formData.get("property_area_sqm") as string
      const buildingAreaSqm = formData.get("building_area_sqm") as string
      const floorCount = formData.get("floor_count") as string
      const builtYear = formData.get("built_year") as string
      const zoning = formData.get("zoning") as string

      if (address) dealData.address = address
      if (city) dealData.city = city
      if (district) dealData.district = district
      if (propertyAreaSqm) dealData.property_area_sqm = parseFloat(propertyAreaSqm)
      if (buildingAreaSqm) dealData.building_area_sqm = parseFloat(buildingAreaSqm)
      if (floorCount) dealData.floor_count = parseInt(floorCount, 10)
      if (builtYear) dealData.built_year = parseInt(builtYear, 10)
      if (zoning) dealData.zoning = zoning
    }

    // M&A fields
    if (dealCategory === "ma") {
      const industry = formData.get("industry") as string
      const annualRevenue = formData.get("annual_revenue") as string
      const annualProfit = formData.get("annual_profit") as string
      const employeeCount = formData.get("employee_count") as string
      const foundedYear = formData.get("founded_year") as string

      if (industry) dealData.industry = industry
      if (annualRevenue) dealData.annual_revenue = parseInt(annualRevenue, 10)
      if (annualProfit) dealData.annual_profit = parseInt(annualProfit, 10)
      if (employeeCount) dealData.employee_count = parseInt(employeeCount, 10)
      if (foundedYear) dealData.founded_year = parseInt(foundedYear, 10)
    }

    // Highlight points and risk factors
    const highlightPoints = formData.get("highlight_points") as string
    const riskFactors = formData.get("risk_factors") as string

    if (highlightPoints) {
      dealData.highlight_points = highlightPoints
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    }

    if (riskFactors) {
      dealData.risk_factors = riskFactors
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    }

    const { error } = await supabase.from("deals").insert(dealData)

    if (error) {
      console.error("Error creating deal:", error)
      return { success: false, error: "딜 등록에 실패했습니다. 잠시 후 다시 시도해주세요." }
    }

    return { success: true, slug }
  } catch (err) {
    console.error("Unexpected error creating deal:", err)
    return { success: false, error: "딜 등록 중 오류가 발생했습니다." }
  }
}

export async function toggleDealInterest(dealId: string) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    // Check if interest already exists
    const { data: existing } = await supabase
      .from("deal_interests")
      .select("id")
      .eq("deal_id", dealId)
      .eq("user_id", user.id)
      .single()

    if (existing) {
      // Remove interest
      const { error } = await supabase
        .from("deal_interests")
        .delete()
        .eq("deal_id", dealId)
        .eq("user_id", user.id)

      if (error) {
        console.error("Error removing interest:", error)
        return { success: false, error: "관심 해제에 실패했습니다." }
      }

      return { success: true, interested: false }
    } else {
      // Add interest
      const { error } = await supabase.from("deal_interests").insert({
        deal_id: dealId,
        user_id: user.id,
      })

      if (error) {
        console.error("Error adding interest:", error)
        return { success: false, error: "관심 등록에 실패했습니다." }
      }

      return { success: true, interested: true }
    }
  } catch (err) {
    console.error("Unexpected error toggling interest:", err)
    return { success: false, error: "처리 중 오류가 발생했습니다." }
  }
}

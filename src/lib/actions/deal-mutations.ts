"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"
import { sanitizeText, truncate } from "@/lib/sanitize"
import { rateLimit, LIMITS } from "@/lib/rate-limit"

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
    const rl = rateLimit(`deal:${user.id}`, LIMITS.createDeal)
    if (!rl.success) {
      return { success: false, error: "딜 등록이 너무 빈번합니다. 잠시 후 다시 시도해주세요." }
    }
    const supabase = await createClient()

    const title = truncate(sanitizeText((formData.get("title") as string) ?? ""), 200)
    const description = truncate(sanitizeText((formData.get("description") as string) ?? ""), 10000)
    const dealCategory = sanitizeText((formData.get("deal_category") as string) ?? "")
    const dealType = sanitizeText((formData.get("deal_type") as string) ?? "")
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

    const { data: newDeal, error } = await supabase.from("deals").insert(dealData).select("id").single()

    if (error) {
      return { success: false, error: "딜 등록에 실패했습니다. 잠시 후 다시 시도해주세요." }
    }

    const imageCount = parseInt((formData.get("image_count") as string) || "0", 10)
    if (imageCount > 0 && newDeal?.id) {
      const imageUrls: string[] = []
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const file = formData.get(`image_${i}`) as File | null
        if (!file || file.size === 0) continue

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
        if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) continue

        const ext = file.name.split(".").pop() || "jpg"
        const path = `deals/${newDeal.id}/${i}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from("deal-images")
          .upload(path, file, { contentType: file.type, upsert: true })

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("deal-images").getPublicUrl(path)
          if (urlData?.publicUrl) imageUrls.push(urlData.publicUrl)
        }
      }

      if (imageUrls.length > 0) {
        await supabase
          .from("deals")
          .update({
            thumbnail_url: imageUrls[0],
            image_urls: imageUrls,
          })
          .eq("id", newDeal.id)
      }
    }

    try {
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "system",
        title: "딜이 등록되었습니다",
        body: `"${title}" 딜이 성공적으로 등록되었습니다. 대시보드에서 관리하세요.`,
        data: { dealId: newDeal?.id, slug }
      })

      if (visibility === "public" && newDeal?.id) {
        const { data: matchedUsers } = await supabase
          .from("profiles")
          .select("id, interests, preferred_deal_size_min, preferred_deal_size_max")
          .neq("id", user.id)
          .contains("interests", [dealCategory])
          .limit(20)

        if (matchedUsers && matchedUsers.length > 0) {
          const notifications = matchedUsers
            .filter((u) => {
              if (!askingPrice) return true
              const min = u.preferred_deal_size_min
              const max = u.preferred_deal_size_max
              if (min && askingPrice < min) return false
              if (max && askingPrice > max) return false
              return true
            })
            .slice(0, 10)
            .map((u) => ({
              user_id: u.id,
              type: "deal" as const,
              title: "관심 분야 새 딜 등록",
              body: `"${title}" — ${dealCategory === "real_estate" ? "부동산" : "M&A"} 새 딜이 등록되었습니다.`,
              link: `/deals/${slug}`,
            }))

          if (notifications.length > 0) {
            await supabase.from("notifications").insert(notifications)
          }
        }
      }
    } catch { /* ignore notification errors */ }

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
      const { error } = await supabase.from("deal_interests").insert({
        deal_id: dealId,
        user_id: user.id,
      })

      if (error) {
        return { success: false, error: "관심 등록에 실패했습니다." }
      }

      const { data: deal } = await supabase
        .from("deals")
        .select("owner_id, title")
        .eq("id", dealId)
        .single()

      if (deal && deal.owner_id !== user.id) {
        await supabase.from("notifications").insert({
          user_id: deal.owner_id,
          type: "deal",
          title: "새로운 관심 표시",
          body: `"${deal.title}" 딜에 새로운 관심이 등록되었습니다.`,
          link: `/deals/${dealId}`,
        })
      }

      return { success: true, interested: true }
    }
  } catch (err) {
    console.error("Unexpected error toggling interest:", err)
    return { success: false, error: "처리 중 오류가 발생했습니다." }
  }
}

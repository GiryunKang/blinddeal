"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

export async function updateDealVisibility(
  dealId: string,
  visibility: "public" | "private",
  requiredLevel?: number
) {
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
    throw new Error("딜을 찾을 수 없거나 권한이 없습니다.")
  }

  const updateData: Record<string, unknown> = {
    visibility,
    updated_at: new Date().toISOString(),
  }

  if (requiredLevel !== undefined) {
    updateData.required_verification_level = requiredLevel
  } else if (visibility === "public") {
    updateData.required_verification_level = 0
  }

  const { error } = await supabase
    .from("deals")
    .update(updateData)
    .eq("id", dealId)

  if (error) {
    console.error("Error updating deal visibility:", error)
    throw new Error("공개 범위 설정에 실패했습니다.")
  }

  return { success: true }
}

export async function getMatchedBuyersForDeal(dealId: string) {
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

  // Count matched buyers (users with match preferences that align)
  const { data: allPrefs } = await supabase
    .from("match_preferences")
    .select("user_id")
    .neq("user_id", user.id)
    .contains("deal_categories", [deal.deal_category])

  return { count: allPrefs?.length ?? 0 }
}

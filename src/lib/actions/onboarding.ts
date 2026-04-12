"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

export async function completeOnboarding(
  interests: string[],
  dealSizeMin: number | null,
  dealSizeMax: number | null
) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase
    .from("profiles")
    .update({
      interests,
      preferred_deal_size_min: dealSizeMin,
      preferred_deal_size_max: dealSizeMax,
      onboarding_completed: true,
    })
    .eq("id", user.id)

  if (error) {
    return { success: false, error: "온보딩 정보 저장에 실패했습니다." }
  }

  return { success: true }
}

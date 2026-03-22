"use server"

import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/auth"

/**
 * Check if current user has signed NDA for a given deal.
 */
export async function checkNDA(dealId: string) {
  try {
    const user = await getUser()
    if (!user) {
      return { signed: false }
    }

    const supabase = await createClient()

    const { data: agreement, error } = await supabase
      .from("nda_agreements")
      .select("*")
      .eq("deal_id", dealId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (error || !agreement) {
      return { signed: false }
    }

    return { signed: true, agreement }
  } catch (err) {
    console.error("Unexpected error checking NDA:", err)
    return { signed: false }
  }
}

/**
 * Sign NDA for a given deal. Creates a record in nda_agreements table.
 */
export async function signNDA(dealId: string) {
  try {
    const user = await getUser()
    if (!user) {
      return { success: false, error: "로그인이 필요합니다" }
    }
    const supabase = await createClient()

    // Get IP address from headers
    const headersList = await headers()
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown"

    // Check if already signed
    const { data: existing } = await supabase
      .from("nda_agreements")
      .select("id")
      .eq("deal_id", dealId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (existing) {
      return { success: true, data: existing }
    }

    const { data: agreement, error } = await supabase
      .from("nda_agreements")
      .insert({
        user_id: user.id,
        deal_id: dealId,
        signed_at: new Date().toISOString(),
        ip_address: ipAddress,
        status: "active",
      })
      .select("*")
      .single()

    if (error || !agreement) {
      console.error("Error signing NDA:", error)
      return { success: false, error: "NDA 서명에 실패했습니다." }
    }

    return { success: true, data: agreement }
  } catch (err) {
    console.error("Unexpected error signing NDA:", err)
    return { success: false, error: "NDA 서명 중 오류가 발생했습니다." }
  }
}

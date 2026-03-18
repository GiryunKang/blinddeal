"use server"

import { createClient } from "@supabase/supabase-js"

type InquiryInput = {
  name: string
  email: string
  phone?: string
  company?: string
  inquiry_type: "buy" | "sell" | "meeting" | "partnership" | "other"
  deal_category?: "real_estate" | "ma" | "both" | null
  budget_range?: string
  description: string
  preferences?: string
}

export async function submitInquiry(data: InquiryInput) {
  // Use anon client directly — no auth required for inserts
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { error } = await supabase.from("inquiries").insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    company: data.company || null,
    inquiry_type: data.inquiry_type,
    deal_category: data.deal_category || null,
    budget_range: data.budget_range || null,
    description: data.description,
    preferences: data.preferences || null,
  })

  if (error) {
    console.error("Failed to submit inquiry:", error)
    return { success: false, error: "문의 제출에 실패했습니다. 잠시 후 다시 시도해주세요." }
  }

  return { success: true }
}

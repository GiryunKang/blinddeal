"use server"

import { createClient } from "@supabase/supabase-js"

import { sanitizeText, truncate, validateEmail, validatePhone } from "@/lib/sanitize"

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

const VALID_INQUIRY_TYPES = ["buy", "sell", "meeting", "partnership", "other"] as const
const VALID_DEAL_CATEGORIES = ["real_estate", "ma", "both"] as const

export async function submitInquiry(data: InquiryInput) {
  try {
    const name = truncate(sanitizeText(data.name), 100)
    const email = data.email.trim().toLowerCase()
    const description = truncate(sanitizeText(data.description), 5000)

    if (!name || !email || !description) {
      return { success: false, error: "이름, 이메일, 문의 내용은 필수입니다." }
    }

    if (!validateEmail(email)) {
      return { success: false, error: "올바른 이메일 주소를 입력해주세요." }
    }

    if (data.phone && !validatePhone(data.phone)) {
      return { success: false, error: "올바른 전화번호를 입력해주세요." }
    }

    if (!VALID_INQUIRY_TYPES.includes(data.inquiry_type)) {
      return { success: false, error: "올바른 문의 유형을 선택해주세요." }
    }

    if (data.deal_category && !VALID_DEAL_CATEGORIES.includes(data.deal_category)) {
      return { success: false, error: "올바른 딜 카테고리를 선택해주세요." }
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.from("inquiries").insert({
      name,
      email,
      phone: data.phone ? sanitizeText(data.phone) : null,
      company: data.company ? truncate(sanitizeText(data.company), 200) : null,
      inquiry_type: data.inquiry_type,
      deal_category: data.deal_category || null,
      budget_range: data.budget_range || null,
      description,
      preferences: data.preferences ? truncate(sanitizeText(data.preferences), 2000) : null,
    })

    if (error) {
      console.error("Failed to submit inquiry:", error)
      return { success: false, error: "문의 제출에 실패했습니다. 잠시 후 다시 시도해주세요." }
    }

    return { success: true }
  } catch (err) {
    console.error("Unexpected error submitting inquiry:", err)
    return { success: false, error: "문의 제출 중 오류가 발생했습니다." }
  }
}

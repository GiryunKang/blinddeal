"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

export async function getVerificationStatus() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data: profile } = await supabase
      .from("profiles")
      .select("verification_level")
      .eq("id", user.id)
      .single()

    const { data: records } = await supabase
      .from("verification_records")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    return {
      success: true,
      level: profile?.verification_level ?? 0,
      records: records ?? [],
    }
  } catch (err) {
    console.error("Unexpected error fetching verification status:", err)
    return { success: false, level: 0, records: [] }
  }
}

export async function submitVerification(type: string, formData: FormData) {
  try {
    const VALID_TYPES = [
      "phone",
      "business_registration",
      "corporate_registration",
      "asset_proof",
      "credit_rating",
      "expert_letter",
      "identity_pass",
    ] as const
    if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
      return { success: false, error: "잘못된 인증 유형입니다." }
    }

    const user = await requireAuth()
    const supabase = await createClient()

    const file = formData.get("file") as File | null
    let documentUrl: string | null = null

    if (file && file.size > 0) {
      const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"]
      const MAX_SIZE = 10 * 1024 * 1024 // 10MB

      if (!ALLOWED_TYPES.includes(file.type)) {
        return { success: false, error: "허용되지 않는 파일 형식입니다. (JPG, PNG, PDF만 가능)" }
      }
      if (file.size > MAX_SIZE) {
        return { success: false, error: "파일 크기는 10MB 이하여야 합니다." }
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase()
      const ALLOWED_EXTS = ["jpg", "jpeg", "png", "pdf"]
      if (!fileExt || !ALLOWED_EXTS.includes(fileExt)) {
        return { success: false, error: "허용되지 않는 파일 확장자입니다." }
      }

      const safeFileName = `${user.id}/${type}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("verifications")
        .upload(safeFileName, file)

      if (uploadError) {
        console.error("Verification file upload error:", uploadError)
        return { success: false, error: "파일 업로드에 실패했습니다." }
      }

      const { data: urlData } = supabase.storage
        .from("verifications")
        .getPublicUrl(uploadData.path)

      documentUrl = urlData.publicUrl
    }

    const notes = formData.get("notes") as string | null

    const { error } = await supabase.from("verification_records").insert({
      user_id: user.id,
      verification_type: type,
      document_url: documentUrl,
      notes: notes || null,
      status: "pending",
    })

    if (error) {
      console.error("Verification submission error:", error)
      return { success: false, error: "인증 요청 제출에 실패했습니다." }
    }

    return { success: true }
  } catch (err) {
    console.error("Unexpected error submitting verification:", err)
    return { success: false, error: "인증 요청 처리 중 오류가 발생했습니다." }
  }
}


"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

export async function getVerificationStatus() {
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
    level: profile?.verification_level ?? 0,
    records: records ?? [],
  }
}

export async function submitVerification(type: string, formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  const file = formData.get("file") as File | null
  let documentUrl: string | null = null

  if (file && file.size > 0) {
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/${type}/${Date.now()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("verifications")
      .upload(fileName, file)

    if (uploadError) {
      throw new Error("파일 업로드에 실패했습니다: " + uploadError.message)
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
    throw new Error("인증 요청 제출에 실패했습니다: " + error.message)
  }

  return { success: true }
}

export async function getMyVerificationRecords() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("verification_records")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching verification records:", error)
    return []
  }

  return data ?? []
}

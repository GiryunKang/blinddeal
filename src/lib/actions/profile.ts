"use server"

import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/auth"
import { revalidatePath } from "next/cache"

export async function getProfile() {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) {
    return { error: "인증이 필요합니다." }
  }

  const displayName = formData.get("display_name") as string
  const companyName = formData.get("company_name") as string | null
  const phone = formData.get("phone") as string | null
  const bio = formData.get("bio") as string | null

  const updates: Record<string, unknown> = {
    display_name: displayName,
    phone: phone || null,
    bio: bio || null,
    company_name: companyName || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)

  if (error) {
    console.error("Profile update error:", error)
    return { error: "프로필 업데이트에 실패했습니다." }
  }

  revalidatePath("/profile")
  revalidatePath("/profile/edit")
  return { success: true }
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) {
    return { error: "인증이 필요합니다." }
  }

  const file = formData.get("avatar") as File
  if (!file || file.size === 0) {
    return { error: "파일을 선택해주세요." }
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!allowedTypes.includes(file.type)) {
    return { error: "JPG, PNG, WebP, GIF 형식만 지원합니다." }
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { error: "파일 크기는 2MB 이하여야 합니다." }
  }

  const ext = file.name.split(".").pop() || "jpg"
  const filePath = `${user.id}/avatar-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

  if (uploadError) {
    console.error("Avatar upload error:", uploadError)
    return { error: "아바타 업로드에 실패했습니다." }
  }

  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      avatar_url: urlData.publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (updateError) {
    console.error("Avatar URL update error:", updateError)
    return { error: "프로필 업데이트에 실패했습니다." }
  }

  revalidatePath("/profile")
  revalidatePath("/profile/edit")
  return { success: true, url: urlData.publicUrl }
}

import { redirect } from "next/navigation"
import { createClient } from "./server"

/**
 * Get the currently authenticated user.
 * Returns null if not authenticated.
 */
export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Get the profile for the currently authenticated user.
 * Returns null if not authenticated or profile not found.
 */
export async function getProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile
}

/**
 * Require authentication. Redirects to /auth/login if not authenticated.
 * Returns the authenticated user.
 */
export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect("/auth/login")
  }
  return user
}

/**
 * Sign out the current user and redirect to home.
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

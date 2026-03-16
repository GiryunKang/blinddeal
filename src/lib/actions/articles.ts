"use server"

import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/auth"
import { requireAuth } from "@/lib/supabase/auth"

export interface ArticleFilters {
  category?: string
  page?: number
  limit?: number
}

export async function getArticles(filters: ArticleFilters = {}) {
  const supabase = await createClient()

  const { category, page = 1, limit = 12 } = filters

  let query = supabase
    .from("articles")
    .select(
      `
      *,
      author:profiles!author_id (
        id,
        display_name,
        avatar_url,
        company_name
      )
    `,
      { count: "exact" }
    )
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  if (category && category !== "전체") {
    query = query.eq("category", category)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching articles:", error)
    return { articles: [], count: 0 }
  }

  return { articles: data ?? [], count: count ?? 0 }
}

export async function getArticleBySlug(slug: string) {
  const supabase = await createClient()

  // Articles use id as slug fallback — try to match by a slug column or by id
  const { data: article, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      author:profiles!author_id (
        id,
        display_name,
        avatar_url,
        company_name,
        bio
      )
    `
    )
    .eq("id", slug)
    .single()

  if (error || !article) {
    return null
  }

  // Increment view count (fire and forget)
  await supabase
    .from("articles")
    .update({ view_count: (article.view_count ?? 0) + 1 })
    .eq("id", article.id)

  return article
}

export async function createArticle(formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const summary = formData.get("summary") as string
  const category = formData.get("category") as string
  const coverImageUrl = formData.get("cover_image_url") as string
  const tagsStr = formData.get("tags") as string

  const tags = tagsStr
    ? tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : []

  const { data, error } = await supabase
    .from("articles")
    .insert({
      author_id: user.id,
      title,
      content,
      summary: summary || null,
      cover_image_url: coverImageUrl || null,
      category,
      tags,
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating article:", error)
    throw new Error("아티클 작성에 실패했습니다.")
  }

  return { id: data.id }
}

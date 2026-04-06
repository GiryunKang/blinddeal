"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"
import { CATEGORY_MAP, CATEGORY_LABELS } from "@/lib/articles-types"

import type { ArticleFilters } from "@/lib/articles-types"

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
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (category && category !== "전체") {
    const dbCategory = CATEGORY_MAP[category] ?? category
    query = query.eq("category", dbCategory)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching articles:", error)
    return { articles: [], count: 0 }
  }

  const articles = (data ?? []).map((a) => ({
    ...a,
    category: CATEGORY_LABELS[a.category] ?? a.category,
  }))

  return { articles, count: count ?? 0 }
}

export async function getArticleBySlug(slug: string) {
  const supabase = await createClient()

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
    .eq("slug", slug)
    .single()

  if (error || !article) {
    const { data: byId } = await supabase
      .from("articles")
      .select(
        `*, author:profiles!author_id (id, display_name, avatar_url, company_name, bio)`
      )
      .eq("id", slug)
      .single()

    if (!byId) return null

    await supabase
      .from("articles")
      .update({ view_count: (byId.view_count ?? 0) + 1 })
      .eq("id", byId.id)

    return { ...byId, category: CATEGORY_LABELS[byId.category] ?? byId.category }
  }

  await supabase
    .from("articles")
    .update({ view_count: (article.view_count ?? 0) + 1 })
    .eq("id", article.id)

  return { ...article, category: CATEGORY_LABELS[article.category] ?? article.category }
}

export async function createArticle(formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const summary = formData.get("summary") as string
  const category = formData.get("category") as string
  const tagsStr = formData.get("tags") as string

  const tags = tagsStr
    ? tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : []

  const dbCategory = CATEGORY_MAP[category] ?? category

  const { data, error } = await supabase
    .from("articles")
    .insert({
      author_id: user.id,
      title,
      content,
      excerpt: summary || null,
      category: dbCategory,
      tags,
      status: "published",
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

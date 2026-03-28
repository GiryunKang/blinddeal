import type { MetadataRoute } from "next"

import { createClient } from "@/lib/supabase/server"
import { BASE_URL } from "@/lib/constants"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/deals`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/insights`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/community`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/experts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/service`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/escrow-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ]

  try {
    const supabase = await createClient()

    const { data: deals } = await supabase
      .from("deals")
      .select("slug, updated_at")
      .eq("status", "active")
      .eq("visibility", "public")

    const dealRoutes: MetadataRoute.Sitemap = (deals ?? []).map((deal) => ({
      url: `${BASE_URL}/deals/${deal.slug}`,
      lastModified: new Date(deal.updated_at),
      changeFrequency: "daily",
      priority: 0.8,
    }))

    const { data: articles } = await supabase
      .from("articles")
      .select("slug, updated_at")
      .eq("status", "published")

    const articleRoutes: MetadataRoute.Sitemap = (articles ?? []).map((article) => ({
      url: `${BASE_URL}/insights/${article.slug}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    }))

    return [...staticRoutes, ...dealRoutes, ...articleRoutes]
  } catch (err) {
    console.error("Sitemap: DB fetch failed, returning static routes only:", err)
    return staticRoutes
  }
}

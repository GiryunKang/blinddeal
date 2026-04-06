export const revalidate = 300 // Revalidate every 5 minutes

import type { Metadata } from "next"
import { getArticles } from "@/lib/actions/articles"
import type { ArticleFilters } from "@/lib/articles-types"

export const metadata: Metadata = { title: "인사이트" }
import { ArticleCard } from "@/components/insights/article-card"
import { BookOpen } from "lucide-react"
import Link from "next/link"

const categories = [
  "전체",
  "시장 트렌드",
  "부동산 분석",
  "M&A 인사이트",
  "산업 리포트",
  "전문가 칼럼",
]

interface InsightsPageProps {
  searchParams: Promise<{
    category?: string
    page?: string
  }>
}

export default async function InsightsPage({
  searchParams,
}: InsightsPageProps) {
  const params = await searchParams
  const activeCategory = params.category || "전체"
  const currentPage = params.page ? parseInt(params.page, 10) : 1

  const filters: ArticleFilters = {
    category: activeCategory === "전체" ? undefined : activeCategory,
    page: currentPage,
  }

  let articles: Awaited<ReturnType<typeof getArticles>>["articles"] = []
  let count = 0
  try {
    const result = await getArticles(filters)
    articles = result.articles
    count = result.count
  } catch (err) {
    console.error("Error loading articles:", err)
  }
  const totalPages = Math.ceil(count / 12)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          인사이트
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          부동산 · M&A 시장의 최신 분석과 전문가 인사이트
        </p>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = cat === activeCategory
          return (
            <Link
              key={cat}
              href={
                cat === "전체"
                  ? "/insights"
                  : `/insights?category=${encodeURIComponent(cat)}`
              }
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </Link>
          )
        })}
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article: (typeof articles)[number]) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="rounded-full bg-muted p-4">
            <BookOpen className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            이런 콘텐츠가 곧 업데이트됩니다
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• 부동산 시세 트렌드 분석</li>
            <li>• M&A 시장 동향 리포트</li>
            <li>• 업종별 거래 사례</li>
            <li>• 전문가 칼럼</li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            새 콘텐츠가 올라오면 알림을 받으시겠습니까?
          </p>
          <Link href="/profile/matches" className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            알림 신청하기
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/insights?${new URLSearchParams({
                ...(activeCategory !== "전체"
                  ? { category: activeCategory }
                  : {}),
                page: String(currentPage - 1),
              }).toString()}`}
              className="rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              이전
            </Link>
          )}
          <span className="text-sm text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/insights?${new URLSearchParams({
                ...(activeCategory !== "전체"
                  ? { category: activeCategory }
                  : {}),
                page: String(currentPage + 1),
              }).toString()}`}
              className="rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              다음
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

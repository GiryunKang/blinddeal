import { getArticles, type ArticleFilters } from "@/lib/actions/articles"
import { ArticleCard } from "@/components/insights/article-card"
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

  const { articles, count } = await getArticles(filters)
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
            <svg
              className="size-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            등록된 아티클이 없습니다
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            새로운 인사이트가 곧 업데이트됩니다
          </p>
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

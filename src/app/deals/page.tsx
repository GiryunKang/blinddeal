import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { MapPin, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { getDeals, type DealFilters } from "@/lib/actions/deals"
import { DealCard } from "@/components/deals/deal-card"
import { DealFilters as DealFiltersComponent } from "@/components/deals/deal-filters"
import { Button } from "@/components/ui/button"
import { StaggerStyles } from "@/components/effects/stagger-styles"

export const revalidate = 60 // Revalidate every 60 seconds
export const metadata: Metadata = { title: "딜 마켓플레이스" }

interface DealsPageProps {
  searchParams: Promise<{
    category?: string
    visibility?: string
    sortBy?: string
    search?: string
    page?: string
  }>
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const params = await searchParams

  const currentPage = params.page ? parseInt(params.page, 10) : 1
  const limit = 12

  const filters: DealFilters = {
    category: params.category as DealFilters["category"],
    visibility: params.visibility as DealFilters["visibility"],
    sortBy: (params.sortBy as DealFilters["sortBy"]) || "latest",
    search: params.search,
    page: currentPage,
    limit,
  }

  const { deals, count } = await getDeals(filters)

  const totalPages = Math.ceil(count / limit)
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  // Build pagination URL preserving existing search params
  function buildPageUrl(page: number) {
    const p = new URLSearchParams()
    if (params.category) p.set("category", params.category)
    if (params.visibility) p.set("visibility", params.visibility)
    if (params.sortBy) p.set("sortBy", params.sortBy)
    if (params.search) p.set("search", params.search)
    p.set("page", String(page))
    return `/deals?${p.toString()}`
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Subtle gradient background at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-blue-500/[0.03] via-indigo-500/[0.02] to-transparent" />

      {/* Header */}
      <div className="relative mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              딜 마켓플레이스
            </h1>
          </div>
          <Link
            href="/deals/map"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-border/50 bg-white/5 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:text-foreground hover:border-blue-500/30 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)]"
          >
            <MapPin className="h-3.5 w-3.5" />
            지도로 보기
          </Link>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          총 <span className="font-semibold text-foreground">{count}</span>건의 프리미엄 딜이 등록되어 있습니다
        </p>
      </div>

      {/* Filters — glass effect bar */}
      <div className="relative mb-8 rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-md">
        <Suspense
          fallback={
            <div className="h-10 animate-pulse rounded-lg bg-muted" />
          }
        >
          <DealFiltersComponent />
        </Suspense>
      </div>

      {/* Deal Grid */}
      {deals.length > 0 ? (
        <>
          <StaggerStyles />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal, index) => (
              <div
                key={deal.id}
                className="deal-card-stagger"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <DealCard deal={deal} index={index} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              {hasPrev ? (
                <Link href={buildPageUrl(currentPage - 1)}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ChevronLeft className="size-4" />
                    이전
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" className="gap-1.5" disabled>
                  <ChevronLeft className="size-4" />
                  이전
                </Button>
              )}

              <span className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{currentPage}</span>
                {" / "}
                <span>{totalPages}</span>
              </span>

              {hasNext ? (
                <Link href={buildPageUrl(currentPage + 1)}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    다음
                    <ChevronRight className="size-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" className="gap-1.5" disabled>
                  다음
                  <ChevronRight className="size-4" />
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="rounded-full bg-muted/50 p-5 backdrop-blur-md border border-border/30">
            <svg
              className="size-10 text-muted-foreground/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="mt-5 text-lg font-semibold text-foreground">
            등록된 딜이 없습니다
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            검색 조건을 변경하거나 새로운 딜을 등록해보세요
          </p>
        </div>
      )}
    </div>
  )
}

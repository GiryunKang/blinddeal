import { Suspense } from "react"
import { getDeals, type DealFilters } from "@/lib/actions/deals"
import { DealCard } from "@/components/deals/deal-card"
import { DealFilters as DealFiltersComponent } from "@/components/deals/deal-filters"

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

  const filters: DealFilters = {
    category: params.category as DealFilters["category"],
    visibility: params.visibility as DealFilters["visibility"],
    sortBy: (params.sortBy as DealFilters["sortBy"]) || "latest",
    search: params.search,
    page: params.page ? parseInt(params.page, 10) : 1,
  }

  const { deals, count } = await getDeals(filters)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          딜 마켓플레이스
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          총 {count}건의 딜이 등록되어 있습니다
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            등록된 딜이 없습니다
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            검색 조건을 변경하거나 새로운 딜을 등록해보세요
          </p>
        </div>
      )}
    </div>
  )
}

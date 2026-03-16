import { Suspense } from "react"
import { getExperts, type ExpertFilters, type ExpertType } from "@/lib/actions/experts"
import { ExpertCard } from "@/components/experts/expert-card"

const EXPERT_TYPES: { value: ExpertType | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "법무", label: "법무" },
  { value: "회계", label: "회계" },
  { value: "세무", label: "세무" },
  { value: "감정", label: "감정" },
  { value: "컨설팅", label: "컨설팅" },
]

interface ExpertsPageProps {
  searchParams: Promise<{
    type?: string
    search?: string
    page?: string
  }>
}

export default async function ExpertsPage({ searchParams }: ExpertsPageProps) {
  const params = await searchParams

  const filters: ExpertFilters = {
    type: params.type && params.type !== "all"
      ? (params.type as ExpertType)
      : undefined,
    search: params.search,
    page: params.page ? parseInt(params.page, 10) : 1,
  }

  const { experts, count } = await getExperts(filters)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          전문가 네트워크
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          총 {count}명의 전문가가 등록되어 있습니다
        </p>
      </div>

      {/* Type filter tabs */}
      <div className="mb-6">
        <Suspense
          fallback={
            <div className="h-10 animate-pulse rounded-lg bg-muted" />
          }
        >
          <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
            {EXPERT_TYPES.map((t) => {
              const isActive =
                (t.value === "all" && !params.type) ||
                params.type === t.value
              return (
                <a
                  key={t.value}
                  href={
                    t.value === "all"
                      ? "/experts"
                      : `/experts?type=${t.value}`
                  }
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </a>
              )
            })}
          </div>
        </Suspense>
      </div>

      {/* Expert Grid */}
      {experts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            등록된 전문가가 없습니다
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            검색 조건을 변경해보세요
          </p>
        </div>
      )}
    </div>
  )
}

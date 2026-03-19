export const revalidate = 300 // Revalidate every 5 minutes

import type { Metadata } from "next"
import { Suspense } from "react"
import { getExperts, type ExpertFilters, type ExpertType } from "@/lib/actions/experts"

export const metadata: Metadata = { title: "전문가 네트워크" }
import { ExpertCard } from "@/components/experts/expert-card"
import { Users, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

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
            <Users className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            전문가 네트워크를 구축 중입니다
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            법무, 회계, 세무, 감정 전문가를 모집하고 있습니다
          </p>
          <a href="mailto:83482@daum.net" className="mt-4">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Mail className="size-3.5" />
              전문가 등록 문의
            </Button>
          </a>
        </div>
      )}
    </div>
  )
}

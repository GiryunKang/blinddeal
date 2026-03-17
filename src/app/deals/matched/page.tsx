import Link from "next/link"
import { Target, Settings, Calendar, ArrowUpDown } from "lucide-react"
import { requireAuth } from "@/lib/supabase/auth"
import { getMatchedDeals } from "@/lib/actions/matching-engine"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MatchScoreBadge } from "@/components/deals/match-score-badge"
import { formatKRW, formatDate } from "@/lib/utils"

export const metadata = {
  title: "맞춤 딜 | BlindDeal",
}

interface MatchedDealsPageProps {
  searchParams: Promise<{ sort?: string }>
}

export default async function MatchedDealsPage({
  searchParams,
}: MatchedDealsPageProps) {
  const user = await requireAuth()
  const { sort } = await searchParams
  const sortBy = sort === "date" ? "date" : "score"

  const { deals, hasPreferences } = await getMatchedDeals(user.id)

  // Sort by date if requested
  const sortedDeals =
    sortBy === "date"
      ? [...deals].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      : deals

  if (!hasPreferences) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Target className="size-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          맞춤 딜을 받아보세요
        </h1>
        <p className="mt-3 text-muted-foreground">
          관심 분야, 투자 규모, 지역 등 매칭 설정을 완료하면
          <br />
          최적의 딜을 자동으로 추천해 드립니다.
        </p>
        <Link href="/profile/matches">
          <Button className="mt-6" size="lg">
            <Settings className="mr-2 size-4" />
            매칭 설정하기
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">맞춤 딜</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            설정한 매칭 조건에 맞는 딜 {sortedDeals.length}건
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/deals/matched?sort=${sortBy === "score" ? "date" : "score"}`}
          >
            <Button variant="outline" size="sm">
              <ArrowUpDown className="mr-1 size-3" />
              {sortBy === "score" ? "매칭 순" : "최신 순"}
            </Button>
          </Link>
          <Link href="/profile/matches">
            <Button variant="outline" size="sm">
              <Settings className="mr-1 size-3" />
              설정
            </Button>
          </Link>
        </div>
      </div>

      {sortedDeals.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">
            현재 매칭 조건에 맞는 딜이 없습니다.
          </p>
          <Link href="/deals">
            <Button variant="outline" className="mt-4">
              전체 딜 보기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedDeals.map((deal) => {
            const categoryLabel =
              deal.deal_category === "real_estate" ? "부동산" : "M&A"
            const categoryColor =
              deal.deal_category === "real_estate"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-purple-500/20 text-purple-400"

            return (
              <Link key={deal.id} href={`/deals/${deal.slug}`}>
                <Card className="border-border/50 transition-colors hover:border-primary/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={categoryColor}>
                          {categoryLabel}
                        </Badge>
                      </div>
                      <MatchScoreBadge
                        score={deal.matchResult.score}
                        size="sm"
                      />
                    </div>
                    <CardTitle className="mt-2 line-clamp-2 text-sm">
                      {deal.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold text-primary">
                      {deal.asking_price
                        ? formatKRW(deal.asking_price)
                        : "가격 협의"}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      {deal.city && <span>{deal.city}</span>}
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(deal.created_at)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

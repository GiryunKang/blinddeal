import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Heart,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { getMyDeals, getMyInterests, getMyRooms, getMyDealStats } from "@/lib/actions/my-deals"
import { formatKRW } from "@/lib/utils"

const PIPELINE_STAGES = [
  { key: "draft", label: "초안", accentColor: "from-gray-500 to-gray-600", headerText: "text-gray-400", dotColor: "bg-gray-500" },
  { key: "pending_review", label: "검토중", accentColor: "from-blue-500 to-blue-600", headerText: "text-blue-400", dotColor: "bg-blue-500" },
  { key: "active", label: "활성", accentColor: "from-emerald-500 to-emerald-600", headerText: "text-emerald-400", dotColor: "bg-emerald-500" },
  { key: "under_negotiation", label: "협상중", accentColor: "from-amber-500 to-amber-600", headerText: "text-amber-400", dotColor: "bg-amber-500" },
  { key: "due_diligence", label: "실사(정밀조사)", accentColor: "from-purple-500 to-purple-600", headerText: "text-purple-400", dotColor: "bg-purple-500" },
  { key: "closing", label: "계약중", accentColor: "from-indigo-500 to-indigo-600", headerText: "text-indigo-400", dotColor: "bg-indigo-500" },
  { key: "closed", label: "완료", accentColor: "from-green-500 to-green-600", headerText: "text-green-400", dotColor: "bg-green-500" },
] as const

export default async function DashboardPage() {
  const [myDeals, myInterests, myRooms, stats] = await Promise.all([
    getMyDeals(),
    getMyInterests(),
    getMyRooms(),
    getMyDealStats(),
  ])

  const activeNegotiations = myDeals.filter(
    (d) => d.status === "under_negotiation" || d.status === "due_diligence" || d.status === "closing"
  ).length
  const completedDeals = myDeals.filter((d) => d.status === "closed").length

  return (
    <MainLayout>
      <div className="space-y-10">
        {/* Page header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
          <p className="text-sm text-muted-foreground">
            내 딜과 활동을 한눈에 확인하세요
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="내 등록 딜"
            value={myDeals.length}
            icon={<FileText className="h-5 w-5" />}
            gradientFrom="from-blue-500"
            gradientTo="to-blue-600"
            trend="up"
            trendLabel="활성"
          />
          <StatCard
            label="관심 표시한 딜"
            value={myInterests.length}
            icon={<Heart className="h-5 w-5" />}
            gradientFrom="from-pink-500"
            gradientTo="to-rose-600"
            trend="neutral"
            trendLabel=""
          />
          <StatCard
            label="진행 중 협상"
            value={activeNegotiations}
            icon={<MessageSquare className="h-5 w-5" />}
            gradientFrom="from-amber-500"
            gradientTo="to-orange-600"
            trend={activeNegotiations > 0 ? "up" : "neutral"}
            trendLabel={activeNegotiations > 0 ? "진행중" : ""}
          />
          <StatCard
            label="완료된 거래"
            value={completedDeals}
            icon={<CheckCircle className="h-5 w-5" />}
            gradientFrom="from-emerald-500"
            gradientTo="to-green-600"
            trend={completedDeals > 0 ? "up" : "neutral"}
            trendLabel={completedDeals > 0 ? "성사" : ""}
          />
        </div>

        {/* Pipeline section */}
        <div>
          <h2 className="mb-5 text-lg font-bold tracking-tight">거래 진행 현황</h2>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {PIPELINE_STAGES.map((stage) => {
              const dealsInStage = myDeals.filter((d) => d.status === stage.key)
              return (
                <div
                  key={stage.key}
                  className="flex min-w-[200px] flex-shrink-0 flex-col lg:min-w-[180px] lg:flex-1"
                >
                  {/* Column header — glass effect with gradient left border */}
                  <div className="relative mb-3 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
                    {/* Gradient left accent */}
                    <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${stage.accentColor}`} />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${stage.dotColor}`} />
                        <span className={`text-xs font-semibold ${stage.headerText}`}>
                          {stage.label}
                        </span>
                      </div>
                      <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                        {dealsInStage.length}
                      </span>
                    </div>
                  </div>

                  {/* Deal cards in column */}
                  <div className="flex flex-col gap-2">
                    {dealsInStage.length === 0 ? (
                      <div className="flex min-h-[80px] items-center justify-center rounded-xl border border-dashed border-white/[0.06] text-xs text-muted-foreground/30">
                        딜 없음
                      </div>
                    ) : (
                      dealsInStage.map((deal) => (
                        <MiniDealCard key={deal.id} deal={deal} />
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="mb-5 text-lg font-bold tracking-tight">최근 활동</h2>
          <div className="space-y-2">
            {myRooms.length === 0 && myInterests.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] py-16 backdrop-blur-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05]">
                  <MessageSquare className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">아직 활동 내역이 없습니다</p>
                <Link
                  href="/deals"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-4 py-2 text-sm font-medium text-blue-400 transition-all duration-300 hover:from-blue-500/15 hover:to-indigo-500/15"
                >
                  딜 둘러보기 <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04] rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                {/* Recent room messages */}
                {myRooms.slice(0, 5).map((room) => {
                  const deal = room.deal as { title?: string; slug?: string } | null
                  const lastMsg = room.last_message as { content?: string; created_at?: string } | null
                  return (
                    <Link key={room.id} href={`/rooms/${room.id}`}>
                      <div className="flex items-start gap-4 px-5 py-4 transition-all duration-200 hover:bg-white/[0.03]">
                        {/* Icon */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                          <MessageSquare className="h-4 w-4 text-blue-400" />
                        </div>
                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {deal?.title ?? "딜"} 대화
                          </p>
                          {lastMsg?.content && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {lastMsg.content}
                            </p>
                          )}
                        </div>
                        {/* Timestamp */}
                        {lastMsg?.created_at && (
                          <span className="shrink-0 pt-0.5 text-[10px] text-muted-foreground/50">
                            {new Date(lastMsg.created_at).toLocaleDateString("ko-KR")}
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}

                {/* Recent interests */}
                {myInterests.slice(0, 3).map((interest) => {
                  const deal = interest.deal as { title?: string; slug?: string; deal_category?: string } | null
                  return (
                    <Link key={interest.id} href={deal?.slug ? `/deals/${deal.slug}` : "#"}>
                      <div className="flex items-center gap-4 px-5 py-4 transition-all duration-200 hover:bg-white/[0.03]">
                        {/* Icon */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-500/10">
                          <Heart className="h-4 w-4 text-pink-400" />
                        </div>
                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {deal?.title ?? "딜"}에 관심 표시
                          </p>
                        </div>
                        {/* Category badge */}
                        {deal?.deal_category && (
                          <Badge
                            variant="secondary"
                            className={
                              deal.deal_category === "real_estate"
                                ? "rounded-lg border-0 bg-blue-500/10 text-blue-400 backdrop-blur-sm"
                                : "rounded-lg border-0 bg-purple-500/10 text-purple-400 backdrop-blur-sm"
                            }
                          >
                            {deal.deal_category === "real_estate" ? "부동산" : "M&A"}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

/* ─── Sub-components ─── */

function StatCard({
  label,
  value,
  icon,
  gradientFrom,
  gradientTo,
  trend,
  trendLabel,
}: {
  label: string
  value: number
  icon: React.ReactNode
  gradientFrom: string
  gradientTo: string
  trend: "up" | "down" | "neutral"
  trendLabel: string
}) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.05] hover:shadow-xl">
      {/* Gradient left accent */}
      <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${gradientFrom} ${gradientTo}`} />
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            {value}
          </p>
          {/* Trend indicator */}
          {trendLabel && (
            <div className="flex items-center gap-1">
              {trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-400" />}
              {trend === "down" && <TrendingDown className="h-3 w-3 text-red-400" />}
              {trend === "neutral" && <Minus className="h-3 w-3 text-muted-foreground" />}
              <span className={`text-[10px] font-medium ${
                trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-muted-foreground"
              }`}>
                {trendLabel}
              </span>
            </div>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

function MiniDealCard({
  deal,
}: {
  deal: {
    id: string
    title: string
    slug: string
    deal_category: string
    asking_price: number | null
  }
}) {
  const categoryLabel = deal.deal_category === "real_estate" ? "부동산" : "M&A"

  return (
    <Link href={`/deals/${deal.slug}`}>
      <Card className="group rounded-xl border-white/[0.06] bg-white/[0.03] p-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.1] hover:bg-white/[0.05] hover:shadow-lg">
        <div className="flex items-start justify-between gap-2">
          <h4 className="line-clamp-1 text-xs font-medium leading-tight">
            {deal.title}
          </h4>
          <Badge
            variant="secondary"
            className={`shrink-0 rounded-md border-0 px-1.5 py-0 text-[9px] backdrop-blur-sm ${
              deal.deal_category === "real_estate"
                ? "bg-blue-500/10 text-blue-400"
                : "bg-purple-500/10 text-purple-400"
            }`}
          >
            {categoryLabel}
          </Badge>
        </div>
        <p className="mt-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-xs font-semibold text-transparent">
          {formatKRW(deal.asking_price)}
        </p>
      </Card>
    </Link>
  )
}

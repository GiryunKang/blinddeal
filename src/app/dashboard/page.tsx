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
} from "lucide-react"
import { getMyDeals, getMyInterests, getMyRooms, getMyDealStats } from "@/lib/actions/my-deals"
import { formatKRW } from "@/lib/utils"

const PIPELINE_STAGES = [
  { key: "draft", label: "초안", color: "bg-gray-500", headerBg: "bg-gray-500/10", headerText: "text-gray-400", borderColor: "border-gray-500/20" },
  { key: "pending_review", label: "검토중", color: "bg-blue-500", headerBg: "bg-blue-500/10", headerText: "text-blue-400", borderColor: "border-blue-500/20" },
  { key: "active", label: "활성", color: "bg-emerald-500", headerBg: "bg-emerald-500/10", headerText: "text-emerald-400", borderColor: "border-emerald-500/20" },
  { key: "under_negotiation", label: "협상중", color: "bg-amber-500", headerBg: "bg-amber-500/10", headerText: "text-amber-400", borderColor: "border-amber-500/20" },
  { key: "due_diligence", label: "실사", color: "bg-purple-500", headerBg: "bg-purple-500/10", headerText: "text-purple-400", borderColor: "border-purple-500/20" },
  { key: "closing", label: "계약중", color: "bg-indigo-500", headerBg: "bg-indigo-500/10", headerText: "text-indigo-400", borderColor: "border-indigo-500/20" },
  { key: "closed", label: "완료", color: "bg-green-500", headerBg: "bg-green-500/10", headerText: "text-green-400", borderColor: "border-green-500/20" },
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
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            내 딜과 활동을 한눈에 확인하세요
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="내 등록 딜"
            value={myDeals.length}
            icon={<FileText className="h-5 w-5" />}
            color="text-blue-400"
            bgColor="bg-blue-500/10"
          />
          <StatCard
            label="관심 표시한 딜"
            value={myInterests.length}
            icon={<Heart className="h-5 w-5" />}
            color="text-pink-400"
            bgColor="bg-pink-500/10"
          />
          <StatCard
            label="진행 중 협상"
            value={activeNegotiations}
            icon={<MessageSquare className="h-5 w-5" />}
            color="text-amber-400"
            bgColor="bg-amber-500/10"
          />
          <StatCard
            label="완료된 거래"
            value={completedDeals}
            icon={<CheckCircle className="h-5 w-5" />}
            color="text-emerald-400"
            bgColor="bg-emerald-500/10"
          />
        </div>

        {/* Pipeline section */}
        <div>
          <h2 className="mb-4 text-lg font-bold">딜 파이프라인</h2>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {PIPELINE_STAGES.map((stage) => {
              const dealsInStage = myDeals.filter((d) => d.status === stage.key)
              return (
                <div
                  key={stage.key}
                  className="flex min-w-[200px] flex-shrink-0 flex-col lg:min-w-[180px] lg:flex-1"
                >
                  {/* Column header */}
                  <div
                    className={`mb-2 flex items-center justify-between rounded-lg border ${stage.borderColor} ${stage.headerBg} px-3 py-2`}
                  >
                    <span className={`text-xs font-semibold ${stage.headerText}`}>
                      {stage.label}
                    </span>
                    <span className={`text-xs font-bold ${stage.headerText}`}>
                      {dealsInStage.length}
                    </span>
                  </div>

                  {/* Deal cards in column */}
                  <div className="flex flex-col gap-2">
                    {dealsInStage.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border/30 px-3 py-6 text-center text-xs text-muted-foreground/50">
                        없음
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

        {/* Recent activity feed */}
        <div>
          <h2 className="mb-4 text-lg font-bold">최근 활동</h2>
          <div className="space-y-2">
            {myRooms.length === 0 && myInterests.length === 0 ? (
              <Card className="border-border/50 bg-card/50 p-8 text-center">
                <p className="text-sm text-muted-foreground">아직 활동 내역이 없습니다</p>
                <Link
                  href="/deals"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  딜 둘러보기 <ArrowRight className="h-3 w-3" />
                </Link>
              </Card>
            ) : (
              <>
                {/* Recent room messages */}
                {myRooms.slice(0, 5).map((room) => {
                  const deal = room.deal as { title?: string; slug?: string } | null
                  const lastMsg = room.last_message as { content?: string; created_at?: string } | null
                  return (
                    <Link key={room.id} href={`/rooms/${room.id}`}>
                      <Card className="border-border/50 bg-card/50 p-4 transition-all hover:border-border hover:bg-card/80">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                              <span className="truncate text-sm font-medium">
                                {deal?.title ?? "딜"}
                              </span>
                            </div>
                            {lastMsg?.content && (
                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                {lastMsg.content}
                              </p>
                            )}
                          </div>
                          {lastMsg?.created_at && (
                            <span className="shrink-0 text-[10px] text-muted-foreground/60">
                              {new Date(lastMsg.created_at).toLocaleDateString("ko-KR")}
                            </span>
                          )}
                        </div>
                      </Card>
                    </Link>
                  )
                })}

                {/* Recent interests */}
                {myInterests.slice(0, 3).map((interest) => {
                  const deal = interest.deal as { title?: string; slug?: string; deal_category?: string } | null
                  return (
                    <Link key={interest.id} href={deal?.slug ? `/deals/${deal.slug}` : "#"}>
                      <Card className="border-border/50 bg-card/50 p-4 transition-all hover:border-border hover:bg-card/80">
                        <div className="flex items-center gap-2">
                          <Heart className="h-3.5 w-3.5 shrink-0 text-pink-400" />
                          <span className="truncate text-sm font-medium">
                            {deal?.title ?? "딜"}에 관심 표시
                          </span>
                          {deal?.deal_category && (
                            <Badge
                              variant="secondary"
                              className={
                                deal.deal_category === "real_estate"
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "bg-purple-500/10 text-purple-400"
                              }
                            >
                              {deal.deal_category === "real_estate" ? "부동산" : "M&A"}
                            </Badge>
                          )}
                        </div>
                      </Card>
                    </Link>
                  )
                })}
              </>
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
  color,
  bgColor,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  bgColor: string
}) {
  return (
    <Card className="border-border/50 bg-card/50 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${bgColor} ${color}`}
        >
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
  const categoryColor =
    deal.deal_category === "real_estate"
      ? "bg-blue-500/10 text-blue-400"
      : "bg-purple-500/10 text-purple-400"
  const categoryLabel = deal.deal_category === "real_estate" ? "부동산" : "M&A"

  return (
    <Link href={`/deals/${deal.slug}`}>
      <Card className="border-border/50 bg-card/50 p-3 transition-all hover:border-border hover:bg-card/80">
        <div className="flex items-start justify-between gap-1">
          <h4 className="line-clamp-1 text-xs font-medium leading-tight">
            {deal.title}
          </h4>
          <Badge variant="secondary" className={`shrink-0 text-[9px] px-1.5 py-0 ${categoryColor}`}>
            {categoryLabel}
          </Badge>
        </div>
        <p className="mt-1.5 text-xs font-semibold text-primary">
          {formatKRW(deal.asking_price)}
        </p>
      </Card>
    </Link>
  )
}

import { getAdminStats } from "@/lib/actions/admin"
import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, MessageSquare, TrendingUp } from "lucide-react"
import { formatKRW } from "@/lib/utils"

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  const statCards = [
    {
      label: "총 사용자",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "활성 딜",
      value: stats.totalDeals.toLocaleString(),
      icon: FileText,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "대기중 승인",
      value: stats.activeRooms.toLocaleString(),
      icon: MessageSquare,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "월 거래량",
      value: formatKRW(stats.totalRevenue),
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">대시보드</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          BlindDeal 관리자 대시보드
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 pt-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
                >
                  <Icon className={`size-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

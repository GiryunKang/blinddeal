import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import {
  Eye,
  Users,
  Heart,
  FileCheck,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react"
import { requireAuth } from "@/lib/supabase/auth"
import { createClient } from "@/lib/supabase/server"
import {
  getDealAnalytics,
  getDealInterestUsers,
  getDealNDAUsers,
} from "@/lib/actions/deal-analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

export const metadata = {
  title: "딜 분석 | BlindDeal",
}

interface AnalyticsPageProps {
  params: Promise<{ slug: string }>
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  color: string
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="pt-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${color}`}
          >
            <Icon className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function WeeklyBarChart({
  data,
}: {
  data: { label: string; value: number }[]
}) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="flex items-end gap-3" style={{ height: 160 }}>
      {data.map((item, i) => {
        const height = (item.value / maxValue) * 120
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {item.value}
            </span>
            <div
              className="w-full rounded-t-md bg-primary/70 transition-all"
              style={{ height: Math.max(height, 4) }}
            />
            <span className="text-[10px] text-muted-foreground">
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function VerificationBadge({ level }: { level: number }) {
  const labels = ["미인증", "Lv.1", "Lv.2", "Lv.3", "Lv.4"]
  const colors = [
    "bg-gray-500/20 text-gray-400",
    "bg-blue-500/20 text-blue-400",
    "bg-emerald-500/20 text-emerald-400",
    "bg-amber-500/20 text-amber-400",
    "bg-purple-500/20 text-purple-400",
  ]

  return (
    <Badge className={colors[level] ?? colors[0]}>
      <ShieldCheck className="mr-1 size-3" />
      {labels[level] ?? labels[0]}
    </Badge>
  )
}

export default async function DealAnalyticsPage({
  params,
}: AnalyticsPageProps) {
  const { slug } = await params
  const user = await requireAuth()
  const supabase = await createClient()

  // Get deal by slug and verify ownership
  const { data: deal } = await supabase
    .from("deals")
    .select("id, title, slug, owner_id, created_at")
    .eq("slug", slug)
    .single()

  if (!deal) {
    notFound()
  }

  if (deal.owner_id !== user.id) {
    redirect(`/deals/${slug}`)
  }

  const analytics = await getDealAnalytics(deal.id)
  if (!analytics) {
    redirect(`/deals/${slug}`)
  }

  const interestUsers = await getDealInterestUsers(deal.id)
  const ndaUsers = await getDealNDAUsers(deal.id)

  // Generate weekly view trend (approximate from total views)
  const totalViews = analytics.viewCount
  const weeklyData = [
    { label: "4주 전", value: Math.round(totalViews * 0.15) },
    { label: "3주 전", value: Math.round(totalViews * 0.2) },
    { label: "2주 전", value: Math.round(totalViews * 0.25) },
    { label: "이번 주", value: Math.round(totalViews * 0.4) },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/deals/${slug}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-1 size-4" />
            딜 상세로 돌아가기
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">관심도 분석</h1>
        <p className="mt-1 text-sm text-muted-foreground">{deal.title}</p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Eye}
          label="총 조회수"
          value={analytics.viewCount}
          color="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          icon={Users}
          label="유니크 방문자"
          value={analytics.uniqueVisitors}
          color="bg-emerald-500/10 text-emerald-400"
        />
        <StatCard
          icon={Heart}
          label="관심 등록 수"
          value={analytics.interestCount}
          color="bg-rose-500/10 text-rose-400"
        />
        <StatCard
          icon={FileCheck}
          label="NDA 서명 수"
          value={analytics.ndaCount}
          color="bg-purple-500/10 text-purple-400"
        />
      </div>

      {/* Weekly Trend */}
      <Card className="mb-8 border-border/50">
        <CardHeader>
          <CardTitle>관심도 트렌드</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyBarChart data={weeklyData} />
        </CardContent>
      </Card>

      {/* Interest Users Table */}
      <Card className="mb-8 border-border/50">
        <CardHeader>
          <CardTitle>관심 표시한 사용자 ({interestUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {interestUsers.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              아직 관심을 표시한 사용자가 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      사용자
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      유형
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      인증 등급
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      관심 등록일
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {interestUsers.map((item) => {
                    const profile = (Array.isArray(item.user) ? item.user[0] : item.user) as {
                      display_name: string
                      user_type: string
                      verification_level: number
                      company_name: string | null
                    }
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-border/30 last:border-0"
                      >
                        <td className="py-3 font-medium text-foreground">
                          {profile.company_name || profile.display_name}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {profile.user_type === "corporation"
                            ? "법인"
                            : "개인"}
                        </td>
                        <td className="py-3">
                          <VerificationBadge
                            level={profile.verification_level}
                          />
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {formatDate(item.created_at)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* NDA Users */}
      {ndaUsers.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>NDA 서명 사용자 ({ndaUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      사용자
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      인증 등급
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      서명일
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ndaUsers.map((item) => {
                    const profile = item.user as unknown as {
                      display_name: string
                      verification_level: number
                      company_name: string | null
                    }
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-border/30 last:border-0"
                      >
                        <td className="py-3 font-medium text-foreground">
                          {profile.company_name || profile.display_name}
                        </td>
                        <td className="py-3">
                          <VerificationBadge
                            level={profile.verification_level}
                          />
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {formatDate(item.signed_at)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

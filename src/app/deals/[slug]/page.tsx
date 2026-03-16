import { notFound } from "next/navigation"
import Image from "next/image"
import {
  MapPin,
  Building,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Lock,
} from "lucide-react"
import { getDealBySlug } from "@/lib/actions/deals"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatKRW, formatDate } from "@/lib/utils"
import { InterestButton } from "@/components/deals/interest-button"

interface DealDetailPageProps {
  params: Promise<{ slug: string }>
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number | null | undefined
}) {
  if (!value && value !== 0) return null
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{String(value)}</p>
      </div>
    </div>
  )
}

export default async function DealDetailPage({
  params,
}: DealDetailPageProps) {
  const { slug } = await params
  const deal = await getDealBySlug(slug)

  if (!deal) {
    notFound()
  }

  const categoryLabel =
    deal.deal_category === "real_estate" ? "부동산" : "M&A"
  const categoryColor =
    deal.deal_category === "real_estate"
      ? "bg-blue-500/20 text-blue-400"
      : "bg-purple-500/20 text-purple-400"

  const visibilityLabel = deal.visibility === "public" ? "공개" : "비공개"
  const visibilityColor =
    deal.visibility === "public"
      ? "bg-emerald-500/20 text-emerald-400"
      : "bg-amber-500/20 text-amber-400"

  const statusMap: Record<string, string> = {
    draft: "초안",
    pending_review: "검토 중",
    active: "활성",
    under_negotiation: "협상 중",
    due_diligence: "실사 진행",
    contract: "계약 진행",
    escrow: "에스크로",
    closed: "완료",
    cancelled: "취소",
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Header */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className={categoryColor}>{categoryLabel}</Badge>
              <Badge className={visibilityColor}>
                {deal.visibility === "private" && (
                  <Lock className="mr-1 size-3" />
                )}
                {visibilityLabel}
              </Badge>
              <Badge variant="outline">
                {statusMap[deal.status] || deal.status}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {deal.title}
            </h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="size-4" />
                조회 {deal.view_count}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="size-4" />
                관심 {deal.interest_count}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-4" />
                {formatDate(deal.created_at)}
              </span>
            </div>
          </div>

          {/* Images */}
          {deal.image_urls && deal.image_urls.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {deal.image_urls.map((url: string, index: number) => (
                <div
                  key={index}
                  className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted"
                >
                  <Image
                    src={url}
                    alt={`${deal.title} 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>상세 설명</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {deal.description}
              </p>
            </CardContent>
          </Card>

          {/* Detail Info Card */}
          {deal.deal_category === "real_estate" ? (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>부동산 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <StatCard
                    icon={MapPin}
                    label="소재지"
                    value={
                      [deal.address, deal.city, deal.district]
                        .filter(Boolean)
                        .join(", ") || null
                    }
                  />
                  <StatCard
                    icon={Building}
                    label="대지면적"
                    value={
                      deal.property_area_sqm
                        ? `${deal.property_area_sqm}m²`
                        : null
                    }
                  />
                  <StatCard
                    icon={Building}
                    label="건축면적"
                    value={
                      deal.building_area_sqm
                        ? `${deal.building_area_sqm}m²`
                        : null
                    }
                  />
                  <StatCard
                    icon={Building}
                    label="층수"
                    value={
                      deal.floor_count ? `${deal.floor_count}층` : null
                    }
                  />
                  <StatCard
                    icon={Calendar}
                    label="준공연도"
                    value={
                      deal.built_year ? `${deal.built_year}년` : null
                    }
                  />
                  <StatCard
                    icon={MapPin}
                    label="용도지역"
                    value={deal.zoning}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>기업 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <StatCard
                    icon={Building}
                    label="업종"
                    value={deal.industry}
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="연매출"
                    value={
                      deal.annual_revenue
                        ? formatKRW(deal.annual_revenue)
                        : null
                    }
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="연이익"
                    value={
                      deal.annual_profit
                        ? formatKRW(deal.annual_profit)
                        : null
                    }
                  />
                  <StatCard
                    icon={Users}
                    label="직원 수"
                    value={
                      deal.employee_count
                        ? `${deal.employee_count}명`
                        : null
                    }
                  />
                  <StatCard
                    icon={Calendar}
                    label="설립연도"
                    value={
                      deal.founded_year
                        ? `${deal.founded_year}년`
                        : null
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Highlights */}
          {deal.highlight_points && deal.highlight_points.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>핵심 매력 포인트</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {deal.highlight_points.map(
                    (point: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {point}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Risks */}
          {deal.risk_factors && deal.risk_factors.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>리스크 요소</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {deal.risk_factors.map(
                    (risk: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-amber-400" />
                        {risk}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column — Sticky Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Price Card */}
            <Card className="border-border/50">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">매각 희망가</p>
                <p className="mt-1 text-2xl font-bold text-primary">
                  {deal.asking_price
                    ? formatKRW(deal.asking_price)
                    : "가격 협의"}
                </p>
                {deal.price_negotiable && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    가격 협의 가능
                  </p>
                )}
              </CardContent>
              <Separator />
              <CardContent className="space-y-3 pb-4 pt-4">
                <Button className="w-full" size="lg">
                  <MessageSquare className="mr-2 size-4" />
                  문의하기
                </Button>
                <InterestButton dealId={deal.id} />
              </CardContent>
            </Card>

            {/* Owner Info */}
            {deal.owner && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm">등록자 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {(
                        deal.owner.display_name ||
                        deal.owner.company_name ||
                        "?"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {deal.owner.company_name ||
                          deal.owner.display_name}
                      </p>
                      {deal.owner.verification_level > 0 && (
                        <p className="text-xs text-emerald-400">
                          인증 레벨 {deal.owner.verification_level}
                        </p>
                      )}
                    </div>
                  </div>
                  {deal.owner.bio && (
                    <p className="mt-3 text-xs text-muted-foreground line-clamp-3">
                      {deal.owner.bio}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

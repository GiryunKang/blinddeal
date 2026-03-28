import type { Metadata } from "next"

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
  Lock,
  BarChart3,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Layers,
  Ruler,
  Landmark,
} from "lucide-react"
import { getDealBySlug } from "@/lib/actions/deals"
import { getUser } from "@/lib/supabase/auth"
import { getMatchedBuyersForDeal } from "@/lib/actions/deal-visibility"
import { checkNDA } from "@/lib/actions/nda"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatKRW, formatDate } from "@/lib/utils"
import { InterestButton } from "@/components/deals/interest-button"
import { InquiryButton } from "@/components/deals/inquiry-button"
import { NDAOverlay } from "@/components/deals/nda-overlay"
import { VisibilityControl } from "@/components/deals/visibility-control"
import { PriceCardEffects } from "@/components/effects/price-card-effects"
import { BASE_URL } from "@/lib/constants"

export const revalidate = 60

interface DealDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: DealDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const deal = await getDealBySlug(decodeURIComponent(slug))

  if (!deal) {
    return { title: "딜을 찾을 수 없습니다" }
  }

  const categoryLabel = deal.deal_category === "real_estate" ? "부동산" : "M&A"
  const priceText = deal.asking_price
    ? `${(deal.asking_price / 100_000_000).toFixed(0)}억원`
    : "가격 협의"
  const description = `[${categoryLabel}] ${deal.title} — ${priceText}. ${deal.description?.slice(0, 120) ?? ""}`

  return {
    title: deal.title,
    description,
    openGraph: {
      title: `${deal.title} | BlindDeal`,
      description,
      url: `${BASE_URL}/deals/${deal.slug}`,
      type: "website",
      locale: "ko_KR",
      ...(deal.thumbnail_url && { images: [{ url: deal.thumbnail_url, width: 1200, height: 630, alt: deal.title }] }),
    },
    alternates: {
      canonical: `${BASE_URL}/deals/${deal.slug}`,
    },
  }
}

function StatCard({
  icon: Icon,
  label,
  value,
  gradient = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number | null | undefined
  gradient?: boolean
}) {
  if (!value && value !== 0) return null
  return (
    <div className="flex items-center gap-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.1]">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/10">
        <Icon className="size-4.5 text-blue-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground/70 font-medium">{label}</p>
        <p
          className={`text-sm font-semibold truncate mt-0.5 ${
            gradient
              ? "bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
              : "text-foreground"
          }`}
        >
          {String(value)}
        </p>
      </div>
    </div>
  )
}

function MiniStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: string | number
  label: string
}) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="size-4" />
      <span className="text-sm font-medium text-foreground">{value}</span>
      <span className="text-xs">{label}</span>
    </div>
  )
}

export default async function DealDetailPage({
  params,
}: DealDetailPageProps) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const deal = await getDealBySlug(decodedSlug)

  if (!deal) {
    notFound()
  }

  const currentUser = await getUser()
  const isLoggedIn = !!currentUser
  const isOwner = currentUser?.id === deal.owner_id

  // Check user's verification level
  let userVerificationLevel = 0
  if (currentUser) {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from("profiles")
      .select("verification_level")
      .eq("id", currentUser.id)
      .single()
    userVerificationLevel = profile?.verification_level ?? 0
  }

  // Verification gate: block access if user doesn't meet required level
  const requiredLevel = deal.required_verification_level ?? 0
  const meetsVerification = isOwner || userVerificationLevel >= requiredLevel
  const showVerificationGate = requiredLevel > 0 && !meetsVerification && isLoggedIn

  // Check NDA status for private deals
  let ndaSigned = false
  let userInterested = false
  if (currentUser && deal.visibility === "private" && !isOwner) {
    const ndaResult = await checkNDA(deal.id)
    ndaSigned = ndaResult.signed
  } else if (deal.visibility === "public" || isOwner) {
    ndaSigned = true
  }

  // Check if user has shown interest
  if (currentUser && !showVerificationGate) {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    const { data: interest } = await supabase
      .from("deal_interests")
      .select("id")
      .eq("deal_id", deal.id)
      .eq("user_id", currentUser.id)
      .single()
    userInterested = !!interest
  }

  // For private deals without NDA signed, show NDA overlay
  const showNDAOverlay =
    deal.visibility === "private" && !ndaSigned && !isOwner && !showVerificationGate

  let matchedBuyerCount = 0
  if (isOwner) {
    try {
      const result = await getMatchedBuyersForDeal(deal.id)
      matchedBuyerCount = result.count
    } catch {
      // ignore if not owner or error
    }
  }

  const categoryLabel =
    deal.deal_category === "real_estate" ? "부동산" : "M&A(인수합병)"
  const categoryBadgeClass =
    deal.deal_category === "real_estate"
      ? "bg-blue-500/20 border-blue-500/30 text-blue-300"
      : "bg-purple-500/20 border-purple-500/30 text-purple-300"

  const visibilityLabel = deal.visibility === "public" ? "공개" : "비공개"
  const visibilityBadgeClass =
    deal.visibility === "public"
      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
      : "bg-amber-500/20 border-amber-500/30 text-amber-300"

  const statusMap: Record<string, string> = {
    draft: "초안",
    pending_review: "검토 중",
    active: "활성",
    under_negotiation: "협상 중",
    due_diligence: "실사(정밀조사) 진행",
    contract: "계약 진행",
    escrow: "에스크로(안심결제)",
    closed: "완료",
    cancelled: "취소",
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: deal.title,
    description: deal.description?.slice(0, 300),
    url: `${BASE_URL}/deals/${deal.slug}`,
    ...(deal.thumbnail_url && { image: deal.thumbnail_url }),
    category: categoryLabel,
    offers: {
      "@type": "Offer",
      priceCurrency: deal.price_currency || "KRW",
      ...(deal.asking_price && { price: deal.asking_price }),
      availability: deal.status === "active"
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
    },
  }

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Background gradient decoration */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-500/[0.04] via-indigo-500/[0.02] to-transparent" />

      {showVerificationGate && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md">
          <div className="mx-auto max-w-md px-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <Shield className="h-10 w-10 text-amber-400" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-foreground">인증 등급이 부족합니다</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              이 딜은 <span className="font-semibold text-amber-400">인증 등급 {requiredLevel} 이상</span>이 필요합니다.
              현재 회원님의 등급은 <span className="font-semibold text-foreground">{userVerificationLevel}</span>입니다.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="/profile/verification"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30"
              >
                인증 등급 올리기
              </a>
              <a
                href="/deals"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                다른 딜 둘러보기
              </a>
            </div>
          </div>
        </div>
      )}

      {showNDAOverlay && (
        <NDAOverlay
          dealId={deal.id}
          dealTitle={deal.title}
          dealCategory={deal.deal_category}
        />
      )}

      <div
        className={`relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ${
          showNDAOverlay ? "pointer-events-none select-none blur-md" : ""
        }`}
      >
        {/* Hero Header */}
        <div className="mb-8">
          {/* Badges row */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border ${categoryBadgeClass}`}
            >
              {categoryLabel}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border ${visibilityBadgeClass}`}
            >
              {deal.visibility === "private" && (
                <Lock className="mr-0.5 size-3" />
              )}
              {visibilityLabel}
            </span>
            <Badge variant="outline" className="backdrop-blur-md">
              {statusMap[deal.status] || deal.status}
            </Badge>
            {deal.visibility === "private" && ndaSigned && !isOwner && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border bg-emerald-500/20 border-emerald-500/30 text-emerald-300">
                <Shield className="size-3" />
                비밀유지계약(NDA) 서명 완료
              </span>
            )}
          </div>

          {/* Title — large gradient text */}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {deal.title}
          </h1>

          {/* Meta stats row */}
          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <MiniStat icon={Eye} value={deal.view_count} label="조회" />
            <MiniStat icon={Heart} value={deal.interest_count} label="관심" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4" />
              <span className="text-sm">{formatDate(deal.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Images Gallery */}
            {deal.image_urls && deal.image_urls.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {deal.image_urls.map((url: string, index: number) => (
                  <div
                    key={index}
                    className={`group/img relative overflow-hidden rounded-2xl bg-muted border border-border/30 ${
                      index === 0 && deal.image_urls.length > 1
                        ? "sm:col-span-2 aspect-[16/9]"
                        : "aspect-[16/10]"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${deal.title} 이미지 ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/img:scale-105"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/img:bg-black/10" />
                  </div>
                ))}
              </div>
            )}

            {/* Description — glass card */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="h-5 w-1 rounded-full bg-gradient-to-b from-blue-400 to-indigo-400" />
                상세 설명
              </h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {deal.description}
              </p>
            </div>

            {/* Detail Info Card */}
            {deal.deal_category === "real_estate" ? (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-gradient-to-b from-blue-400 to-indigo-400" />
                  부동산 정보
                </h2>
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
                    icon={Ruler}
                    label="대지면적"
                    value={
                      deal.property_area_sqm
                        ? `${deal.property_area_sqm}m²`
                        : null
                    }
                    gradient
                  />
                  <StatCard
                    icon={Building2}
                    label="건축면적"
                    value={
                      deal.building_area_sqm
                        ? `${deal.building_area_sqm}m²`
                        : null
                    }
                    gradient
                  />
                  <StatCard
                    icon={Layers}
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
                    icon={Landmark}
                    label="용도지역"
                    value={deal.zoning}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-gradient-to-b from-purple-400 to-pink-400" />
                  기업 정보
                </h2>
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
                    gradient
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="연이익"
                    value={
                      deal.annual_profit
                        ? formatKRW(deal.annual_profit)
                        : null
                    }
                    gradient
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
              </div>
            )}

            {/* Highlights — premium green card */}
            {deal.highlight_points && deal.highlight_points.length > 0 && (
              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-green-400" />
                  핵심 매력 포인트
                </h2>
                <ul className="space-y-3">
                  {deal.highlight_points.map(
                    (point: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                        <span>{point}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Risks — premium amber/red card */}
            {deal.risk_factors && deal.risk_factors.length > 0 && (
              <div className="rounded-2xl border border-amber-500/10 bg-amber-500/[0.03] p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-gradient-to-b from-amber-400 to-red-400" />
                  리스크 요소
                </h2>
                <ul className="space-y-3">
                  {deal.risk_factors.map(
                    (risk: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
                        <span>{risk}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column — Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Price Card — premium glass with shine */}
              <div className="price-card-shine rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md overflow-hidden relative">
                <PriceCardEffects />
                {/* Breathing gradient accent at top */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" style={{ animation: "breathe 3s ease-in-out infinite" }} />

                <p className="text-sm text-muted-foreground font-medium">매각 희망가</p>
                <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
                  {deal.asking_price
                    ? formatKRW(deal.asking_price)
                    : "가격 협의"}
                </p>
                {deal.price_negotiable && (
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    가격 협의 가능
                  </p>
                )}

                {/* Divider */}
                <div className="my-5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {/* CTA Buttons */}
                <div className="space-y-3">
                  {!isOwner && (
                    <InquiryButton
                      dealId={deal.id}
                      dealTitle={deal.title}
                      dealCategory={deal.deal_category}
                    />
                  )}
                  <InterestButton
                    dealId={deal.id}
                    initialInterested={userInterested}
                    initialCount={deal.interest_count ?? 0}
                  />
                </div>
              </div>

              {/* Owner Info — premium glass */}
              {deal.owner && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-foreground mb-4">등록자 정보</h3>
                  <div className="flex items-center gap-3.5">
                    <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/10 text-lg font-semibold text-blue-400">
                      {(
                        deal.owner.display_name ||
                        deal.owner.company_name ||
                        "?"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {deal.owner.company_name ||
                          deal.owner.display_name}
                      </p>
                      {deal.owner.verification_level > 0 && (
                        <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
                          <Shield className="size-3 text-emerald-400" />
                          <span className="text-[10px] font-medium text-emerald-400">
                            인증 레벨 {deal.owner.verification_level}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {deal.owner.bio && (
                    <p className="mt-4 text-xs text-muted-foreground leading-relaxed line-clamp-3 border-t border-white/[0.04] pt-4">
                      {deal.owner.bio}
                    </p>
                  )}
                </div>
              )}

              {/* Owner-only: Visibility Control & Analytics */}
              {isOwner && (
                <>
                  <VisibilityControl
                    dealId={deal.id}
                    currentVisibility={deal.visibility}
                    currentRequiredLevel={deal.required_verification_level ?? 0}
                    matchedBuyerCount={matchedBuyerCount}
                    dealSlug={slug}
                  />
                  <a href={`/deals/${slug}/analytics`}>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-white/[0.08] bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.06] transition-all duration-300"
                      size="sm"
                    >
                      <BarChart3 className="mr-2 size-4" />
                      관심도 분석 대시보드
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

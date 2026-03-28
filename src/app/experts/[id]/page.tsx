import type { Metadata } from "next"

import { notFound } from "next/navigation"
import Link from "next/link"
import { getExpert } from "@/lib/actions/experts"
import { BASE_URL } from "@/lib/constants"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Star,
  Briefcase,
  Clock,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
} from "lucide-react"
import { formatKRW } from "@/lib/utils"

const typeColorMap: Record<string, string> = {
  법무: "bg-blue-500/20 text-blue-400",
  회계: "bg-emerald-500/20 text-emerald-400",
  세무: "bg-amber-500/20 text-amber-400",
  감정: "bg-purple-500/20 text-purple-400",
  컨설팅: "bg-rose-500/20 text-rose-400",
}

interface ExpertDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: ExpertDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const expert = await getExpert(id)

  if (!expert) {
    return { title: "전문가를 찾을 수 없습니다" }
  }

  const name = expert.profile?.display_name ?? "전문가"
  const firm = expert.firm_name ?? ""
  const description = `${name} — ${expert.expert_type} 전문가${firm ? ` (${firm})` : ""}. ${expert.bio?.slice(0, 120) ?? "BlindDeal 인증 전문가"}`

  return {
    title: `${name} — ${expert.expert_type} 전문가`,
    description,
    openGraph: {
      title: `${name} | BlindDeal 전문가`,
      description,
      url: `${BASE_URL}/experts/${id}`,
      type: "profile",
      locale: "ko_KR",
    },
    alternates: {
      canonical: `${BASE_URL}/experts/${id}`,
    },
  }
}

export default async function ExpertDetailPage({
  params,
}: ExpertDetailPageProps) {
  const { id } = await params
  const expert = await getExpert(id)

  if (!expert) {
    notFound()
  }

  const displayName = expert.profile?.display_name ?? "전문가"
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        href="/experts"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        전문가 목록
      </Link>

      {/* Profile header */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={expert.profile?.avatar_url ?? undefined}
            alt={displayName}
          />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">
                {displayName}
              </h1>
              {expert.verified_at && (
                <CheckCircle className="size-5 text-blue-400" />
              )}
            </div>
            {expert.profile?.company_name && (
              <p className="mt-0.5 text-muted-foreground">
                {expert.profile.company_name}
              </p>
            )}
          </div>

          {/* Specialty badges */}
          <div className="flex flex-wrap gap-1.5">
            {expert.specialty.map((spec: string) => (
              <Badge
                key={spec}
                className={
                  typeColorMap[spec] ?? "bg-gray-500/20 text-gray-400"
                }
              >
                {spec}
              </Badge>
            ))}
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">
                {expert.rating.toFixed(1)}
              </span>
              ({expert.review_count} 리뷰)
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="size-4" />
              경력 {expert.years_of_experience}년
            </span>
            {expert.hourly_rate && (
              <span className="flex items-center gap-1">
                <Clock className="size-4" />
                {formatKRW(expert.hourly_rate)}/시간
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column: details */}
        <div className="space-y-6 md:col-span-2">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle>소개</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                {expert.introduction ?? "소개 내용이 없습니다."}
              </p>
            </CardContent>
          </Card>

          {/* Bio */}
          {expert.profile?.bio && (
            <Card>
              <CardHeader>
                <CardTitle>약력</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                  {expert.profile.bio}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: actions */}
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-3 pt-4">
              <Button className="w-full">전문가 배정 요청</Button>
              {expert.portfolio_url && (
                <a
                  href={expert.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="mr-1.5 size-4" />
                    포트폴리오
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>

          {/* License info */}
          {expert.license_number && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">자격증 번호</p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {expert.license_number}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

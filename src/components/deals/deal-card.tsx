import Link from "next/link"
import Image from "next/image"
import { Eye, Heart, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatKRW } from "@/lib/utils"

interface DealCardProps {
  deal: {
    id: string
    slug: string
    title: string
    description: string
    deal_category: string
    visibility: string
    asking_price: number | null
    thumbnail_url: string | null
    view_count: number
    interest_count: number
    owner?: {
      display_name: string
      company_name?: string | null
    } | null
  }
  isBlind?: boolean
}

export function DealCard({ deal, isBlind = false }: DealCardProps) {
  const categoryLabel = deal.deal_category === "real_estate" ? "부동산" : "M&A"
  const categoryColor =
    deal.deal_category === "real_estate"
      ? "bg-blue-500/20 text-blue-400"
      : "bg-purple-500/20 text-purple-400"

  const visibilityLabel = deal.visibility === "public" ? "공개" : "비공개"
  const visibilityColor =
    deal.visibility === "public"
      ? "bg-emerald-500/20 text-emerald-400"
      : "bg-amber-500/20 text-amber-400"

  return (
    <Link href={isBlind ? "#" : `/deals/${deal.slug}`} className="group block">
      <Card className="relative overflow-hidden border-border/50 transition-all hover:border-border">
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {deal.thumbnail_url ? (
            <Image
              src={deal.thumbnail_url}
              alt={isBlind ? "비공개 딜" : deal.title}
              fill
              className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                isBlind ? "blur-xl scale-110" : ""
              }`}
            />
          ) : (
            <div className={`flex h-full items-center justify-center text-muted-foreground ${isBlind ? "blur-md" : ""}`}>
              <svg
                className="size-12 opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          )}

          {/* Badges overlay — always visible */}
          <div className="absolute left-2 top-2 flex gap-1.5">
            <Badge className={categoryColor}>{categoryLabel}</Badge>
            <Badge className={visibilityColor}>{visibilityLabel}</Badge>
          </div>

          {/* Blind lock overlay on thumbnail */}
          {isBlind && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-sm">
                <Lock className="h-5 w-5 text-white/70" />
              </div>
            </div>
          )}
        </div>

        <CardContent className="space-y-2 pt-3">
          {/* Title */}
          {isBlind ? (
            <h3 className="line-clamp-1 select-none text-base font-semibold text-muted-foreground/40 blur-[5px]">
              비공개 딜 제목 영역
            </h3>
          ) : (
            <h3 className="line-clamp-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
              {deal.title}
            </h3>
          )}

          {/* Description */}
          {isBlind ? (
            <p className="line-clamp-2 select-none text-sm text-muted-foreground/30 blur-[4px]">
              이 딜의 상세 내용은 인증된 사용자만 열람할 수 있습니다
            </p>
          ) : (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {deal.description}
            </p>
          )}

          {/* Price */}
          {isBlind ? (
            <div className="select-none text-lg font-bold text-muted-foreground/30 blur-[4px]">
              ████████
            </div>
          ) : (
            <div className="text-lg font-bold text-primary">
              {deal.asking_price ? formatKRW(deal.asking_price) : "가격 협의"}
            </div>
          )}

          {/* Blind notice or normal footer */}
          {isBlind ? (
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-1.5">
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs text-amber-400">열람 권한 필요</span>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="size-3.5" />
                  {deal.view_count}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="size-3.5" />
                  {deal.interest_count}
                </span>
              </div>
              {deal.owner && (
                <span className="max-w-[120px] truncate">
                  {deal.owner.company_name || deal.owner.display_name}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

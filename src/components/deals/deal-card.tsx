import Link from "next/link"
import Image from "next/image"
import { Eye, Heart, Lock, Building2 } from "lucide-react"
import { formatKRW } from "@/lib/utils"
import { ClassifiedStamp } from "@/components/effects/classified-stamp"

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
    view_count?: number | null
    interest_count?: number | null
    owner?: {
      display_name?: string | null
      company_name?: string | null
    } | null
  }
  isBlind?: boolean
}

export function DealCard({ deal, isBlind = false }: DealCardProps) {
  const categoryLabel = deal.deal_category === "real_estate" ? "부동산" : "M&A"
  const categoryBadgeClass =
    deal.deal_category === "real_estate"
      ? "bg-blue-500/20 border-blue-500/30 text-blue-300"
      : "bg-purple-500/20 border-purple-500/30 text-purple-300"

  const visibilityLabel = deal.visibility === "public" ? "공개" : "비공개"
  const visibilityBadgeClass =
    deal.visibility === "public"
      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
      : "bg-amber-500/20 border-amber-500/30 text-amber-300"

  return (
    <Link href={isBlind ? "#" : `/deals/${deal.slug}`} className="group block">
      <div className={`relative rounded-2xl overflow-hidden bg-card border transition-all duration-300 hover:translate-y-[-4px] ${
        isBlind
          ? "watermark-confidential border-red-500/15 hover:border-amber-500/25 hover:shadow-[0_20px_60px_-15px_rgba(239,68,68,0.1)]"
          : "border-border/50 hover:border-blue-500/30 hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.15)]"
      }`}>
        {/* Image Area */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

          {/* Category badge - glass effect */}
          <div className="absolute top-3 left-3 z-20">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${categoryBadgeClass}`}
            >
              {categoryLabel}
            </span>
          </div>

          {/* Visibility badge */}
          <div className="absolute top-3 right-3 z-20">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium backdrop-blur-md border ${visibilityBadgeClass}`}
            >
              {deal.visibility === "private" && <Lock className="w-2.5 h-2.5" />}
              {visibilityLabel}
            </span>
          </div>

          {/* Price overlay at bottom */}
          <div className="absolute bottom-3 left-4 z-20">
            {!isBlind && (
              <p className="text-lg font-bold text-white drop-shadow-lg">
                {deal.asking_price ? formatKRW(deal.asking_price) : "가격 협의"}
              </p>
            )}
          </div>

          {/* Thumbnail or placeholder */}
          {deal.thumbnail_url ? (
            <Image
              src={deal.thumbnail_url}
              alt={isBlind ? "비공개 딜" : deal.title}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                isBlind ? "blur-xl scale-110" : ""
              }`}
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br from-card via-muted to-muted/80 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 ${
                isBlind ? "blur-md" : ""
              }`}
            >
              <Building2 className="w-12 h-12 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Blind overlay with classified stamp */}
        {isBlind && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
            {/* Classified stamp */}
            <ClassifiedStamp level={3} />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              {/* Pulsing glow */}
              <div className="absolute inset-0 rounded-full bg-red-500/15 animate-pulse" />
              <Lock className="relative h-6 w-6 text-white/80" />
            </div>
            <p className="mt-3 text-sm font-medium text-white/70">인증 후 열람 가능</p>
            <div className="mt-2 flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 backdrop-blur-md">
              <Lock className="h-3 w-3 text-amber-400" />
              <span className="text-[11px] text-amber-400">열람 권한 필요</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          {isBlind ? (
            <h3 className="line-clamp-1 select-none text-lg font-semibold">
              <span className="redacted">██████ ████ ██████</span>
            </h3>
          ) : (
            <h3 className="line-clamp-1 text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-blue-400">
              {deal.title}
            </h3>
          )}

          {/* Description */}
          {isBlind ? (
            <p className="line-clamp-2 select-none text-sm mt-1.5">
              <span className="redacted">████████ ██████ ████ ██████████</span>
            </p>
          ) : (
            <p className="line-clamp-2 text-sm text-muted-foreground mt-1.5">
              {deal.description}
            </p>
          )}

          {/* Price (visible in content area) */}
          {!isBlind && (
            <div className="mt-3 text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {deal.asking_price ? formatKRW(deal.asking_price) : "가격 협의"}
            </div>
          )}
          {isBlind && (
            <div className="mt-3 select-none text-xl font-bold">
              <span className="redacted">&#8361;██,███,███,███</span>
            </div>
          )}

          {/* Stats row */}
          {!isBlind && (
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {(deal.view_count ?? 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {(deal.interest_count ?? 0).toLocaleString()}
              </span>
              <span className="ml-auto max-w-[120px] truncate text-muted-foreground/60">
                {deal.owner?.company_name || deal.owner?.display_name || "익명"}
              </span>
            </div>
          )}

          {/* Tags */}
          {!isBlind && (
            <div className="flex gap-1.5 mt-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted/50 text-muted-foreground border border-border/30">
                {categoryLabel}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted/50 text-muted-foreground border border-border/30">
                {visibilityLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

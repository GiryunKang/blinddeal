import Link from "next/link"
import Image from "next/image"
import { Eye, Heart } from "lucide-react"
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
}

export function DealCard({ deal }: DealCardProps) {
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
    <Link href={`/deals/${deal.slug}`} className="group block">
      <Card className="overflow-hidden border-border/50 transition-all hover:border-border">
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {deal.thumbnail_url ? (
            <Image
              src={deal.thumbnail_url}
              alt={deal.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
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
          {/* Badges overlay */}
          <div className="absolute left-2 top-2 flex gap-1.5">
            <Badge className={categoryColor}>{categoryLabel}</Badge>
            <Badge className={visibilityColor}>{visibilityLabel}</Badge>
          </div>
        </div>

        <CardContent className="space-y-2 pt-3">
          {/* Title */}
          <h3 className="line-clamp-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
            {deal.title}
          </h3>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {deal.description}
          </p>

          {/* Price */}
          <div className="text-lg font-bold text-primary">
            {deal.asking_price ? formatKRW(deal.asking_price) : "가격 협의"}
          </div>

          {/* Footer: stats + owner */}
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
              <span className="truncate max-w-[120px]">
                {deal.owner.company_name || deal.owner.display_name}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

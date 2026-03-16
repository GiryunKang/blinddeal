import Link from "next/link"
import Image from "next/image"
import { Eye, Heart, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

const categoryColors: Record<string, string> = {
  "시장 트렌드": "bg-blue-500/20 text-blue-400",
  "부동산 분석": "bg-emerald-500/20 text-emerald-400",
  "M&A 인사이트": "bg-purple-500/20 text-purple-400",
  "산업 리포트": "bg-amber-500/20 text-amber-400",
  "전문가 칼럼": "bg-rose-500/20 text-rose-400",
}

interface ArticleCardProps {
  article: {
    id: string
    title: string
    summary: string | null
    cover_image_url: string | null
    category: string
    tags: string[]
    view_count: number
    like_count: number
    published_at: string | null
    created_at: string
    author?: {
      display_name: string
      avatar_url: string | null
      company_name?: string | null
    } | null
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  const colorClass =
    categoryColors[article.category] ?? "bg-zinc-500/20 text-zinc-400"

  return (
    <Link href={`/insights/${article.id}`} className="group block">
      <Card className="overflow-hidden border-border/50 transition-all hover:border-border">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {article.cover_image_url ? (
            <Image
              src={article.cover_image_url}
              alt={article.title}
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          )}
          {/* Category badge overlay */}
          <div className="absolute left-2 top-2">
            <Badge className={colorClass}>{article.category}</Badge>
          </div>
        </div>

        <CardContent className="space-y-2 pt-3">
          {/* Title */}
          <h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
            {article.title}
          </h3>

          {/* Summary */}
          {article.summary && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {article.summary}
            </p>
          )}

          {/* Footer: author + stats */}
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {article.author && (
                <span className="truncate max-w-[100px]">
                  {article.author.company_name || article.author.display_name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {formatDate(article.published_at || article.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="size-3.5" />
                {article.view_count}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="size-3.5" />
                {article.like_count}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

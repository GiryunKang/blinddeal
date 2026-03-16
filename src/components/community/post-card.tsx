import Link from "next/link"
import { Eye, Heart, MessageCircle, Pin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"

const boardColors: Record<string, string> = {
  "부동산": "bg-blue-500/20 text-blue-400",
  "M&A": "bg-purple-500/20 text-purple-400",
  "Q&A": "bg-emerald-500/20 text-emerald-400",
  "딜 후기": "bg-amber-500/20 text-amber-400",
  "전문가 AMA": "bg-rose-500/20 text-rose-400",
}

interface PostCardProps {
  post: {
    id: string
    title: string
    content: string
    category: string
    tags: string[]
    view_count: number
    like_count: number
    comment_count: number
    is_pinned: boolean
    created_at: string
    author?: {
      id: string
      display_name: string
      avatar_url: string | null
      company_name?: string | null
    } | null
  }
}

export function PostCard({ post }: PostCardProps) {
  const colorClass =
    boardColors[post.category] ?? "bg-zinc-500/20 text-zinc-400"
  const authorName =
    post.author?.company_name || post.author?.display_name || "익명"
  const initials = authorName.slice(0, 2).toUpperCase()

  return (
    <Link
      href={`/community/${encodeURIComponent(post.category)}/${post.id}`}
      className="group block"
    >
      <div className="flex gap-4 rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-border">
        {/* Author avatar */}
        <Avatar className="mt-0.5 hidden shrink-0 sm:flex">
          <AvatarImage src={post.author?.avatar_url ?? undefined} alt={authorName} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Title row */}
          <div className="flex items-start gap-2">
            {post.is_pinned && (
              <Pin className="mt-0.5 size-4 shrink-0 text-primary" />
            )}
            <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </h3>
          </div>

          {/* Content excerpt */}
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {post.content}
          </p>

          {/* Bottom row: meta */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <Badge className={`${colorClass} text-[10px]`}>
              {post.category}
            </Badge>
            <span>{authorName}</span>
            <span>{formatDate(post.created_at)}</span>
            <span className="flex items-center gap-1">
              <Eye className="size-3" />
              {post.view_count}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="size-3" />
              {post.like_count}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3" />
              {post.comment_count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

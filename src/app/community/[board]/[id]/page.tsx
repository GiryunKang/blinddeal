import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, Heart, Clock } from "lucide-react"
import { getPost } from "@/lib/actions/community"
import { getUser } from "@/lib/supabase/auth"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"
import { CommentSection } from "@/components/community/comment-section"
import { PostLikeButton } from "@/components/community/post-like-button"

const boardLabels: Record<string, string> = {
  general: "일반",
  real_estate: "부동산",
  ma: "M&A",
  qna: "Q&A",
  deal_review: "딜 후기",
  expert_ama: "전문가 AMA",
}

const boardColors: Record<string, string> = {
  real_estate: "bg-blue-500/20 text-blue-400",
  ma: "bg-purple-500/20 text-purple-400",
  qna: "bg-emerald-500/20 text-emerald-400",
  deal_review: "bg-amber-500/20 text-amber-400",
  expert_ama: "bg-rose-500/20 text-rose-400",
  general: "bg-zinc-500/20 text-zinc-400",
}

interface PostDetailPageProps {
  params: Promise<{ board: string; id: string }>
}

export default async function PostDetailPage({
  params,
}: PostDetailPageProps) {
  const { board, id } = await params
  const post = await getPost(id)
  const user = await getUser()

  if (!post) {
    notFound()
  }

  const decodedBoard = decodeURIComponent(board)
  const colorClass =
    boardColors[post.category] ?? "bg-zinc-500/20 text-zinc-400"
  const authorName =
    post.author?.company_name || post.author?.display_name || "익명"
  const initials = authorName.slice(0, 2).toUpperCase()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        href={`/community?board=${encodeURIComponent(decodedBoard)}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {decodedBoard} 게시판
      </Link>

      {/* Post header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge className={colorClass}>{post.category}</Badge>
          {post.tags?.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          {post.title}
        </h1>

        {/* Author + meta */}
        <div className="mt-4 flex items-center gap-3">
          <Avatar size="sm">
            <AvatarImage
              src={post.author?.avatar_url ?? undefined}
              alt={authorName}
            />
            <AvatarFallback className="text-[10px]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{authorName}</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatDate(post.created_at, "yyyy.MM.dd HH:mm")}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3" />
              {post.view_count}
            </span>
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Content */}
      <div className="mb-8 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
        {post.content}
      </div>

      {/* Like button */}
      <div className="mb-8 flex items-center gap-2">
        <PostLikeButton
          postId={post.id}
          likeCount={post.like_count}
          userLiked={post.userLiked}
          isAuthenticated={!!user}
        />
      </div>

      <Separator className="mb-6" />

      {/* Comments */}
      <CommentSection
        postId={post.id}
        comments={post.comments}
        isAuthenticated={!!user}
      />
    </div>
  )
}

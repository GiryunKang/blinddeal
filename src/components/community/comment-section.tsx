"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"
import { createComment } from "@/lib/actions/community"
import { MessageCircle } from "lucide-react"

interface CommentAuthor {
  id: string
  display_name: string
  avatar_url: string | null
}

interface CommentData {
  id: string
  post_id: string
  author_id: string
  parent_id: string | null
  content: string
  like_count: number
  created_at: string
  author?: CommentAuthor | null
}

interface CommentSectionProps {
  postId: string
  comments: CommentData[]
  isAuthenticated: boolean
}

export function CommentSection({
  postId,
  comments,
  isAuthenticated,
}: CommentSectionProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  // Build tree of comments
  const rootComments = comments.filter((c) => !c.parent_id)
  const childMap = new Map<string, CommentData[]>()
  for (const c of comments) {
    if (c.parent_id) {
      const children = childMap.get(c.parent_id) ?? []
      children.push(c)
      childMap.set(c.parent_id, children)
    }
  }

  function handleSubmitComment() {
    if (!newComment.trim()) return
    startTransition(async () => {
      try {
        await createComment(postId, newComment.trim())
        setNewComment("")
        toast.success("댓글이 등록되었습니다.")
        router.refresh()
      } catch {
        toast.error("댓글 등록에 실패했습니다. 다시 시도해주세요.")
      }
    })
  }

  function handleSubmitReply(parentId: string) {
    if (!replyContent.trim()) return
    startTransition(async () => {
      try {
        await createComment(postId, replyContent.trim(), parentId)
        setReplyContent("")
        setReplyTo(null)
        toast.success("답글이 등록되었습니다.")
        router.refresh()
      } catch {
        toast.error("답글 등록에 실패했습니다. 다시 시도해주세요.")
      }
    })
  }

  function renderComment(comment: CommentData, depth: number = 0) {
    const authorName = comment.author?.display_name ?? "익명"
    const initials = authorName.slice(0, 2).toUpperCase()
    const children = childMap.get(comment.id) ?? []

    return (
      <div
        key={comment.id}
        className={depth > 0 ? "ml-8 border-l border-border/50 pl-4" : ""}
      >
        <div className="flex gap-3 py-3">
          <Avatar size="sm" className="mt-0.5 shrink-0">
            <AvatarImage
              src={comment.author?.avatar_url ?? undefined}
              alt={authorName}
            />
            <AvatarFallback className="text-[10px]">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-foreground">
                {authorName}
              </span>
              <span className="text-muted-foreground">
                {formatDate(comment.created_at, "yyyy.MM.dd HH:mm")}
              </span>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
              {comment.content}
            </p>
            {isAuthenticated && depth < 2 && (
              <button
                onClick={() =>
                  setReplyTo(replyTo === comment.id ? null : comment.id)
                }
                className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="size-3" />
                답글
              </button>
            )}

            {/* Reply form */}
            {replyTo === comment.id && (
              <div className="mt-2 space-y-2">
                <Textarea
                  placeholder="답글을 작성하세요..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[60px] text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={isPending || !replyContent.trim()}
                  >
                    {isPending ? "작성 중..." : "답글 작성"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setReplyTo(null)
                      setReplyContent("")
                    }}
                  >
                    취소
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nested replies */}
        {children.map((child) => renderComment(child, depth + 1))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">
        댓글 {comments.length}개
      </h3>

      {/* New comment form */}
      {isAuthenticated ? (
        <div className="space-y-2">
          <Textarea
            placeholder="댓글을 작성하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleSubmitComment}
              disabled={isPending || !newComment.trim()}
            >
              {isPending ? "작성 중..." : "댓글 작성"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border/50 bg-muted/50 p-4 text-center text-sm text-muted-foreground">
          댓글을 작성하려면 로그인하세요.
        </div>
      )}

      {/* Comments list */}
      <div className="divide-y divide-border/50">
        {rootComments.length > 0 ? (
          rootComments.map((comment) => renderComment(comment))
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            아직 댓글이 없습니다. 첫 댓글을 작성해보세요.
          </p>
        )}
      </div>
    </div>
  )
}

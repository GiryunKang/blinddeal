export const revalidate = 60 // Revalidate every 60 seconds

import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "커뮤니티" }
import { Plus, MessageCircle } from "lucide-react"
import { getPosts } from "@/lib/actions/community"
import { getUser } from "@/lib/supabase/auth"
import { PostCard } from "@/components/community/post-card"
import { Button } from "@/components/ui/button"

const boards = [
  { value: "all", label: "전체" },
  { value: "real_estate", label: "부동산" },
  { value: "ma", label: "M&A" },
  { value: "qna", label: "Q&A" },
  { value: "deal_review", label: "딜 후기" },
  { value: "expert_ama", label: "전문가 AMA" },
]

interface CommunityPageProps {
  searchParams: Promise<{
    board?: string
    page?: string
  }>
}

export default async function CommunityPage({
  searchParams,
}: CommunityPageProps) {
  const params = await searchParams
  const activeBoard = params.board || "all"
  const currentPage = params.page ? parseInt(params.page, 10) : 1
  const user = await getUser()

  const { posts, count } = await getPosts(
    activeBoard === "all" ? undefined : activeBoard,
    currentPage
  )
  const totalPages = Math.ceil(count / 20)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            커뮤니티
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            투자자 · 전문가와 함께하는 토론 공간
          </p>
        </div>
        {user && (
          <Link href="/community/new">
            <Button size="sm">
              <Plus className="mr-1 size-4" />
              글쓰기
            </Button>
          </Link>
        )}
      </div>

      {/* Board Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {boards.map((board) => {
          const isActive = board.value === activeBoard
          return (
            <Link
              key={board.value}
              href={
                board.value === "all"
                  ? "/community"
                  : `/community?board=${encodeURIComponent(board.value)}`
              }
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {board.label}
            </Link>
          )
        })}
      </div>

      {/* Posts List */}
      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post: (typeof posts)[number]) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="rounded-full bg-muted p-4">
            <MessageCircle className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            아직 게시글이 없습니다
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            첫 게시글을 작성해보세요
          </p>
          {user && (
            <Link href="/community/new" className="mt-4">
              <Button size="sm" className="gap-1.5">
                <Plus className="size-3.5" />
                첫 게시글 작성하기
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/community?${new URLSearchParams({
                ...(activeBoard !== "all" ? { board: activeBoard } : {}),
                page: String(currentPage - 1),
              }).toString()}`}
              className="rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              이전
            </Link>
          )}
          <span className="text-sm text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/community?${new URLSearchParams({
                ...(activeBoard !== "all" ? { board: activeBoard } : {}),
                page: String(currentPage + 1),
              }).toString()}`}
              className="rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              다음
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

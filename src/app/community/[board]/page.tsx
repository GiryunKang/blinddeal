import Link from "next/link"
import { Plus, ArrowLeft } from "lucide-react"
import { getPosts } from "@/lib/actions/community"
import { getUser } from "@/lib/supabase/auth"
import { PostCard } from "@/components/community/post-card"
import { Button } from "@/components/ui/button"

interface BoardPageProps {
  params: Promise<{ board: string }>
  searchParams: Promise<{ page?: string }>
}

export default async function BoardPage({
  params,
  searchParams,
}: BoardPageProps) {
  const { board } = await params
  const sp = await searchParams
  const decodedBoard = decodeURIComponent(board)
  const currentPage = sp.page ? parseInt(sp.page, 10) : 1
  const user = await getUser()

  const { posts, count } = await getPosts(decodedBoard, currentPage)
  const totalPages = Math.ceil(count / 20)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        href="/community"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        커뮤니티
      </Link>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {decodedBoard}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            총 {count}개의 게시글
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
            <svg
              className="size-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            등록된 게시글이 없습니다
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            첫 게시글을 작성해보세요
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/community/${board}?page=${currentPage - 1}`}
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
              href={`/community/${board}?page=${currentPage + 1}`}
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

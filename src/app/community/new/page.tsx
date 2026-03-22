"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createPost } from "@/lib/actions/community"

const boardMap: Record<string, string> = {
  "부동산": "real_estate",
  "M&A": "ma",
  "Q&A": "qna",
  "딜 후기": "deal_review",
  "전문가 AMA": "expert_ama",
}
const boards = Object.keys(boardMap)

export default function NewPostPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedBoard, setSelectedBoard] = useState(boards[0])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set("category", boardMap[selectedBoard] || "general")

    startTransition(async () => {
      const result = await createPost(formData)
      router.push(
        `/community/${encodeURIComponent(selectedBoard)}/${result.id}`
      )
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        href="/community"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        커뮤니티
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-foreground">
        새 게시글 작성
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Board selection */}
        <div className="space-y-2">
          <Label>게시판</Label>
          <div className="flex flex-wrap gap-2">
            {boards.map((board) => (
              <button
                key={board}
                type="button"
                onClick={() => setSelectedBoard(board)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  board === selectedBoard
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {board}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">제목</Label>
          <Input
            id="title"
            name="title"
            placeholder="게시글 제목을 입력하세요"
            required
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">내용</Label>
          <Textarea
            id="content"
            name="content"
            placeholder="내용을 입력하세요..."
            className="min-h-[200px]"
            required
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
          <Input
            id="tags"
            name="tags"
            placeholder="예: 오피스텔, 서울, 투자"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "작성 중..." : "게시글 작성"}
          </Button>
          <Link href="/community">
            <Button type="button" variant="outline">
              취소
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

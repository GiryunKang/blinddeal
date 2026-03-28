"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { startInquiry } from "@/lib/actions/inquiry"
import { NDADialog } from "./nda-dialog"

interface InquiryButtonProps {
  dealId: string
  dealTitle: string
  dealCategory: string
  isPrivate?: boolean
  isOwner?: boolean
}

export function InquiryButton({
  dealId,
  dealTitle,
  dealCategory,
  isPrivate = false,
  isOwner = false,
}: InquiryButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [showNDA, setShowNDA] = useState(false)
  const router = useRouter()

  function handleClick() {
    startTransition(async () => {
      const result = await startInquiry(dealId)

      if (!result.success) {
        if (result.error?.includes("로그인")) {
          router.push("/auth/login")
          return
        }
        toast.error(result.error || "문의에 실패했습니다")
        return
      }

      if ("needsNDA" in result && result.needsNDA) {
        setShowNDA(true)
        return
      }

      if ("roomId" in result && result.roomId) {
        router.push(`/rooms/${result.roomId}`)
      }
    })
  }

  if (isOwner) return null

  return (
    <>
      <div>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          onClick={handleClick}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <MessageSquare className="size-4" />
          )}
          {isPending ? "처리 중..." : "문의하기"}
        </button>
        {isPrivate && (
          <p className="mt-1.5 text-center text-[11px] text-amber-400/70">
            비공개 딜 — NDA 서명 후 협상룸이 개설됩니다
          </p>
        )}
      </div>

      <NDADialog
        dealId={dealId}
        dealTitle={dealTitle}
        dealCategory={dealCategory}
        open={showNDA}
        onOpenChange={setShowNDA}
      />
    </>
  )
}

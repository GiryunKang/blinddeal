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
}

export function InquiryButton({
  dealId,
  dealTitle,
  dealCategory,
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

  return (
    <>
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

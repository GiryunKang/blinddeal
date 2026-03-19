"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { startInquiry } from "@/lib/actions/inquiry"
import { NDADialog } from "./nda-dialog"

interface InquiryButtonProps {
  dealId: string
  dealTitle: string
  dealCategory: string
  isLoggedIn: boolean
}

export function InquiryButton({
  dealId,
  dealTitle,
  dealCategory,
  isLoggedIn,
}: InquiryButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [showNDA, setShowNDA] = useState(false)
  const router = useRouter()

  function handleClick() {
    if (!isLoggedIn) {
      router.push("/auth/login")
      return
    }

    startTransition(async () => {
      const result = await startInquiry(dealId)

      if (!result.success) {
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
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <MessageSquare className="mr-2 size-4" />
        )}
        {isPending ? "처리 중..." : "문의하기"}
      </Button>

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

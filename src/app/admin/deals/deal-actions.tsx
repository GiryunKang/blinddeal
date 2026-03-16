"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { approveDeal, rejectDeal } from "@/lib/actions/admin"
import { Check, X } from "lucide-react"

interface AdminDealActionsProps {
  dealId: string
}

export function AdminDealActions({ dealId }: AdminDealActionsProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleApprove() {
    startTransition(async () => {
      try {
        await approveDeal(dealId)
        router.refresh()
      } catch (error) {
        console.error("Failed to approve deal:", error)
      }
    })
  }

  function handleReject() {
    const reason = window.prompt("거절 사유를 입력해주세요:")
    if (!reason) return

    startTransition(async () => {
      try {
        await rejectDeal(dealId, reason)
        router.refresh()
      } catch (error) {
        console.error("Failed to reject deal:", error)
      }
    })
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        size="sm"
        onClick={handleApprove}
        disabled={isPending}
      >
        <Check className="mr-1 size-3.5" />
        승인
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={handleReject}
        disabled={isPending}
      >
        <X className="mr-1 size-3.5" />
        거절
      </Button>
    </div>
  )
}

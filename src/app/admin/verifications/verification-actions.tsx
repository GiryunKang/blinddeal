"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { approveVerification, rejectVerification } from "@/lib/actions/admin"
import { Check, X } from "lucide-react"

interface VerificationActionsProps {
  recordId: string
}

export function VerificationActions({ recordId }: VerificationActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const router = useRouter()

  function handleApprove() {
    startTransition(async () => {
      try {
        await approveVerification(recordId)
        toast.success("인증이 승인되었습니다. 사용자에게 알림이 발송됩니다.")
        router.refresh()
      } catch {
        toast.error("승인에 실패했습니다.")
      }
    })
  }

  function handleReject() {
    if (!showRejectInput) {
      setShowRejectInput(true)
      return
    }
    startTransition(async () => {
      try {
        await rejectVerification(recordId, rejectReason || undefined)
        toast("인증이 거절되었습니다.")
        setShowRejectInput(false)
        setRejectReason("")
        router.refresh()
      } catch {
        toast.error("거절에 실패했습니다.")
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          onClick={handleApprove}
          disabled={isPending}
          className="bg-emerald-600 hover:bg-emerald-700"
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
      {showRejectInput && (
        <input
          type="text"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="거절 사유 (선택)"
          className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
        />
      )}
    </div>
  )
}

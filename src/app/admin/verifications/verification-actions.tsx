"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { approveVerification } from "@/lib/actions/admin"
import { Check } from "lucide-react"

interface VerificationActionsProps {
  recordId: string
}

export function VerificationActions({ recordId }: VerificationActionsProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleApprove() {
    startTransition(async () => {
      try {
        await approveVerification(recordId)
        router.refresh()
      } catch (error) {
        console.error("Failed to approve verification:", error)
      }
    })
  }

  return (
    <div className="flex items-center justify-end">
      <Button
        size="sm"
        onClick={handleApprove}
        disabled={isPending}
      >
        <Check className="mr-1 size-3.5" />
        승인
      </Button>
    </div>
  )
}

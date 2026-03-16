"use client"

import { Heart } from "lucide-react"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { toggleDealInterest } from "@/lib/actions/deal-mutations"

interface InterestButtonProps {
  dealId: string
}

export function InterestButton({ dealId }: InterestButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      try {
        await toggleDealInterest(dealId)
      } catch {
        // Silently handle - user may not be logged in
      }
    })
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full"
      onClick={handleClick}
      disabled={isPending}
    >
      <Heart className="mr-2 size-4" />
      {isPending ? "처리 중..." : "관심 등록"}
    </Button>
  )
}

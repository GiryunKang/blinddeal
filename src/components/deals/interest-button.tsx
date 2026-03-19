"use client"

import { Heart } from "lucide-react"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toggleDealInterest } from "@/lib/actions/deal-mutations"
import { cn } from "@/lib/utils"

interface InterestButtonProps {
  dealId: string
  initialInterested?: boolean
  initialCount?: number
  isLoggedIn?: boolean
}

export function InterestButton({
  dealId,
  initialInterested = false,
  initialCount = 0,
  isLoggedIn = false,
}: InterestButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [interested, setInterested] = useState(initialInterested)
  const [count, setCount] = useState(initialCount)
  const [animate, setAnimate] = useState(false)
  const router = useRouter()

  function handleClick() {
    if (!isLoggedIn) {
      router.push("/auth/login")
      return
    }

    startTransition(async () => {
      const result = await toggleDealInterest(dealId)
      if (result.success) {
        setInterested(result.interested ?? false)
        setCount((prev) => (result.interested ? prev + 1 : prev - 1))

        // Trigger pulse animation
        setAnimate(true)
        setTimeout(() => setAnimate(false), 300)
      }
    })
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className={cn(
        "w-full transition-all",
        interested &&
          "border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600",
        animate && "scale-110"
      )}
      onClick={handleClick}
      disabled={isPending}
    >
      <Heart
        className={cn(
          "mr-2 size-4 transition-all",
          interested && "fill-red-500 text-red-500",
          animate && "scale-125"
        )}
      />
      {isPending
        ? "처리 중..."
        : interested
          ? `관심 등록됨 ${count}`
          : `관심 등록 ${count > 0 ? count : ""}`}
    </Button>
  )
}

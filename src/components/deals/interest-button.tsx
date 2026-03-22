"use client"

import { Heart } from "lucide-react"
import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toggleDealInterest } from "@/lib/actions/deal-mutations"
import { cn } from "@/lib/utils"
import { HeartBurst } from "@/components/effects/heart-burst"
import { createClient } from "@/lib/supabase/client"

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
}: InterestButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [interested, setInterested] = useState(initialInterested)
  const [count, setCount] = useState(initialCount)
  const [animate, setAnimate] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const [loggedIn, setLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      setLoggedIn(!!user)
    })
  }, [])

  function handleClick() {
    if (!loggedIn) {
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

        // Trigger burst on toggle ON
        if (result.interested) {
          setBurstKey((prev) => prev + 1)
        }
      }
    })
  }

  return (
    <div className="relative">
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
            animate && "animate-[heart-spring_0.4s_ease-out]"
          )}
        />
        {isPending
          ? "처리 중..."
          : interested
            ? `관심 등록됨 ${count}`
            : `관심 등록 ${count > 0 ? count : ""}`}
      </Button>
      <HeartBurst trigger={burstKey} />
      <style>{`
        @keyframes heart-spring {
          0% { transform: scale(1); }
          30% { transform: scale(1.3); }
          60% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

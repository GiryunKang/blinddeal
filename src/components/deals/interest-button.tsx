"use client"

import { Heart } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { toggleDealInterest } from "@/lib/actions/deal-mutations"
import { cn } from "@/lib/utils"
import { HeartBurst } from "@/components/effects/heart-burst"

interface InterestButtonProps {
  dealId: string
  initialInterested?: boolean
  initialCount?: number
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

  function handleClick() {
    startTransition(async () => {
      const result = await toggleDealInterest(dealId)
      if (result.success) {
        setInterested(result.interested ?? false)
        setCount((prev) => (result.interested ? prev + 1 : prev - 1))

        setAnimate(true)
        setTimeout(() => setAnimate(false), 300)

        if (result.interested) {
          setBurstKey((prev) => prev + 1)
          toast.success("관심 딜에 추가되었습니다.")
        } else {
          toast("관심 딜에서 제거되었습니다.")
        }
      } else {
        toast.error(result.error || "처리에 실패했습니다.")
      }
    })
  }

  return (
    <div className="relative">
      <button
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all disabled:opacity-50",
          interested
            ? "border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20"
            : "border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground",
          animate && "scale-110"
        )}
        onClick={handleClick}
        disabled={isPending}
      >
        <Heart
          className={cn(
            "size-4 transition-all",
            interested && "fill-red-500 text-red-500",
            animate && "animate-[heart-spring_0.4s_ease-out]"
          )}
        />
        {isPending
          ? "처리 중..."
          : interested
            ? `관심 등록됨 ${count}`
            : `관심 등록 ${count > 0 ? count : ""}`}
      </button>
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

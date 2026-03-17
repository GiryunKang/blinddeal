import Link from "next/link"
import { Lock } from "lucide-react"

interface BlindOverlayProps {
  message: string
  requiredLevel: number
}

export function BlindOverlay({ message, requiredLevel }: BlindOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl">
      {/* Frosted glass background */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/90 via-black/70 to-black/50 backdrop-blur-md" />

      {/* Subtle glow ring */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center gap-3 px-4 text-center">
        {/* Lock icon with glow */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-lg shadow-blue-500/10">
          <Lock className="h-6 w-6 text-white/80" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-white/90">{message}</p>
          <p className="text-xs text-white/50">
            인증 등급 {requiredLevel} 이상 필요
          </p>
        </div>

        <Link
          href="/profile/verification"
          className="mt-1 rounded-full border border-white/10 bg-white/5 px-5 py-1.5 text-xs font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          인증하기
        </Link>
      </div>
    </div>
  )
}

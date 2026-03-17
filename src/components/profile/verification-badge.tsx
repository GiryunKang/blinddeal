import { Shield, ShieldCheck, Building, Award, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

const levelConfig: Record<
  number,
  { label: string; color: string; icon: React.ElementType }
> = {
  0: {
    label: "미인증",
    color: "bg-zinc-500/20 text-zinc-400",
    icon: Shield,
  },
  1: {
    label: "본인인증",
    color: "bg-blue-500/20 text-blue-400",
    icon: ShieldCheck,
  },
  2: {
    label: "사업자",
    color: "bg-indigo-500/20 text-indigo-400",
    icon: Building,
  },
  3: {
    label: "검증완료",
    color: "bg-purple-500/20 text-purple-400",
    icon: Award,
  },
  4: {
    label: "프리미엄",
    color: "bg-amber-500/20 text-amber-400",
    icon: Crown,
  },
}

interface VerificationBadgeProps {
  level: number
  className?: string
}

export function VerificationBadge({ level, className }: VerificationBadgeProps) {
  const config = levelConfig[level] ?? levelConfig[0]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        config.color,
        className
      )}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  )
}

export { levelConfig }

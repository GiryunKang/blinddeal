import { cn } from "@/lib/utils"

interface MatchScoreBadgeProps {
  score: number
  size?: "sm" | "md"
  className?: string
}

function getScoreConfig(score: number) {
  if (score >= 80) return { label: "최적", color: "text-emerald-400", trackColor: "stroke-emerald-400", bgColor: "bg-emerald-500/10" }
  if (score >= 60) return { label: "적합", color: "text-blue-400", trackColor: "stroke-blue-400", bgColor: "bg-blue-500/10" }
  if (score >= 40) return { label: "보통", color: "text-amber-400", trackColor: "stroke-amber-400", bgColor: "bg-amber-500/10" }
  return { label: "낮음", color: "text-gray-400", trackColor: "stroke-gray-400", bgColor: "bg-gray-500/10" }
}

export function MatchScoreBadge({ score, size = "sm", className }: MatchScoreBadgeProps) {
  const config = getScoreConfig(score)
  const isSmall = size === "sm"
  const circleSize = isSmall ? 40 : 64
  const strokeWidth = isSmall ? 3 : 4
  const radius = (circleSize - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: circleSize, height: circleSize }}>
        <svg
          width={circleSize}
          height={circleSize}
          className="-rotate-90"
        >
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={config.trackColor}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "font-bold",
            config.color,
            isSmall ? "text-xs" : "text-base"
          )}>
            {score}
          </span>
        </div>
      </div>
      {!isSmall && (
        <span className={cn("text-xs font-medium", config.color)}>
          {config.label}
        </span>
      )}
    </div>
  )
}

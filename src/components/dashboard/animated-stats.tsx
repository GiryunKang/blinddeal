"use client"

import { CountUp } from "@/components/effects/count-up"

interface AnimatedStatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  gradientFrom: string
  gradientTo: string
  trend: "up" | "down" | "neutral"
  trendLabel: string
}

export function AnimatedStatCard({
  label,
  value,
  icon,
  gradientFrom,
  gradientTo,
  trend,
  trendLabel,
}: AnimatedStatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.05] hover:shadow-xl">
      {/* Gradient left accent with breathe animation */}
      <div
        className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${gradientFrom} ${gradientTo}`}
        style={{ animation: "breathe 3s ease-in-out infinite" }}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            <CountUp target={value} duration={1200} />
          </p>
          {/* Trend indicator */}
          {trendLabel && (
            <div className="flex items-center gap-1">
              {trend === "up" && (
                <svg className="h-3 w-3 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              )}
              {trend === "down" && (
                <svg className="h-3 w-3 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
              )}
              {trend === "neutral" && (
                <svg className="h-3 w-3 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              )}
              <span
                className={`text-[10px] font-medium ${
                  trend === "up"
                    ? "text-emerald-400"
                    : trend === "down"
                      ? "text-red-400"
                      : "text-muted-foreground"
                }`}
              >
                {trendLabel}
              </span>
            </div>
          )}
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>

      {/* Hover shine effect */}
      <div className="absolute inset-0 -translate-x-full transition-transform duration-700 group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />

      {/* Breathe keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes breathe {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      ` }} />
    </div>
  )
}

export function AnimatedStatsGrid({
  stats,
}: {
  stats: {
    label: string
    value: number
    icon: React.ReactNode
    gradientFrom: string
    gradientTo: string
    trend: "up" | "down" | "neutral"
    trendLabel: string
  }[]
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <AnimatedStatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}

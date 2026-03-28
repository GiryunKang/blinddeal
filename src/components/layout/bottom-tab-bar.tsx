"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, MessageSquare, User, LayoutDashboard } from "lucide-react"

import { cn } from "@/lib/utils"

interface TabItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  matchPaths?: string[]
}

const tabs: TabItem[] = [
  { href: "/", label: "홈", icon: Home, matchPaths: ["/"] },
  { href: "/deals", label: "마켓", icon: Search, matchPaths: ["/deals"] },
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard, matchPaths: ["/dashboard"] },
  { href: "/rooms", label: "채팅", icon: MessageSquare, matchPaths: ["/rooms"] },
  { href: "/profile", label: "프로필", icon: User, matchPaths: ["/profile"] },
]

export function BottomTabBar() {
  const pathname = usePathname()

  const isActive = (tab: TabItem) => {
    if (tab.href === "/" && pathname === "/") return true
    if (tab.href !== "/" && pathname.startsWith(tab.href)) return true
    return false
  }

  const isAuthPage = pathname.startsWith("/auth")
  if (isAuthPage) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-background/90 backdrop-blur-xl md:hidden safe-area-bottom" aria-label="하단 네비게이션" role="navigation">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const active = isActive(tab)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-h-[52px] min-w-[52px] rounded-xl px-3 py-1.5 transition-colors duration-200",
                active
                  ? "text-blue-400"
                  : "text-muted-foreground/60"
              )}
            >
              <tab.icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]")} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

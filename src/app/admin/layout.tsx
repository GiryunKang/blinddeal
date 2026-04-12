import { redirect } from "next/navigation"
import Link from "next/link"
import { requireAuth } from "@/lib/supabase/auth"
import {
  LayoutDashboard,
  FileText,
  Users,
  ShieldCheck,
  BookOpen,
  Briefcase,
  Megaphone,
  BarChart3,
} from "lucide-react"

const sidebarNavItems = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/deals", label: "딜 관리", icon: FileText },
  { href: "/admin/users", label: "사용자 관리", icon: Users },
  { href: "/admin/verifications", label: "인증 관리", icon: ShieldCheck },
  { href: "/admin/content", label: "콘텐츠", icon: BookOpen },
  { href: "/admin/experts", label: "전문가", icon: Briefcase },
  { href: "/admin/ads", label: "광고", icon: Megaphone },
  { href: "/admin/stats", label: "통계", icon: BarChart3 },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  const adminIds = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)

  if (!adminIds.includes(user.id)) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-border/50 bg-card lg:block">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-border/50 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <span className="text-sm font-bold text-white">B</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            관리자
          </span>
        </div>

        {/* Nav */}
        <nav className="space-y-0.5 p-3">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:pl-60">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}

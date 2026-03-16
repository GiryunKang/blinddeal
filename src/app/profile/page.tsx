import { redirect } from "next/navigation"
import Link from "next/link"
import {
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Calendar,
  Settings,
  Bell,
  Target,
} from "lucide-react"
import { getProfile, requireAuth } from "@/lib/supabase/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"

const tierLabels: Record<string, string> = {
  free: "무료",
  basic: "베이직",
  premium: "프리미엄",
  enterprise: "엔터프라이즈",
}

const tierColors: Record<string, string> = {
  free: "bg-zinc-500/20 text-zinc-400",
  basic: "bg-blue-500/20 text-blue-400",
  premium: "bg-amber-500/20 text-amber-400",
  enterprise: "bg-purple-500/20 text-purple-400",
}

export default async function ProfilePage() {
  await requireAuth()
  const profile = await getProfile()

  if (!profile) {
    redirect("/auth/login")
  }

  const displayName = profile.display_name || profile.email?.split("@")[0] || "사용자"
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">
        프로필
      </h1>

      {/* Profile card */}
      <Card className="mb-6 border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar size="lg">
              <AvatarImage
                src={profile.avatar_url ?? undefined}
                alt={displayName}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {displayName}
                </h2>
                <Badge
                  className={
                    tierColors[profile.membership_tier] ??
                    tierColors.free
                  }
                >
                  {tierLabels[profile.membership_tier] ?? "무료"}
                </Badge>
                {profile.is_verified && (
                  <Badge className="bg-emerald-500/20 text-emerald-400">
                    인증됨
                  </Badge>
                )}
              </div>

              {profile.bio && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {profile.bio}
                </p>
              )}

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="size-4" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.company_name && (
                  <div className="flex items-center gap-2">
                    <Building className="size-4" />
                    <span>{profile.company_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span>가입일: {formatDate(profile.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/profile/matches" className="group block">
          <Card className="border-border/50 transition-all hover:border-border">
            <CardContent className="flex items-center gap-3 pt-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Target className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                  매칭 설정
                </h3>
                <p className="text-xs text-muted-foreground">
                  관심 딜 조건 및 알림 설정
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/profile/notifications" className="group block">
          <Card className="border-border/50 transition-all hover:border-border">
            <CardContent className="flex items-center gap-3 pt-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                  알림
                </h3>
                <p className="text-xs text-muted-foreground">
                  알림 목록 확인
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Bell,
  MessageCircle,
  Heart,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/actions/matching"

interface NotificationItem {
  id: string
  user_id: string
  type: "deal" | "message" | "comment" | "system" | "like"
  title: string
  body: string
  link: string | null
  is_read: boolean
  created_at: string
}

interface NotificationListProps {
  notifications: NotificationItem[]
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  deal: TrendingUp,
  message: MessageCircle,
  comment: MessageCircle,
  system: AlertCircle,
  like: Heart,
}

const typeColors: Record<string, string> = {
  deal: "bg-blue-500/20 text-blue-400",
  message: "bg-emerald-500/20 text-emerald-400",
  comment: "bg-purple-500/20 text-purple-400",
  system: "bg-amber-500/20 text-amber-400",
  like: "bg-rose-500/20 text-rose-400",
}

export function NotificationList({
  notifications,
}: NotificationListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const unreadCount = notifications.filter((n) => !n.is_read).length

  function handleMarkRead(id: string) {
    startTransition(async () => {
      await markNotificationRead(id)
      router.refresh()
    })
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsRead()
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">알림</h2>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0
              ? `읽지 않은 알림 ${unreadCount}개`
              : "모든 알림을 확인했습니다"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={isPending}
          >
            모두 읽음
          </Button>
        )}
      </div>

      {/* Notification items */}
      <div className="space-y-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const Icon = typeIcons[notification.type] ?? Bell
            const colorClass =
              typeColors[notification.type] ?? "bg-zinc-500/20 text-zinc-400"

            const content = (
              <div
                className={`flex gap-3 rounded-lg border p-4 transition-colors ${
                  notification.is_read
                    ? "border-border/30 bg-card/50"
                    : "border-border/50 bg-card"
                }`}
              >
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-md ${colorClass}`}
                >
                  <Icon className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={`text-sm font-medium ${
                        notification.is_read
                          ? "text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {notification.title}
                    </h4>
                    {!notification.is_read && (
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p
                    className={`mt-0.5 text-sm ${
                      notification.is_read
                        ? "text-muted-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {notification.body}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/60">
                    {formatDate(
                      notification.created_at,
                      "yyyy.MM.dd HH:mm"
                    )}
                  </p>
                </div>

                {!notification.is_read && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleMarkRead(notification.id)
                    }}
                    className="self-start text-xs text-muted-foreground hover:text-foreground"
                  >
                    읽음
                  </button>
                )}
              </div>
            )

            if (notification.link) {
              return (
                <Link
                  key={notification.id}
                  href={notification.link}
                  className="block"
                  onClick={() => {
                    if (!notification.is_read) {
                      handleMarkRead(notification.id)
                    }
                  }}
                >
                  {content}
                </Link>
              )
            }

            return <div key={notification.id}>{content}</div>
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4">
              <Bell className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-base font-medium text-foreground">
              새로운 알림이 없습니다
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              새로운 소식이 있으면 여기에 표시됩니다
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

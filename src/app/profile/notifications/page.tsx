import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireAuth } from "@/lib/supabase/auth"
import { getNotifications } from "@/lib/actions/matching"
import { NotificationList } from "@/components/notifications/notification-list"

interface NotificationsPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  await requireAuth()
  const sp = await searchParams
  const currentPage = sp.page ? parseInt(sp.page, 10) : 1

  const { notifications, count } = await getNotifications(currentPage)
  const totalPages = Math.ceil(count / 20)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        href="/profile"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        프로필
      </Link>

      <NotificationList notifications={notifications} totalCount={count} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/profile/notifications?page=${currentPage - 1}`}
              className="rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              이전
            </Link>
          )}
          <span className="text-sm text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/profile/notifications?page=${currentPage + 1}`}
              className="rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              다음
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

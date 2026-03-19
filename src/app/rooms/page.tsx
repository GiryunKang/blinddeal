import type { Metadata } from "next"
import Link from "next/link"
import { MessageSquare, Clock, ArrowRight } from "lucide-react"
import { requireAuth } from "@/lib/supabase/auth"
import { getRooms } from "@/lib/actions/rooms"
import { MainLayout } from "@/components/layout/main-layout"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { formatDate, formatKRW } from "@/lib/utils"

export const metadata: Metadata = { title: "거래 채팅" }

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "대기 중",
    className: "bg-amber-500/20 text-amber-400",
  },
  active: {
    label: "진행 중",
    className: "bg-emerald-500/20 text-emerald-400",
  },
  completed: {
    label: "완료",
    className: "bg-blue-500/20 text-blue-400",
  },
  cancelled: {
    label: "취소",
    className: "bg-red-500/20 text-red-400",
  },
}

export default async function RoomsPage() {
  const user = await requireAuth()
  const roomsResult = await getRooms()
  const rooms = roomsResult.data ?? []

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          딜 대화방
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          총 {rooms.length}개의 대화방이 있습니다
        </p>
      </div>

      {rooms.length > 0 ? (
        <div className="space-y-3">
          {rooms.map((room) => {
            const counterparty =
              room.buyer_id === user.id ? room.seller : room.buyer
            const status = statusConfig[room.status] ?? statusConfig.pending
            const displayName =
              counterparty?.company_name || counterparty?.display_name || "알 수 없음"
            const initials = displayName.slice(0, 2).toUpperCase()

            return (
              <Link key={room.id} href={`/rooms/${room.id}`}>
                <Card className="cursor-pointer border-border/50 p-4 transition-colors hover:bg-muted/30">
                  <div className="flex items-start gap-4">
                    <Avatar size="lg">
                      <AvatarImage
                        src={counterparty?.avatar_url ?? undefined}
                        alt={displayName}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-medium text-foreground">
                            {room.deal?.title ?? "삭제된 딜"}
                          </h3>
                          <Badge className={status.className}>
                            {status.label}
                          </Badge>
                        </div>
                        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          {formatDate(
                            room.last_message?.created_at ?? room.updated_at,
                            "MM.dd HH:mm"
                          )}
                        </span>
                      </div>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {displayName}
                        {room.deal?.asking_price
                          ? ` · ${formatKRW(room.deal.asking_price)}`
                          : ""}
                      </p>

                      {room.last_message && (
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {room.last_message.sender_id === user.id
                            ? "나: "
                            : ""}
                          {room.last_message.content}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="rounded-full bg-muted p-4">
            <MessageSquare className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            아직 진행 중인 거래가 없습니다
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            딜 마켓플레이스에서 관심 있는 딜에 문의해보세요
          </p>
          <Link href="/deals" className="mt-4">
            <Button size="sm" className="gap-1.5">
              딜 둘러보기
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      )}
    </MainLayout>
  )
}

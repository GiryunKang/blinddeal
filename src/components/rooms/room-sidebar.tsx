"use client"

import { useState, useTransition, useEffect } from "react"
import Link from "next/link"
import { Building, FileText, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatKRW } from "@/lib/utils"
import { updateRoomStatus } from "@/lib/actions/rooms"
import { LOIForm } from "./loi-form"
import { LOICard } from "./loi-card"

interface RoomSidebarProps {
  room: {
    id: string
    status: string
    buyer_id: string
    seller_id: string
    deal: {
      id: string
      title: string
      deal_category: string
      asking_price: number | null
      status: string
      slug: string
      description: string
    } | null
    buyer: {
      id: string
      display_name: string
      avatar_url: string | null
      company_name: string | null
    } | null
    seller: {
      id: string
      display_name: string
      avatar_url: string | null
      company_name: string | null
    } | null
  }
  currentUserId: string
  lois: Array<{
    id: string
    room_id: string
    deal_id: string
    proposer_id: string
    proposed_price: number
    terms: string
    conditions: string
    valid_until: string
    status: string
    response_notes?: string | null
    responded_at?: string | null
    created_at: string
    proposer: {
      id: string
      display_name: string
      avatar_url: string | null
    } | null
  }>
  ddData?: {
    id: string
    status: string
    checklist: Array<{
      id: string
      category: string
      item_name: string
      status: string
    }>
  } | null
  escrowData?: {
    id: string
    total_amount: number
    status: string
    funded_at: string | null
    released_at: string | null
  } | null
}

const statusConfig: Record<string, { label: string; className: string }> = {
  inquiry: { label: "문의", className: "bg-amber-500/20 text-amber-400" },
  negotiating: { label: "협상 중", className: "bg-emerald-500/20 text-emerald-400" },
  loi_exchanged: { label: "LOI 교환", className: "bg-cyan-500/20 text-cyan-400" },
  due_diligence: { label: "실사 중", className: "bg-indigo-500/20 text-indigo-400" },
  contract_review: { label: "계약 검토", className: "bg-violet-500/20 text-violet-400" },
  escrow: { label: "에스크로", className: "bg-yellow-500/20 text-yellow-400" },
  completed: { label: "완료", className: "bg-blue-500/20 text-blue-400" },
  cancelled: { label: "취소", className: "bg-red-500/20 text-red-400" },
}

const categoryLabels: Record<string, string> = {
  real_estate: "부동산",
  ma: "M&A",
  investment: "투자",
  startup: "스타트업",
  other: "기타",
}

export function RoomSidebar({ room, currentUserId, lois, ddData, escrowData }: RoomSidebarProps) {
  const [mounted, setMounted] = useState(false)
  const [loiDialogOpen, setLoiDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => setMounted(true), [])

  const counterparty =
    room.buyer_id === currentUserId ? room.seller : room.buyer
  const counterpartyName =
    counterparty?.company_name || counterparty?.display_name || "알 수 없음"
  const counterpartyInitials = counterpartyName.slice(0, 2).toUpperCase()

  const status = statusConfig[room.status] ?? statusConfig.inquiry

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-36 animate-pulse rounded-lg bg-muted" />
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  function handleStatusChange(newStatus: "inquiry" | "negotiating" | "loi_exchanged" | "due_diligence" | "contract_review" | "escrow" | "completed" | "cancelled") {
    startTransition(async () => {
      const result = await updateRoomStatus(room.id, newStatus)
      if (!result.success) {
        // Status change failed silently on server
      }
    })
  }

  return (
    <div className="space-y-4 overflow-y-auto">
      {/* Deal Summary */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Building className="size-4 text-muted-foreground" />
            딜 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {room.deal?.title ?? "삭제된 딜"}
            </h3>
            {room.deal?.deal_category && (
              <Badge className="mt-1" variant="secondary">
                {categoryLabels[room.deal.deal_category] ??
                  room.deal.deal_category}
              </Badge>
            )}
          </div>

          {room.deal?.asking_price && (
            <div>
              <p className="text-xs text-muted-foreground">매각 희망가</p>
              <p className="text-sm font-semibold text-primary">
                {formatKRW(room.deal.asking_price)}
              </p>
            </div>
          )}

          {room.deal?.slug && (
            <Link
              href={`/deals/${room.deal.slug}`}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="size-3" />
              딜 상세보기
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Room Status */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">대화방 상태</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Badge className={status.className}>{status.label}</Badge>

          {/* Action buttons based on status */}
          <div className="space-y-2">
            {room.status === "inquiry" && (
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleStatusChange("negotiating")}
                disabled={isPending}
              >
                협상 시작
              </Button>
            )}

            {room.status === "negotiating" && (
              <>
                <Dialog open={loiDialogOpen} onOpenChange={setLoiDialogOpen}>
                  <DialogTrigger
                    render={
                      <Button size="sm" className="w-full">
                        <FileText className="mr-2 size-4" />
                        인수의향서(LOI) 제출
                      </Button>
                    }
                  />
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>인수의향서(LOI) 제출</DialogTitle>
                    </DialogHeader>
                    <LOIForm
                      roomId={room.id}
                      askingPrice={room.deal?.asking_price ?? undefined}
                      onSuccess={() => setLoiDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleStatusChange("completed")}
                  disabled={isPending}
                >
                  거래 완료
                </Button>
              </>
            )}

            {(room.status === "inquiry" || room.status === "negotiating") && (
              <Button
                size="sm"
                variant="destructive"
                className="w-full"
                onClick={() => handleStatusChange("cancelled")}
                disabled={isPending}
              >
                대화 취소
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Counterparty Info */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">상대방 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={counterparty?.avatar_url ?? undefined}
                alt={counterpartyName}
              />
              <AvatarFallback>{counterpartyInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">
                {counterpartyName}
              </p>
              <p className="text-xs text-muted-foreground">
                {room.buyer_id === currentUserId ? "판매자" : "구매자"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LOIs */}
      {lois.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">인수의향서(LOI) 내역</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lois.map((loi) => (
              <div key={loi.id}>
                <LOICard loi={loi} currentUserId={currentUserId} />
                <Separator className="mt-3 last:hidden" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* DD (Due Diligence) Panel */}
      {ddData && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">실사(정밀조사) 진행 현황</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(() => {
              const total = ddData.checklist.length
              const completed = ddData.checklist.filter(i => i.status === "completed").length
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0
              return (
                <>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{completed}/{total} 항목 완료</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {ddData.checklist.map(item => {
                      const dotColor = item.status === "completed" ? "bg-emerald-500" : item.status === "in_progress" ? "bg-blue-500" : item.status === "issue_found" ? "bg-red-500" : "bg-muted-foreground/30"
                      return (
                        <div key={item.id} className="flex items-center gap-2 text-xs">
                          <span className={`h-2 w-2 rounded-full ${dotColor} shrink-0`} />
                          <span className="text-muted-foreground">{item.item_name}</span>
                        </div>
                      )
                    })}
                  </div>
                </>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Escrow Panel */}
      {escrowData && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">에스크로 파트너 진행 현황</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-lg font-bold">{formatKRW(escrowData.total_amount)}</div>
            <Badge variant="secondary" className={
              escrowData.status === "funded" ? "bg-blue-500/20 text-blue-400" :
              escrowData.status === "released" ? "bg-emerald-500/20 text-emerald-400" :
              escrowData.status === "disputed" || escrowData.status === "refunded" ? "bg-red-500/20 text-red-400" :
              "bg-muted text-muted-foreground"
            }>
              {escrowData.status === "created" ? "생성됨" :
               escrowData.status === "funded" ? "입금 완료" :
               escrowData.status === "releasing" ? "방출 중" :
               escrowData.status === "released" ? "방출 완료" :
               escrowData.status === "refunded" ? "환불됨" :
               escrowData.status === "disputed" ? "분쟁 중" :
               escrowData.status}
            </Badge>
            <p className="text-xs text-muted-foreground">
              에스크로 파트너를 통해 안전하게 거래가 진행됩니다.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

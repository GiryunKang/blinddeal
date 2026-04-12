"use client"

import { useTransition } from "react"
import { Check, X, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatKRW, formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { respondToLOI } from "@/lib/actions/loi"

interface LOICardProps {
  loi: {
    id: string
    sender_id: string
    proposed_price: number
    proposed_terms: string
    conditions: string[] | null
    valid_until: string
    status: string
    response_notes?: string | null
    responded_at?: string | null
    created_at: string
    sender: {
      id: string
      display_name: string
      avatar_url: string | null
    } | null
  }
  currentUserId: string
}

const loiStatusConfig: Record<string, { label: string; className: string }> = {
  sent: { label: "검토 중", className: "bg-amber-500/20 text-amber-400" },
  accepted: { label: "수락", className: "bg-emerald-500/20 text-emerald-400" },
  rejected: { label: "거절", className: "bg-red-500/20 text-red-400" },
  countered: { label: "역제안", className: "bg-blue-500/20 text-blue-400" },
  expired: { label: "만료", className: "bg-gray-500/20 text-gray-400" },
}

export function LOICard({ loi, currentUserId }: LOICardProps) {
  const [isPending, startTransition] = useTransition()

  const status = loiStatusConfig[loi.status] ?? loiStatusConfig.sent
  const isSender = loi.sender_id === currentUserId
  const canRespond = !isSender && loi.status === "sent"
  const isExpired = new Date(loi.valid_until) < new Date()

  function handleRespond(responseStatus: "accepted" | "rejected" | "countered") {
    startTransition(async () => {
      const result = await respondToLOI(loi.id, responseStatus)
      if (!result.success) {
        toast.error(result.error ?? "처리에 실패했습니다.")
      }
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {loi.sender?.display_name ?? "알 수 없음"} 제출
        </span>
        <Badge className={status.className}>{status.label}</Badge>
      </div>

      <div className="rounded-lg bg-muted/50 p-3 space-y-2">
        <div>
          <p className="text-xs text-muted-foreground">제안 금액</p>
          <p className="text-sm font-semibold text-primary">
            {formatKRW(loi.proposed_price)}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">거래 조건</p>
          <p className="text-xs text-foreground">{loi.proposed_terms}</p>
        </div>

        {loi.conditions && loi.conditions.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground">특약 사항</p>
            <ul className="space-y-0.5">
              {loi.conditions.map((cond, i) => (
                <li key={i} className="text-xs text-foreground">• {cond}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>유효 기한: {formatDate(loi.valid_until, "yyyy.MM.dd")}</span>
          {isExpired && loi.status === "sent" && (
            <Badge className="bg-red-500/20 text-red-400">만료</Badge>
          )}
        </div>

        {loi.response_notes && (
          <div>
            <p className="text-xs text-muted-foreground">응답 메모</p>
            <p className="text-xs text-foreground">{loi.response_notes}</p>
          </div>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground">
        {formatDate(loi.created_at, "yyyy.MM.dd HH:mm")}
      </p>

      {canRespond && !isExpired && (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleRespond("accepted")}
            disabled={isPending}
          >
            <Check className="mr-1 size-3" />
            수락
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1"
            onClick={() => handleRespond("rejected")}
            disabled={isPending}
          >
            <X className="mr-1 size-3" />
            거절
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => handleRespond("countered")}
            disabled={isPending}
          >
            <RotateCcw className="mr-1 size-3" />
            역제안
          </Button>
        </div>
      )}
    </div>
  )
}

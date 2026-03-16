"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatKRW } from "@/lib/utils"
import { updateEscrowStatus } from "@/lib/actions/escrow"
import { ShieldCheck, Banknote, AlertTriangle } from "lucide-react"

type EscrowStatus = "pending" | "funded" | "released" | "disputed" | "refunded"

const statusConfig: Record<
  EscrowStatus,
  { label: string; color: string }
> = {
  pending: { label: "대기중", color: "bg-gray-500/20 text-gray-400" },
  funded: { label: "입금 완료", color: "bg-blue-500/20 text-blue-400" },
  released: { label: "출금 완료", color: "bg-green-500/20 text-green-400" },
  disputed: { label: "분쟁중", color: "bg-red-500/20 text-red-400" },
  refunded: { label: "환불 완료", color: "bg-amber-500/20 text-amber-400" },
}

interface EscrowPanelProps {
  escrow: {
    id: string
    amount: number
    currency: string
    status: EscrowStatus
    funded_at?: string | null
    released_at?: string | null
  }
}

export function EscrowPanel({ escrow }: EscrowPanelProps) {
  const [isPending, startTransition] = useTransition()
  const config = statusConfig[escrow.status]

  function handleStatusChange(newStatus: EscrowStatus) {
    startTransition(async () => {
      try {
        await updateEscrowStatus(escrow.id, newStatus)
      } catch (error) {
        console.error("Failed to update escrow status:", error)
      }
    })
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/50 bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-foreground">에스크로</h3>
        </div>
        <Badge className={config.color}>{config.label}</Badge>
      </div>

      {/* Amount */}
      <div className="rounded-lg bg-muted/30 p-4 text-center">
        <p className="text-xs text-muted-foreground">거래 금액</p>
        <p className="mt-1 text-2xl font-bold text-foreground">
          {formatKRW(escrow.amount)}
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${
              escrow.funded_at ? "bg-green-400" : "bg-gray-500"
            }`}
          />
          <span className="text-muted-foreground">
            입금{" "}
            {escrow.funded_at
              ? new Date(escrow.funded_at).toLocaleDateString("ko-KR")
              : "대기중"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${
              escrow.released_at ? "bg-green-400" : "bg-gray-500"
            }`}
          />
          <span className="text-muted-foreground">
            출금{" "}
            {escrow.released_at
              ? new Date(escrow.released_at).toLocaleDateString("ko-KR")
              : "대기중"}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        {escrow.status === "pending" && (
          <Button
            className="flex-1"
            onClick={() => handleStatusChange("funded")}
            disabled={isPending}
          >
            <Banknote className="mr-1.5 size-4" />
            입금 확인
          </Button>
        )}
        {escrow.status === "funded" && (
          <>
            <Button
              className="flex-1"
              onClick={() => handleStatusChange("released")}
              disabled={isPending}
            >
              <ShieldCheck className="mr-1.5 size-4" />
              출금 실행
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleStatusChange("disputed")}
              disabled={isPending}
            >
              <AlertTriangle className="mr-1.5 size-4" />
              분쟁
            </Button>
          </>
        )}
        {escrow.status === "disputed" && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleStatusChange("refunded")}
            disabled={isPending}
          >
            환불 처리
          </Button>
        )}
      </div>
    </div>
  )
}

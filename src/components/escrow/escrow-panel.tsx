"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

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
  const [confirmAction, setConfirmAction] = useState<EscrowStatus | null>(null)
  const config = statusConfig[escrow.status]

  function handleConfirmedAction() {
    if (!confirmAction) return
    startTransition(async () => {
      try {
        await updateEscrowStatus(escrow.id, confirmAction)
        const labels: Record<string, string> = {
          funded: "입금이 확인되었습니다.",
          released: "출금이 실행되었습니다.",
          disputed: "분쟁이 접수되었습니다.",
          refunded: "환불이 처리되었습니다.",
        }
        toast.success(labels[confirmAction] ?? "처리 완료")
      } catch {
        toast.error("처리에 실패했습니다. 다시 시도해주세요.")
      } finally {
        setConfirmAction(null)
      }
    })
  }

  const confirmMessages: Record<string, { title: string; desc: string; danger: boolean }> = {
    released: {
      title: `${formatKRW(escrow.amount)}을 매도자에게 출금합니다`,
      desc: "출금 후에는 취소할 수 없습니다. 거래 조건을 최종 확인했는지 다시 한번 점검해주세요.",
      danger: false,
    },
    disputed: {
      title: "분쟁을 접수합니다",
      desc: "분쟁 접수 시 에스크로 자금이 동결되며, 양측 합의 또는 중재 절차가 진행됩니다.",
      danger: true,
    },
    refunded: {
      title: `${formatKRW(escrow.amount)}을 매수자에게 환불합니다`,
      desc: "환불 후에는 취소할 수 없습니다.",
      danger: true,
    },
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/50 bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-foreground">에스크로(안심결제)</h3>
        </div>
        <Badge className={config.color}>{config.label}</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        거래 대금을 플랫폼이 안전하게 보관 후, 거래 완료 시 매도자에게 전달합니다.
      </p>

      <div className="rounded-lg bg-muted/30 p-4 text-center">
        <p className="text-xs text-muted-foreground">거래 금액</p>
        <p className="mt-1 text-2xl font-bold text-foreground">
          {formatKRW(escrow.amount)}
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${escrow.funded_at ? "bg-green-400" : "bg-gray-500"}`} />
          <span className="text-muted-foreground">
            입금 {escrow.funded_at ? new Date(escrow.funded_at).toLocaleDateString("ko-KR") : "대기중"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${escrow.released_at ? "bg-green-400" : "bg-gray-500"}`} />
          <span className="text-muted-foreground">
            출금 {escrow.released_at ? new Date(escrow.released_at).toLocaleDateString("ko-KR") : "대기중"}
          </span>
        </div>
      </div>

      {/* Confirmation overlay */}
      {confirmAction && confirmMessages[confirmAction] && (
        <div className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">
            {confirmMessages[confirmAction].title}
          </p>
          <p className="text-xs text-muted-foreground">
            {confirmMessages[confirmAction].desc}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={confirmMessages[confirmAction].danger ? "destructive" : "default"}
              onClick={handleConfirmedAction}
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? "처리 중..." : "확인, 실행합니다"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmAction(null)}
              disabled={isPending}
            >
              취소
            </Button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!confirmAction && (
        <div className="flex gap-2 pt-2">
          {escrow.status === "pending" && (
            <Button
              className="flex-1"
              onClick={() => setConfirmAction("funded")}
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
                onClick={() => setConfirmAction("released")}
                disabled={isPending}
              >
                <ShieldCheck className="mr-1.5 size-4" />
                출금 실행
              </Button>
              <Button
                variant="destructive"
                onClick={() => setConfirmAction("disputed")}
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
              onClick={() => setConfirmAction("refunded")}
              disabled={isPending}
            >
              환불 처리
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

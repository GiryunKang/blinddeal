"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatKRW } from "@/lib/utils"
import { updateEscrowStatus } from "@/lib/actions/escrow"
import { ShieldCheck, Banknote, AlertTriangle } from "lucide-react"

type EscrowStatus = "created" | "funded" | "in_review" | "releasing" | "released" | "refunded" | "disputed"

const statusConfig: Record<
  EscrowStatus,
  { label: string; color: string }
> = {
  created: { label: "생성됨", color: "bg-gray-500/20 text-gray-400" },
  funded: { label: "파트너 입금 확인", color: "bg-blue-500/20 text-blue-400" },
  in_review: { label: "검토 중", color: "bg-indigo-500/20 text-indigo-400" },
  releasing: { label: "정산 진행 중", color: "bg-cyan-500/20 text-cyan-400" },
  released: { label: "파트너 정산 완료", color: "bg-green-500/20 text-green-400" },
  disputed: { label: "분쟁 접수", color: "bg-red-500/20 text-red-400" },
  refunded: { label: "파트너 환불 완료", color: "bg-amber-500/20 text-amber-400" },
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
          funded: "에스크로 파트너 입금이 확인되었습니다.",
          released: "에스크로 파트너 정산이 확인되었습니다.",
          disputed: "에스크로 파트너에 분쟁이 접수되었습니다.",
          refunded: "에스크로 파트너 환불이 확인되었습니다.",
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
      title: "파트너로부터 정산 완료 통보를 받았음을 기록합니다",
      desc: "에스크로 파트너가 매도자에게 대금을 정산한 것을 확인합니다. 확인 후에는 취소할 수 없습니다.",
      danger: false,
    },
    disputed: {
      title: "에스크로 파트너에 분쟁을 접수합니다",
      desc: "분쟁 접수 사실이 에스크로 파트너에게 통보됩니다. 이후 절차는 파트너의 약관에 따릅니다.",
      danger: true,
    },
    refunded: {
      title: "에스크로 파트너의 환불 완료를 확인합니다",
      desc: "에스크로 파트너가 매수자에게 환불한 것을 확인합니다. 확인 후에는 취소할 수 없습니다.",
      danger: true,
    },
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/50 bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-foreground">에스크로 파트너 진행 현황</h3>
        </div>
        <Badge className={config.color}>{config.label}</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        에스크로 파트너를 통해 안전하게 거래가 진행됩니다.
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
            파트너 입금 {escrow.funded_at ? new Date(escrow.funded_at).toLocaleDateString("ko-KR") : "대기중"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${escrow.released_at ? "bg-green-400" : "bg-gray-500"}`} />
          <span className="text-muted-foreground">
            파트너 정산 {escrow.released_at ? new Date(escrow.released_at).toLocaleDateString("ko-KR") : "대기중"}
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
              {isPending ? "처리 중..." : "확인합니다"}
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
          {escrow.status === "created" && (
            <Button
              className="flex-1"
              onClick={() => setConfirmAction("funded")}
              disabled={isPending}
            >
              <Banknote className="mr-1.5 size-4" />
              파트너 입금 확인
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
                파트너 정산 확인
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
              파트너 환불 확인
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

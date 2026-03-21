"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Shield, FileText, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { signNDA } from "@/lib/actions/nda"

interface NDADialogProps {
  dealId: string
  dealTitle: string
  dealCategory: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NDADialog({
  dealId,
  dealTitle,
  dealCategory,
  open,
  onOpenChange,
}: NDADialogProps) {
  const [agreed, setAgreed] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const categoryLabel = dealCategory === "real_estate" ? "부동산" : "M&A"
  const now = new Date()
  const timestamp = now.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  function handleSign() {
    startTransition(async () => {
      const result = await signNDA(dealId)
      if (result.success) {
        // Show success state before refresh
        setSuccess(true)
        // Wait for animation then refresh
        setTimeout(() => {
          router.refresh()
          onOpenChange(false)
          // Reset for next time
          setTimeout(() => setSuccess(false), 300)
        }, 1600)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {success ? (
          /* Success reveal state */
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            {/* Green scan line */}
            <div className="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none">
              <div
                className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                style={{
                  animation: "nda-scanline 1.2s ease-in-out forwards",
                }}
              />
            </div>

            {/* Animated checkmark */}
            <div
              className="relative flex items-center justify-center"
              style={{ animation: "nda-check-appear 0.5s ease-out forwards" }}
            >
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <div className="relative flex size-20 items-center justify-center rounded-full border-2 border-emerald-500/50 bg-emerald-500/10">
                <CheckCircle2 className="size-10 text-emerald-400" />
              </div>
            </div>

            {/* AUTHORIZED badge */}
            <div
              className="mt-2"
              style={{ animation: "nda-text-appear 0.4s ease-out 0.3s both" }}
            >
              <div className="border-2 border-emerald-500/60 rounded px-5 py-2">
                <span className="text-emerald-400 font-mono font-bold text-sm tracking-[0.3em] uppercase">
                  AUTHORIZED
                </span>
              </div>
            </div>

            <p
              className="text-sm text-emerald-300/80 font-medium"
              style={{ animation: "nda-text-appear 0.4s ease-out 0.5s both" }}
            >
              접근 권한이 승인되었습니다
            </p>
            <p
              className="text-xs text-muted-foreground"
              style={{ animation: "nda-text-appear 0.4s ease-out 0.7s both" }}
            >
              상세 정보를 불러오는 중...
            </p>

            <style>{`
              @keyframes nda-scanline {
                0% { top: 0; opacity: 1; }
                100% { top: 100%; opacity: 0.3; }
              }
              @keyframes nda-check-appear {
                0% { transform: scale(0.5); opacity: 0; }
                60% { transform: scale(1.1); }
                100% { transform: scale(1); opacity: 1; }
              }
              @keyframes nda-text-appear {
                0% { opacity: 0; transform: translateY(8px); }
                100% { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        ) : (
          /* Normal NDA form */
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                <DialogTitle className="text-lg">
                  비밀유지계약서 (NDA)
                </DialogTitle>
              </div>
              <DialogDescription>
                이 딜의 상세 정보를 열람하기 위해 비밀유지계약에 동의해야 합니다.
              </DialogDescription>
            </DialogHeader>

            {/* Deal Info */}
            <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {dealTitle}
                </span>
                <Badge variant="outline" className="text-xs">
                  {categoryLabel}
                </Badge>
              </div>
            </div>

            {/* Plain-language summary */}
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-sm text-foreground">
              이 계약은 딜 정보를 다른 사람에게 알리지 않겠다는 약속입니다. 서명하시면 비공개 딜의 상세 정보를 열람할 수 있습니다.
            </div>

            {/* NDA Text */}
            <div className="space-y-3 rounded-lg border border-border/50 bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">
                비밀유지서약
              </p>
              <p>
                본인은 아래 딜에 관한 정보를 열람함에 있어, 해당 정보를 제3자에게
                공개, 유출, 또는 딜 검토 외의 목적으로 사용하지 않을 것을
                약속합니다.
              </p>
              <p>
                본 비밀유지의무는 딜의 존재 여부, 매각 조건, 재무 정보, 위치 정보
                등 딜과 관련된 모든 정보에 적용되며, 계약 체결 여부와 관계없이
                유효합니다.
              </p>
              <p>
                본인은 비밀유지의무를 위반할 경우, 이로 인해 발생하는 모든 손해에
                대해 법적 책임을 질 것임을 인지하고 있습니다.
              </p>
              <p>
                본 서약은 전자적 방식으로 체결되며, 서명 시점의 IP 주소와
                타임스탬프가 기록됩니다.
              </p>
            </div>

            {/* Recording Info */}
            <div className="rounded-lg border border-dashed border-border/50 bg-muted/10 p-3 text-xs text-muted-foreground">
              <p>서명 시각: {timestamp}</p>
              <p>IP 주소: 서명 시 자동 기록됩니다</p>
            </div>

            {/* Checkbox */}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded border-border accent-primary"
              />
              <span className="text-sm text-foreground">
                위 내용을 읽었으며, 동의합니다
              </span>
            </label>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                취소
              </Button>
              <Button onClick={handleSign} disabled={!agreed || isPending}>
                <Shield className="mr-2 size-4" />
                {isPending ? "서명 중..." : "NDA 서명"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Shield, FileText } from "lucide-react"
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
      try {
        await signNDA(dealId)
        router.refresh()
        onOpenChange(false)
      } catch (error) {
        console.error("NDA signing failed:", error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
      </DialogContent>
    </Dialog>
  )
}

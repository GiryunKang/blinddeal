"use client"

import { useState } from "react"
import { Shield, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NDADialog } from "./nda-dialog"

interface NDAOverlayProps {
  dealId: string
  dealTitle: string
  dealCategory: string
}

export function NDAOverlay({
  dealId,
  dealTitle,
  dealCategory,
}: NDAOverlayProps) {
  const [showNDA, setShowNDA] = useState(false)

  return (
    <div className="relative z-10 mb-8">
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-amber-500/10">
            <Lock className="size-8 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              비공개 딜입니다
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              이 딜의 상세 정보를 열람하려면 비밀유지계약(NDA)에 서명해야 합니다.
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              비밀유지계약이란 딜 정보를 외부에 공개하지 않겠다는 약속입니다.
            </p>
          </div>
          <Button
            onClick={() => setShowNDA(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Shield className="mr-2 size-4" />
            비밀유지계약(NDA) 서명하기
          </Button>
        </CardContent>
      </Card>

      <NDADialog
        dealId={dealId}
        dealTitle={dealTitle}
        dealCategory={dealCategory}
        open={showNDA}
        onOpenChange={setShowNDA}
      />
    </div>
  )
}

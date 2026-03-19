"use client"

import { useState, useTransition } from "react"
import { Eye, Lock, ShieldCheck, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { updateDealVisibility } from "@/lib/actions/deal-visibility"

interface VisibilityControlProps {
  dealId: string
  currentVisibility: string
  currentRequiredLevel: number
  matchedBuyerCount: number
  dealSlug: string
}

export function VisibilityControl({
  dealId,
  currentVisibility,
  currentRequiredLevel,
  matchedBuyerCount,
  dealSlug,
}: VisibilityControlProps) {
  const [visibility, setVisibility] = useState(currentVisibility)
  const [requiredLevel, setRequiredLevel] = useState(currentRequiredLevel)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSave() {
    startTransition(async () => {
      try {
        const vis = visibility === "private" && requiredLevel > 0
          ? "private"
          : visibility === "private"
            ? "private"
            : "public"
        await updateDealVisibility(
          dealId,
          vis as "public" | "private",
          visibility === "private" && requiredLevel > 0 ? requiredLevel : undefined
        )
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } catch {
        // Error handled by server action
      }
    })
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <ShieldCheck className="size-4" />
          공개 범위 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Radio options */}
        <div className="space-y-3">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === "public"}
              onChange={() => {
                setVisibility("public")
                setRequiredLevel(0)
              }}
              className="mt-0.5"
            />
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Eye className="size-3.5" />
                전체 공개
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                모든 사용자가 열람 가능
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30">
            <input
              type="radio"
              name="visibility"
              value="level_restricted"
              checked={visibility === "private" && requiredLevel > 0}
              onChange={() => {
                setVisibility("private")
                setRequiredLevel(requiredLevel || 1)
              }}
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <ShieldCheck className="size-3.5" />
                인증 등급 제한
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                일정 인증 등급 이상만 열람 가능
              </p>
              {visibility === "private" && requiredLevel > 0 && (
                <select
                  value={requiredLevel}
                  onChange={(e) =>
                    setRequiredLevel(parseInt(e.target.value, 10))
                  }
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                >
                  <option value={1}>Lv.1 - 휴대폰 인증</option>
                  <option value={2}>Lv.2 - 사업자 확인</option>
                  <option value={3}>Lv.3 - 자산 증빙</option>
                  <option value={4}>Lv.4 - 전문 검증</option>
                </select>
              )}
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={visibility === "private" && requiredLevel === 0}
              onChange={() => {
                setVisibility("private")
                setRequiredLevel(0)
              }}
              className="mt-0.5"
            />
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Lock className="size-3.5" />
                완전 비공개
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                초대받은 사용자만 열람 가능
              </p>
            </div>
          </label>
        </div>

        {/* Matched buyers */}
        <div className="rounded-lg bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" />
              매칭된 잠재 매수자
            </div>
            <a
              href={`/deals/${dealSlug}/analytics`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {matchedBuyerCount}명
            </a>
          </div>
        </div>

        {/* Save button */}
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="w-full"
          size="sm"
        >
          {isPending ? "저장 중..." : saved ? "저장 완료" : "저장"}
        </Button>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createLOI } from "@/lib/actions/loi"

interface LOIFormProps {
  roomId: string
  askingPrice?: number
  onSuccess?: () => void
}

export function LOIForm({ roomId, askingPrice, onSuccess }: LOIFormProps) {
  const [isPending, startTransition] = useTransition()
  const [proposedPrice, setProposedPrice] = useState(
    askingPrice?.toString() ?? ""
  )
  const [terms, setTerms] = useState("")
  const [conditions, setConditions] = useState("")
  const [validUntil, setValidUntil] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!proposedPrice || !terms || !validUntil) return

    startTransition(async () => {
      try {
        await createLOI(roomId, {
          proposed_price: parseInt(proposedPrice, 10),
          terms,
          conditions,
          valid_until: validUntil,
        })
        onSuccess?.()
      } catch (error) {
        console.error("Failed to create LOI:", error)
      }
    })
  }

  // Default valid_until to 14 days from now
  const defaultDate = new Date()
  defaultDate.setDate(defaultDate.getDate() + 14)
  const minDate = new Date().toISOString().split("T")[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-muted-foreground">
        인수의향서(LOI)는 매수 의향과 조건을 공식적으로 제안하는 문서입니다.
      </p>
      <div className="space-y-2">
        <Label htmlFor="proposed_price">제안 금액 (원)</Label>
        <Input
          id="proposed_price"
          type="number"
          value={proposedPrice}
          onChange={(e) => setProposedPrice(e.target.value)}
          placeholder="제안 금액을 입력하세요"
          required
        />
        {askingPrice && (
          <p className="text-xs text-muted-foreground">
            매각 희망가:{" "}
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
              maximumFractionDigits: 0,
            }).format(askingPrice)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="terms">거래 조건</Label>
        <Textarea
          id="terms"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          placeholder="거래 조건을 입력하세요 (예: 결제 방법, 인수 일정 등)"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conditions">특약 사항</Label>
        <Textarea
          id="conditions"
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          placeholder="특약 사항이 있다면 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="valid_until">유효 기간</Label>
        <Input
          id="valid_until"
          type="date"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
          min={minDate}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "제출 중..." : "인수의향서(LOI) 제출"}
      </Button>
    </form>
  )
}

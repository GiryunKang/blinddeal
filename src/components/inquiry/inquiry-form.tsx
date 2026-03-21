"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { submitInquiry } from "@/lib/actions/inquiries"
import {
  Search,
  Upload,
  Calendar,
  Handshake,
  Loader2,
} from "lucide-react"

const RATE_LIMIT_KEY = "blinddeal_inquiry_last_submit"
const COOLDOWN_SECONDS = 60

const inquiryTypes = [
  { value: "buy" as const, label: "딜을 찾고 있어요", icon: Search },
  { value: "sell" as const, label: "딜을 등록하고 싶어요", icon: Upload },
  { value: "meeting" as const, label: "미팅을 원해요", icon: Calendar },
  { value: "partnership" as const, label: "파트너 제휴", icon: Handshake },
]

const dealCategories = [
  { value: "real_estate" as const, label: "부동산" },
  { value: "ma" as const, label: "M&A(인수합병)" },
  { value: "both" as const, label: "둘 다" },
]

const budgetRanges = [
  { value: "~10억", label: "~10억" },
  { value: "10~50억", label: "10~50억" },
  { value: "50~100억", label: "50~100억" },
  { value: "100~200억", label: "100~200억" },
  { value: "200~500억", label: "200~500억" },
  { value: "500~1000억", label: "500~1,000억" },
  { value: "1000억~", label: "1,000억 이상" },
]

function getRemainingCooldown(): number {
  if (typeof window === "undefined") return 0
  const lastSubmit = localStorage.getItem(RATE_LIMIT_KEY)
  if (!lastSubmit) return 0
  const elapsed = Math.floor((Date.now() - parseInt(lastSubmit, 10)) / 1000)
  return Math.max(0, COOLDOWN_SECONDS - elapsed)
}

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
}

export function InquiryForm() {
  const [inquiryType, setInquiryType] = useState<"buy" | "sell" | "meeting" | "partnership">("buy")
  const [dealCategory, setDealCategory] = useState<"real_estate" | "ma" | "both" | null>(null)
  const [budgetRange, setBudgetRange] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [cooldown, setCooldown] = useState(0)

  // Check cooldown on mount and tick countdown
  useEffect(() => {
    setCooldown(getRemainingCooldown())
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const isCoolingDown = cooldown > 0

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (isCoolingDown) return

    setIsSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const result = await submitInquiry({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      company: (formData.get("company") as string) || undefined,
      inquiry_type: inquiryType,
      deal_category: dealCategory,
      budget_range: budgetRange || undefined,
      description: formData.get("description") as string,
      preferences: (formData.get("preferences") as string) || undefined,
    })

    setIsSubmitting(false)

    if (result.success) {
      setIsSuccess(true)
      // Start cooldown
      localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()))
      setCooldown(COOLDOWN_SECONDS)
    } else {
      setError(result.error || "문의 제출에 실패했습니다.")
    }
  }

  // Progress tracking for required fields: inquiryType (always selected), name, email, description
  const [trackedFields, setTrackedFields] = useState({
    name: false,
    email: false,
    description: false,
  })

  const inquiryProgress =
    (25 + // inquiryType is always selected
      (trackedFields.name ? 25 : 0) +
      (trackedFields.email ? 25 : 0) +
      (trackedFields.description ? 25 : 0))

  function handleFormChange() {
    requestAnimationFrame(() => {
      const name = (document.querySelector<HTMLInputElement>('[name="name"]')?.value ?? "").trim()
      const email = (document.querySelector<HTMLInputElement>('[name="email"]')?.value ?? "").trim()
      const description = (document.querySelector<HTMLTextAreaElement>('[name="description"]')?.value ?? "").trim()
      setTrackedFields({
        name: name.length > 0,
        email: email.length > 0,
        description: description.length > 0,
      })
    })
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes circle-draw { from { stroke-dashoffset: 126; } to { stroke-dashoffset: 0; } }
          @keyframes check-draw { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }
        ` }} />
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <svg width="48" height="48" viewBox="0 0 48 48" className="mx-auto">
            <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="3" />
            <circle cx="24" cy="24" r="20" fill="none" stroke="#10b981" strokeWidth="3"
              strokeDasharray="126" strokeDashoffset="0"
              style={{ animation: "circle-draw 0.5s ease-out forwards" }} />
            <path d="M14 24l7 7 13-13" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="40" strokeDashoffset="40"
              style={{ animation: "check-draw 0.4s ease-out 0.3s forwards" }} />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">문의가 접수되었습니다</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          영업일 기준 1일 이내에 담당자가 연락드리겠습니다.
          <br />
          감사합니다.
        </p>
        {cooldown > 0 && (
          <p className="text-xs text-muted-foreground">
            {cooldown}초 후 다시 문의할 수 있습니다
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" onChange={handleFormChange} onInput={handleFormChange}>
      {/* Progress bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${inquiryProgress}%` }}
        />
      </div>

      {/* Required fields note */}
      <p className="text-xs text-muted-foreground">
        <span className="text-red-400">*</span> 표시된 항목은 필수 입력입니다
      </p>

      {/* Cooldown notice */}
      {isCoolingDown && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          {cooldown}초 후 다시 문의할 수 있습니다
        </div>
      )}

      {/* Inquiry Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground/80">어떤 도움이 필요하신가요?</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {inquiryTypes.map((type) => {
            const Icon = type.icon
            const isSelected = inquiryType === type.value
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setInquiryType(type.value)}
                disabled={isCoolingDown}
                className={`group relative flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-all ${
                  isSelected
                    ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                    : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:border-white/[0.12] hover:bg-white/[0.04]"
                }`}
              >
                <Icon className={`h-5 w-5 ${isSelected ? "text-blue-400" : "text-muted-foreground/60"}`} />
                <span className="text-[11px] font-medium leading-tight sm:text-xs">{type.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Name & Email row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="inquiry-name">
            이름/담당자명 <span className="text-red-400">*</span>
          </Label>
          <Input
            id="inquiry-name"
            name="name"
            required
            disabled={isCoolingDown}
            placeholder="홍길동"
            className="h-10 border-white/[0.08] bg-white/[0.03] focus-visible:border-blue-500/40"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inquiry-email">
            이메일 <span className="text-red-400">*</span>
          </Label>
          <Input
            id="inquiry-email"
            name="email"
            type="email"
            required
            disabled={isCoolingDown}
            placeholder="email@example.com"
            className="h-10 border-white/[0.08] bg-white/[0.03] focus-visible:border-blue-500/40"
          />
        </div>
      </div>

      {/* Phone & Company row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="inquiry-phone">연락처</Label>
          <Input
            id="inquiry-phone"
            name="phone"
            type="tel"
            disabled={isCoolingDown}
            placeholder="010-0000-0000"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            maxLength={13}
            className="h-10 border-white/[0.08] bg-white/[0.03] focus-visible:border-blue-500/40"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inquiry-company">회사/기관명</Label>
          <Input
            id="inquiry-company"
            name="company"
            disabled={isCoolingDown}
            placeholder="(주)블라인드딜"
            className="h-10 border-white/[0.08] bg-white/[0.03] focus-visible:border-blue-500/40"
          />
        </div>
      </div>

      {/* Deal Category */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground/80">관심 분야</Label>
        <div className="flex flex-wrap gap-3">
          {dealCategories.map((cat) => {
            const isSelected = dealCategory === cat.value
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setDealCategory(isSelected ? null : cat.value)}
                disabled={isCoolingDown}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  isSelected
                    ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-400"
                    : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:border-white/[0.12] hover:bg-white/[0.04]"
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground/80">예산 규모</Label>
        <div className="flex flex-wrap gap-3">
          {budgetRanges.map((range) => {
            const isSelected = budgetRange === range.value
            return (
              <button
                key={range.value}
                type="button"
                onClick={() => setBudgetRange(isSelected ? "" : range.value)}
                disabled={isCoolingDown}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  isSelected
                    ? "border-purple-500/40 bg-purple-500/10 text-purple-400"
                    : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:border-white/[0.12] hover:bg-white/[0.04]"
                }`}
              >
                {range.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="inquiry-description">
          문의 내용 <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="inquiry-description"
          name="description"
          required
          disabled={isCoolingDown}
          rows={4}
          placeholder="찾고 있는 딜이나 등록하고 싶은 딜에 대해 자유롭게 설명해주세요"
          className="border-white/[0.08] bg-white/[0.03] focus-visible:border-blue-500/40"
        />
      </div>

      {/* Preferences */}
      <div className="space-y-2">
        <Label htmlFor="inquiry-preferences">희망 사항</Label>
        <Textarea
          id="inquiry-preferences"
          name="preferences"
          rows={3}
          disabled={isCoolingDown}
          placeholder="지역, 업종, 시기 등 추가 희망 사항이 있으면 기재해주세요"
          className="border-white/[0.08] bg-white/[0.03] focus-visible:border-blue-500/40"
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting || isCoolingDown}
        className="glow-button relative h-12 w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-semibold text-white transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            제출 중...
          </>
        ) : isCoolingDown ? (
          `${cooldown}초 후 다시 문의 가능`
        ) : (
          "문의 보내기"
        )}
      </Button>
    </form>
  )
}

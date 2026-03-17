"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Check,
  Lock,
  Upload,
  Loader2,
  Clock,
  Mail,
  Phone,
  Building,
  FileCheck,
  Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { submitVerification } from "@/lib/actions/verification"

interface VerificationRecord {
  id: string
  verification_type: string
  status: string
  document_url: string | null
  notes: string | null
  created_at: string
}

interface Level {
  level: number
  title: string
  subtitle: string
  description: string
  benefits: string
  icon: React.ElementType
  uploadType: string | null
  uploadLabel: string | null
}

const levels: Level[] = [
  {
    level: 0,
    title: "기본",
    subtitle: "이메일 가입",
    description: "이메일로 가입하여 기본 계정이 생성되었습니다.",
    benefits: "딜 목록 조회, 커뮤니티 참여",
    icon: Mail,
    uploadType: null,
    uploadLabel: null,
  },
  {
    level: 1,
    title: "인증",
    subtitle: "휴대폰 본인인증",
    description: "PASS 본인인증을 통해 실명을 확인합니다.",
    benefits: "딜 관심 표현, 채팅방 참여",
    icon: Phone,
    uploadType: null,
    uploadLabel: null,
  },
  {
    level: 2,
    title: "사업자",
    subtitle: "사업자등록증 또는 법인등기부등본 업로드",
    description: "사업자등록증이나 법인등기부등본을 제출하여 사업자 자격을 인증합니다.",
    benefits: "NDA 서명, 딜 등록, 전문가 매칭",
    icon: Building,
    uploadType: "business",
    uploadLabel: "사업자등록증 / 법인등기부등본",
  },
  {
    level: 3,
    title: "검증",
    subtitle: "자산 증빙 + 신용등급 자료 제출",
    description: "자산 증빙 서류와 신용등급 자료를 제출하여 거래 능력을 검증합니다.",
    benefits: "프리미엄 딜 접근, 에스크로 이용",
    icon: FileCheck,
    uploadType: "financial",
    uploadLabel: "자산 증빙 / 신용등급 자료",
  },
  {
    level: 4,
    title: "프리미엄",
    subtitle: "외부 기관 검증 레터",
    description: "외부 공인 기관의 검증 레터를 제출하여 최고 등급 인증을 받습니다.",
    benefits: "전체 딜 접근, 우선 매칭, 전담 매니저",
    icon: Crown,
    uploadType: "premium",
    uploadLabel: "외부 기관 검증 레터",
  },
]

interface VerificationStepperProps {
  currentLevel: number
  records: VerificationRecord[]
}

export function VerificationStepper({
  currentLevel,
  records,
}: VerificationStepperProps) {
  return (
    <div className="relative">
      {levels.map((lvl, idx) => {
        const isCompleted = lvl.level < currentLevel
        const isCurrent = lvl.level === currentLevel
        const isLocked = lvl.level > currentLevel

        // Check for pending record for this level's upload type
        const pendingRecord = lvl.uploadType
          ? records.find(
              (r) =>
                r.verification_type === lvl.uploadType && r.status === "pending"
            )
          : null

        return (
          <div key={lvl.level} className="relative flex gap-4">
            {/* Vertical line connector */}
            {idx < levels.length - 1 && (
              <div
                className={cn(
                  "absolute left-[19px] top-10 h-[calc(100%-24px)] w-0.5",
                  isCompleted ? "bg-emerald-500" : "bg-border"
                )}
              />
            )}

            {/* Status indicator */}
            <div className="relative z-10 flex-shrink-0">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full border-2",
                  isCompleted &&
                    "border-emerald-500 bg-emerald-500/20 text-emerald-400",
                  isCurrent &&
                    "animate-pulse border-blue-500 bg-blue-500/20 text-blue-400",
                  isLocked && "border-border bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="size-5" />
                ) : isLocked ? (
                  <Lock className="size-4" />
                ) : (
                  <lvl.icon className="size-5" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-10">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "text-sm font-semibold",
                    isCompleted && "text-emerald-400",
                    isCurrent && "text-blue-400",
                    isLocked && "text-muted-foreground"
                  )}
                >
                  Level {lvl.level} — {lvl.title}
                </h3>
                {isCompleted && (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                    완료
                  </span>
                )}
                {pendingRecord && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                    <Clock className="size-2.5" />
                    승인 대기 중
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "mt-0.5 text-xs",
                  isLocked ? "text-muted-foreground/60" : "text-muted-foreground"
                )}
              >
                {lvl.subtitle}
              </p>
              <p
                className={cn(
                  "mt-2 text-sm",
                  isLocked ? "text-muted-foreground/60" : "text-foreground/80"
                )}
              >
                {lvl.description}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-primary/80">혜택:</span>{" "}
                {lvl.benefits}
              </p>

              {/* Level 1: Phone verification - disabled for now */}
              {isCurrent && lvl.level === 1 && !pendingRecord && (
                <div className="mt-4">
                  <Button variant="outline" disabled className="gap-2">
                    <Phone className="size-4" />
                    준비 중
                  </Button>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PASS 본인인증 연동이 준비 중입니다.
                  </p>
                </div>
              )}

              {/* Levels 2-4: Upload form */}
              {isCurrent &&
                lvl.uploadType &&
                !pendingRecord && (
                  <UploadForm
                    type={lvl.uploadType}
                    label={lvl.uploadLabel!}
                  />
                )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function UploadForm({ type, label }: { type: string; label: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const file = formData.get("file") as File | null

    if (!file || file.size === 0) {
      setError("파일을 선택해 주세요.")
      return
    }

    startTransition(async () => {
      try {
        await submitVerification(type, formData)
        setSuccess(true)
        router.refresh()
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "제출에 실패했습니다."
        )
      }
    })
  }

  if (success) {
    return (
      <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
        <p className="text-sm text-emerald-400">
          서류가 제출되었습니다. 관리자 검토 후 승인됩니다.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor={`file-${type}`} className="text-xs text-muted-foreground">
          {label}
        </Label>
        <Input
          id={`file-${type}`}
          name="file"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="text-xs file:mr-2 file:rounded file:border-0 file:bg-primary/10 file:px-2 file:py-1 file:text-xs file:text-primary"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`notes-${type}`} className="text-xs text-muted-foreground">
          비고 (선택)
        </Label>
        <Input
          id={`notes-${type}`}
          name="notes"
          type="text"
          placeholder="추가 설명이 있으면 입력하세요"
          className="text-xs"
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <Button type="submit" size="sm" disabled={isPending} className="gap-1.5">
        {isPending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Upload className="size-3.5" />
        )}
        서류 제출
      </Button>
    </form>
  )
}

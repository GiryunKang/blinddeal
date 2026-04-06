"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  Shield,
  ShieldCheck,
  Building,
  Award,
  Crown,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { completeOnboarding } from "@/lib/actions/onboarding"

const TOTAL_STEPS = 4

const interestOptions = [
  { value: "real_estate", label: "부동산" },
  { value: "mna", label: "M&A" },
  { value: "logistics", label: "물류" },
  { value: "it_tech", label: "IT/테크" },
  { value: "healthcare", label: "헬스케어" },
  { value: "manufacturing", label: "제조" },
  { value: "finance", label: "금융" },
  { value: "other", label: "기타" },
]

const dealSizeOptions = [
  { label: "~10억", min: 0, max: 1_000_000_000 },
  { label: "10~100억", min: 1_000_000_000, max: 10_000_000_000 },
  { label: "100~1,000억", min: 10_000_000_000, max: 100_000_000_000 },
  { label: "1,000억~", min: 100_000_000_000, max: null },
]

const verificationLevels = [
  {
    level: 0,
    title: "기본",
    description: "딜 목록 조회, 커뮤니티 참여",
    icon: Shield,
    color: "text-zinc-400",
  },
  {
    level: 1,
    title: "본인인증",
    description: "딜 관심 표현, 채팅방 참여",
    icon: ShieldCheck,
    color: "text-blue-400",
  },
  {
    level: 2,
    title: "사업자",
    description: "NDA 서명, 딜 등록, 전문가 매칭",
    icon: Building,
    color: "text-indigo-400",
  },
  {
    level: 3,
    title: "검증완료",
    description: "프리미엄 딜 접근, 에스크로 파트너 연결",
    icon: Award,
    color: "text-purple-400",
  },
  {
    level: 4,
    title: "프리미엄",
    description: "전체 딜 접근, 우선 매칭, 전담 매니저",
    icon: Crown,
    color: "text-amber-400",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [interests, setInterests] = useState<string[]>([])
  const [selectedDealSize, setSelectedDealSize] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  function toggleInterest(value: string) {
    setInterests((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    )
  }

  function handleSkip() {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1)
    } else {
      finishOnboarding()
    }
  }

  function handleNext() {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1)
    } else {
      finishOnboarding()
    }
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1))
  }

  function finishOnboarding() {
    const dealSize =
      selectedDealSize !== null ? dealSizeOptions[selectedDealSize] : null

    startTransition(async () => {
      try {
        await completeOnboarding(
          interests,
          dealSize?.min ?? null,
          dealSize?.max ?? null
        )
      } catch {
        // profile columns may not exist yet — continue regardless
      }
      const destination = interests.includes("sell") ? "/deals/new" : "/deals"
      router.push(destination)
      router.refresh()
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "size-2 rounded-full transition-all",
                i === step
                  ? "w-6 bg-primary"
                  : i < step
                    ? "bg-primary/60"
                    : "bg-border"
              )}
            />
          ))}
        </div>

        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
          {/* Step 1: Welcome */}
          {step === 0 && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Sparkles className="size-7 text-white" />
                </div>
                <CardTitle className="text-xl">환영합니다!</CardTitle>
                <CardDescription className="mt-2">
                  BlindDeal은 검증된 사용자 간의 안전한 거래를 지원하는
                  플랫폼입니다. 몇 가지 정보를 설정하면 맞춤 딜을 추천받을 수
                  있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <Button onClick={handleNext} className="w-full gap-1.5">
                  시작하기
                  <ArrowRight className="size-4" />
                </Button>
                <Button variant="ghost" onClick={handleSkip} className="text-xs text-muted-foreground">
                  건너뛰기
                </Button>
              </CardContent>
            </>
          )}

          {/* Step 2: Interests */}
          {step === 1 && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">관심 분야 선택</CardTitle>
                <CardDescription>
                  관심 있는 분야를 선택하면 맞춤 딜을 추천받을 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleInterest(opt.value)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                        interests.includes(opt.value)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted/30 text-muted-foreground hover:border-border/80 hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    <ArrowLeft className="mr-1 size-3.5" />
                    이전
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleSkip} className="text-xs text-muted-foreground">
                      건너뛰기
                    </Button>
                    <Button size="sm" onClick={handleNext} className="gap-1">
                      다음
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Deal size */}
          {step === 2 && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">희망 딜 규모</CardTitle>
                <CardDescription>
                  관심 있는 딜 규모를 선택해 주세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  {dealSizeOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDealSize(idx)}
                      className={cn(
                        "rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all",
                        selectedDealSize === idx
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted/30 text-muted-foreground hover:border-border/80 hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    <ArrowLeft className="mr-1 size-3.5" />
                    이전
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleSkip} className="text-xs text-muted-foreground">
                      건너뛰기
                    </Button>
                    <Button size="sm" onClick={handleNext} className="gap-1">
                      다음
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: Verification info */}
          {step === 3 && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">인증 등급 안내</CardTitle>
                <CardDescription>
                  인증 등급이 높을수록 더 많은 기능과 딜에 접근할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {verificationLevels.map((vl) => {
                    const Icon = vl.icon
                    return (
                      <div
                        key={vl.level}
                        className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5"
                      >
                        <Icon className={cn("mt-0.5 size-4 flex-shrink-0", vl.color)} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            Lv.{vl.level} {vl.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {vl.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    <ArrowLeft className="mr-1 size-3.5" />
                    이전
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleSkip} className="text-xs text-muted-foreground">
                      건너뛰기
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleNext}
                      disabled={isPending}
                      className="gap-1"
                    >
                      {isPending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : null}
                      완료
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

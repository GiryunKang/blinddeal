import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/supabase/auth"
import { getVerificationStatus } from "@/lib/actions/verification"
import { VerificationBadge } from "@/components/profile/verification-badge"
import { VerificationStepper } from "./verification-stepper"

export default async function VerificationPage() {
  await requireAuth()
  const { level, records } = await getVerificationStatus()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          인증 등급 관리
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          인증 등급을 올려 더 많은 딜에 접근하세요
        </p>
        <div className="mt-3">
          <VerificationBadge level={level} />
        </div>
      </div>

      <VerificationStepper currentLevel={level} records={records} />
    </div>
  )
}

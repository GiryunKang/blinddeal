import { requireAuth } from "@/lib/supabase/auth"
import { DealForm } from "@/components/deals/deal-form"

export default async function NewDealPage() {
  await requireAuth()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          새 딜 등록
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          부동산 또는 M&A 딜 정보를 입력해주세요
        </p>
      </div>

      <DealForm />
    </div>
  )
}

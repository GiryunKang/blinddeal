"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

const DEFAULT_CHECKLIST = [
  // 법률
  { category: "법률", title: "법인 등기부등본 확인", order_index: 1 },
  { category: "법률", title: "소송 및 분쟁 이력 조사", order_index: 2 },
  { category: "법률", title: "계약서 검토 (임대차, 용역 등)", order_index: 3 },
  { category: "법률", title: "지적재산권 확인", order_index: 4 },
  // 재무
  { category: "재무", title: "최근 3년 재무제표 분석", order_index: 5 },
  { category: "재무", title: "세금 납부 이력 확인", order_index: 6 },
  { category: "재무", title: "부채 및 담보 현황 파악", order_index: 7 },
  { category: "재무", title: "매출 구성 및 수익성 분석", order_index: 8 },
  // 운영
  { category: "운영", title: "인력 구조 및 핵심 인재 파악", order_index: 9 },
  { category: "운영", title: "주요 거래처 현황 분석", order_index: 10 },
  { category: "운영", title: "시설 및 장비 상태 점검", order_index: 11 },
  // 시장
  { category: "시장", title: "시장 규모 및 성장성 분석", order_index: 12 },
  { category: "시장", title: "경쟁사 분석", order_index: 13 },
  { category: "시장", title: "규제 환경 검토", order_index: 14 },
]

export async function createDD(roomId: string, dealId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Create DD process
  const { data: dd, error: ddError } = await supabase
    .from("due_diligence")
    .insert({
      room_id: roomId,
      deal_id: dealId,
      created_by: user.id,
      status: "in_progress",
    })
    .select()
    .single()

  if (ddError) {
    console.error("Error creating DD:", ddError)
    throw new Error("실사 프로세스 생성에 실패했습니다.")
  }

  // Create checklist items
  const checklistItems = DEFAULT_CHECKLIST.map((item) => ({
    dd_id: dd.id,
    category: item.category,
    title: item.title,
    status: "pending" as const,
    order_index: item.order_index,
  }))

  const { error: checklistError } = await supabase
    .from("dd_checklist_items")
    .insert(checklistItems)

  if (checklistError) {
    console.error("Error creating checklist:", checklistError)
  }

  return dd
}

export async function getDDByRoom(roomId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("due_diligence")
    .select(
      `
      *,
      checklist_items:dd_checklist_items (
        id,
        category,
        title,
        status,
        notes,
        order_index,
        updated_at
      )
    `
    )
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching DD:", error)
    return null
  }

  // Sort checklist items by order_index
  if (data?.checklist_items) {
    data.checklist_items.sort(
      (a: { order_index: number }, b: { order_index: number }) =>
        a.order_index - b.order_index
    )
  }

  return data
}

export async function updateChecklistItem(
  itemId: string,
  status: "pending" | "in_progress" | "completed" | "issue",
  notes?: string
) {
  await requireAuth()
  const supabase = await createClient()

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (notes !== undefined) {
    updateData.notes = notes
  }

  const { data, error } = await supabase
    .from("dd_checklist_items")
    .update(updateData)
    .eq("id", itemId)
    .select()
    .single()

  if (error) {
    console.error("Error updating checklist item:", error)
    throw new Error("체크리스트 항목 업데이트에 실패했습니다.")
  }

  return data
}

export async function completeDDReview(
  ddId: string,
  result: "pass" | "fail" | "conditional",
  summary: string
) {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("due_diligence")
    .update({
      status: "completed",
      result,
      summary,
      completed_at: new Date().toISOString(),
    })
    .eq("id", ddId)
    .select()
    .single()

  if (error) {
    console.error("Error completing DD review:", error)
    throw new Error("실사 리뷰 완료 처리에 실패했습니다.")
  }

  return data
}

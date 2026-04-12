"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/supabase/auth"

const DEFAULT_CHECKLIST = [
  // 법률
  { category: "법률", item_name: "법인 등기부등본 확인" },
  { category: "법률", item_name: "소송 및 분쟁 이력 조사" },
  { category: "법률", item_name: "계약서 검토 (임대차, 용역 등)" },
  { category: "법률", item_name: "지적재산권 확인" },
  // 재무
  { category: "재무", item_name: "최근 3년 재무제표 분석" },
  { category: "재무", item_name: "세금 납부 이력 확인" },
  { category: "재무", item_name: "부채 및 담보 현황 파악" },
  { category: "재무", item_name: "매출 구성 및 수익성 분석" },
  // 운영
  { category: "운영", item_name: "인력 구조 및 핵심 인재 파악" },
  { category: "운영", item_name: "주요 거래처 현황 분석" },
  { category: "운영", item_name: "시설 및 장비 상태 점검" },
  // 시장
  { category: "시장", item_name: "시장 규모 및 성장성 분석" },
  { category: "시장", item_name: "경쟁사 분석" },
  { category: "시장", item_name: "규제 환경 검토" },
]

export async function createDD(roomId: string, dealId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: room } = await supabase
    .from("deal_rooms")
    .select("buyer_id, seller_id")
    .eq("id", roomId)
    .single()

  if (!room || (room.buyer_id !== user.id && room.seller_id !== user.id)) {
    throw new Error("권한이 없습니다.")
  }

  // Create DD process
  const { data: dd, error: ddError } = await supabase
    .from("due_diligence")
    .insert({
      room_id: roomId,
      deal_id: dealId,
      status: "initiated",
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
    item_name: item.item_name,
    status: "pending" as const,
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
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: room } = await supabase
    .from("deal_rooms")
    .select("buyer_id, seller_id")
    .eq("id", roomId)
    .single()

  if (!room || (room.buyer_id !== user.id && room.seller_id !== user.id)) {
    return null
  }

  const { data, error } = await supabase
    .from("due_diligence")
    .select(
      `
      *,
      checklist_items:dd_checklist_items (
        id,
        category,
        item_name,
        status,
        notes,
        completed_at
      )
    `
    )
    .eq("room_id", roomId)
    .order("started_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching DD:", error)
    return null
  }

  return data
}

export async function updateChecklistItem(
  itemId: string,
  status: "pending" | "in_progress" | "completed" | "issue_found",
  notes?: string
) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify participant: checklist item → DD → room
  const { data: item } = await supabase
    .from("dd_checklist_items")
    .select("dd_id")
    .eq("id", itemId)
    .single()

  if (!item) {
    throw new Error("권한이 없습니다.")
  }

  const { data: dd } = await supabase
    .from("due_diligence")
    .select("room_id")
    .eq("id", item.dd_id)
    .single()

  if (!dd) {
    throw new Error("권한이 없습니다.")
  }

  const { data: room } = await supabase
    .from("deal_rooms")
    .select("buyer_id, seller_id")
    .eq("id", dd.room_id)
    .single()

  if (!room || (room.buyer_id !== user.id && room.seller_id !== user.id)) {
    throw new Error("권한이 없습니다.")
  }

  const updateData: Record<string, unknown> = { status }

  if (status === "completed") {
    updateData.completed_at = new Date().toISOString()
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
  result: "pass" | "fail" | "conditional_pass",
  summary: string
) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: dd } = await supabase
    .from("due_diligence")
    .select("room_id")
    .eq("id", ddId)
    .single()

  if (!dd) {
    throw new Error("권한이 없습니다.")
  }

  const { data: room } = await supabase
    .from("deal_rooms")
    .select("buyer_id, seller_id")
    .eq("id", dd.room_id)
    .single()

  if (!room || (room.buyer_id !== user.id && room.seller_id !== user.id)) {
    throw new Error("권한이 없습니다.")
  }

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

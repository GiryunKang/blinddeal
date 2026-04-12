import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Shield } from "lucide-react"

import { requireAuth } from "@/lib/supabase/auth"
import { getRoom, getMessages } from "@/lib/actions/rooms"
import { getLOIs } from "@/lib/actions/loi"
import { getDDByRoom } from "@/lib/actions/due-diligence"
import { getEscrow } from "@/lib/actions/escrow"
import { MainLayout } from "@/components/layout/main-layout"
import { Chat } from "@/components/rooms/chat"
import { RoomSidebar } from "@/components/rooms/room-sidebar"

interface RoomDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { id } = await params
  const user = await requireAuth()
  const roomResult = await getRoom(id)

  if (!roomResult.success || !roomResult.data) {
    notFound()
  }

  const room = roomResult.data

  const [messages, lois, ddResult, escrowResult] = await Promise.all([
    getMessages(id),
    getLOIs(id),
    getDDByRoom(id).catch(() => null),
    getEscrow(id).catch(() => null),
  ])

  const ddData = ddResult ?? null
  const escrowData = escrowResult ?? null

  const currentUserId = user.id

  const statusLabels: Record<string, string> = {
    inquiry: "문의",
    negotiating: "협상 중",
    loi_exchanged: "LOI 교환",
    due_diligence: "실사(DD)",
    contract_review: "계약 검토",
    partner_escrow: "파트너 에스크로",
    completed: "완료",
    cancelled: "취소",
  }

  const stageGuide: Record<string, string> = {
    inquiry: "상대방과 대화를 시작하세요. 딜에 관심이 있다면 협상 단계로 진행합니다.",
    negotiating: "조건을 협의한 후, LOI(의향서)를 작성해 보세요.",
    loi_exchanged: "LOI가 수락되면 실사(DD) 단계로 넘어갑니다.",
    due_diligence: "법률, 재무, 운영 실사를 진행하세요. 체크리스트를 확인하세요.",
    contract_review: "계약서를 검토하고 에스크로 파트너 연결을 준비하세요.",
    partner_escrow: "에스크로 파트너를 통해 안전하게 거래가 진행됩니다.",
    completed: "거래가 완료되었습니다.",
    cancelled: "이 거래는 취소되었습니다.",
  }

  const dealTitle = room.deal?.title ?? "삭제된 딜"
  const dealSlug = room.deal?.slug
  const roomStatus = room.status as string
  const counterpartyName = room.buyer_id === currentUserId
    ? (room.seller?.display_name ?? "매도자")
    : (room.buyer?.display_name ?? "매수자")
  const counterpartyVerification = room.buyer_id === currentUserId
    ? (room.seller?.verification_level ?? 0)
    : (room.buyer?.verification_level ?? 0)

  return (
    <MainLayout>
      {/* Deal context header + stage guide */}
      <div className="mb-4 rounded-xl border border-border/50 bg-card p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/rooms" className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="size-5" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {dealSlug ? (
                  <Link href={`/deals/${dealSlug}`} className="text-sm font-semibold text-foreground hover:text-blue-400 truncate transition-colors">
                    {dealTitle}
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground truncate">{dealTitle}</span>
                )}
                <span className="shrink-0 rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                  {statusLabels[roomStatus] ?? roomStatus}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">상대방: {counterpartyName}</span>
                {counterpartyVerification > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                    <Shield className="size-3" />
                    인증 Lv.{counterpartyVerification}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {stageGuide[roomStatus] && (
          <p className="mt-2 text-xs text-muted-foreground/80 border-t border-border/30 pt-2">
            💡 {stageGuide[roomStatus]}
          </p>
        )}
      </div>

      <div className="grid h-[calc(100vh-14rem)] gap-6 lg:grid-cols-3">
        {/* Left — Chat */}
        <div className="flex flex-col lg:col-span-2">
          <Chat
            roomId={room.id}
            initialMessages={messages}
            currentUserId={currentUserId}
          />
        </div>

        {/* Right — Sidebar */}
        <div className="hidden lg:block">
          <RoomSidebar
            room={room}
            currentUserId={currentUserId}
            lois={lois}
            ddData={ddData}
            escrowData={escrowData}
          />
        </div>
      </div>
    </MainLayout>
  )
}

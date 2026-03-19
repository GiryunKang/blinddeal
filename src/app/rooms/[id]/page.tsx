import { notFound } from "next/navigation"
import { requireAuth } from "@/lib/supabase/auth"
import { getRoom, getMessages } from "@/lib/actions/rooms"
import { getLOIs } from "@/lib/actions/loi"
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

  const [messages, lois] = await Promise.all([
    getMessages(id),
    getLOIs(id),
  ])

  const currentUserId = user.id

  return (
    <MainLayout>
      <div className="grid h-[calc(100vh-8rem)] gap-6 lg:grid-cols-3">
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
          />
        </div>
      </div>
    </MainLayout>
  )
}

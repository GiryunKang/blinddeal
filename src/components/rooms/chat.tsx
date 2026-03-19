"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { WifiOff } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { MessageInput } from "./message-input"
import { formatDate } from "@/lib/utils"

interface MessageWithSender {
  id: string
  room_id: string
  sender_id: string
  content: string
  message_type: "text" | "file" | "system"
  file_url: string | null
  is_read: boolean
  created_at: string
  sender: {
    id: string
    display_name: string
    avatar_url: string | null
  } | null
}

interface ChatProps {
  roomId: string
  initialMessages: MessageWithSender[]
  currentUserId: string
}

export function Chat({ roomId, initialMessages, currentUserId }: ChatProps) {
  const [messages, setMessages] = useState<MessageWithSender[]>(initialMessages)
  const [connectionError, setConnectionError] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Subscribe to realtime messages
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const newMessage = payload.new as MessageWithSender

          // Fetch sender profile
          const { data: sender } = await supabase
            .from("profiles")
            .select("id, display_name, avatar_url")
            .eq("id", newMessage.sender_id)
            .single()

          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMessage.id)) return prev
            return [...prev, { ...newMessage, sender }]
          })
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setConnectionError(false)
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setConnectionError(true)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      {/* Connection error banner */}
      {connectionError && (
        <div className="flex items-center gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-400">
          <WifiOff className="size-4" />
          <span>실시간 연결이 끊어졌습니다. 페이지를 새로고침해주세요.</span>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              대화를 시작해보세요
            </p>
          </div>
        )}

        {messages.map((message) => {
          if (message.message_type === "system") {
            return (
              <div key={message.id} className="flex justify-center">
                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {message.content}
                </span>
              </div>
            )
          }

          const isOwn = message.sender_id === currentUserId
          const senderName =
            message.sender?.display_name ?? "알 수 없음"
          const initials = senderName.slice(0, 2).toUpperCase()

          return (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isOwn && (
                <Avatar size="sm">
                  <AvatarImage
                    src={message.sender?.avatar_url ?? undefined}
                    alt={senderName}
                  />
                  <AvatarFallback className="text-[10px]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`flex max-w-[70%] flex-col ${isOwn ? "items-end" : "items-start"}`}
              >
                {!isOwn && (
                  <span className="mb-1 text-xs text-muted-foreground">
                    {senderName}
                  </span>
                )}
                <div
                  className={`rounded-2xl px-3 py-2 text-sm ${
                    isOwn
                      ? "bg-primary/10 text-foreground"
                      : "bg-card text-foreground ring-1 ring-foreground/10"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
                <span className="mt-1 text-[10px] text-muted-foreground">
                  {formatDate(message.created_at, "HH:mm")}
                </span>
              </div>
            </div>
          )
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput roomId={roomId} />
    </div>
  )
}

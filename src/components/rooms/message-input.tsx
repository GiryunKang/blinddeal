"use client"

import { useState, useTransition } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendMessage } from "@/lib/actions/rooms"

interface MessageInputProps {
  roomId: string
}

export function MessageInput({ roomId }: MessageInputProps) {
  const [content, setContent] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmed = content.trim()
    if (!trimmed) return

    startTransition(async () => {
      try {
        await sendMessage(roomId, trimmed)
        setContent("")
      } catch (error) {
        console.error("Failed to send message:", error)
      }
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-border/50 p-3"
    >
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
        disabled={isPending}
        className="flex-1"
      />
      <Button
        type="submit"
        size="icon"
        disabled={isPending || !content.trim()}
      >
        <Send className="size-4" />
      </Button>
    </form>
  )
}

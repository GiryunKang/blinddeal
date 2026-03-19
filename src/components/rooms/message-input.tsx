"use client"

import { useState, useTransition } from "react"
import { Send } from "lucide-react"
import { toast } from "sonner"
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
      const result = await sendMessage(roomId, trimmed)

      if (result.success) {
        setContent("")
      } else {
        toast.error(result.error || "메시지 전송에 실패했습니다")
        // Keep the message text in input on failure (don't clear)
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

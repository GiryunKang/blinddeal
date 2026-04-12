"use client"

import { useState, useTransition } from "react"
import { updateChecklistItem } from "@/lib/actions/due-diligence"

type ItemStatus = "pending" | "in_progress" | "completed" | "issue_found"

const statusConfig: Record<
  ItemStatus,
  { dot: string; label: string; next: ItemStatus }
> = {
  pending: { dot: "bg-gray-400", label: "대기", next: "in_progress" },
  in_progress: { dot: "bg-blue-400", label: "진행중", next: "completed" },
  completed: { dot: "bg-green-400", label: "완료", next: "pending" },
  issue_found: { dot: "bg-red-400", label: "이슈", next: "pending" },
}

interface ChecklistItemProps {
  item: {
    id: string
    item_name: string
    status: ItemStatus
    notes: string | null
    category: string
  }
}

export function ChecklistItem({ item }: ChecklistItemProps) {
  const [status, setStatus] = useState<ItemStatus>(item.status)
  const [isPending, startTransition] = useTransition()
  const config = statusConfig[status]

  function handleToggle() {
    const nextStatus = config.next
    setStatus(nextStatus)
    startTransition(async () => {
      try {
        await updateChecklistItem(item.id, nextStatus)
      } catch {
        setStatus(status)
      }
    })
  }

  function handleSetIssue() {
    setStatus("issue_found")
    startTransition(async () => {
      try {
        await updateChecklistItem(item.id, "issue_found")
      } catch {
        setStatus(status)
      }
    })
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-border/50 px-3 py-2.5 transition-colors ${
        isPending ? "opacity-60" : ""
      }`}
    >
      {/* Status dot */}
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="group flex-shrink-0"
        title={`상태: ${config.label} (클릭하여 변경)`}
      >
        <span
          className={`block size-3 rounded-full ${config.dot} transition-transform group-hover:scale-125`}
        />
      </button>

      {/* Title */}
      <span
        className={`flex-1 text-sm ${
          status === "completed"
            ? "text-muted-foreground line-through"
            : "text-foreground"
        }`}
      >
        {item.item_name}
      </span>

      {/* Status label */}
      <span
        className={`text-xs font-medium ${
          status === "issue_found" ? "text-red-400" : "text-muted-foreground"
        }`}
      >
        {config.label}
      </span>

      {/* Issue button */}
      {status !== "issue_found" && (
        <button
          onClick={handleSetIssue}
          disabled={isPending}
          className="text-xs text-muted-foreground transition-colors hover:text-red-400"
          title="이슈로 표시"
        >
          !
        </button>
      )}
    </div>
  )
}

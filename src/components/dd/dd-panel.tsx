"use client"

import { ChecklistItem } from "./checklist-item"

type ItemStatus = "pending" | "in_progress" | "completed" | "issue_found"

interface DDChecklistItem {
  id: string
  category: string
  item_name: string
  status: ItemStatus
  notes: string | null
}

interface DDPanelProps {
  dd: {
    id: string
    status: string
    result?: string | null
    summary?: string | null
    checklist_items: DDChecklistItem[]
  }
}

export function DDPanel({ dd }: DDPanelProps) {
  // Group checklist items by category
  const grouped = dd.checklist_items.reduce<Record<string, DDChecklistItem[]>>(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {}
  )

  // Progress stats
  const total = dd.checklist_items.length
  const completed = dd.checklist_items.filter(
    (i) => i.status === "completed"
  ).length
  const issues = dd.checklist_items.filter((i) => i.status === "issue_found").length
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              실사(Due Diligence) 진행 현황
            </h3>
            <p className="text-xs text-muted-foreground">
              거래 전 기업·자산의 재무, 법률, 운영 상태를 정밀 조사하는 과정입니다
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {dd.status === "completed" ? (
              <span
                className={`font-medium ${
                  dd.result === "pass"
                    ? "text-green-400"
                    : dd.result === "fail"
                    ? "text-red-400"
                    : "text-amber-400"
                }`}
              >
                {dd.result === "pass"
                  ? "통과"
                  : dd.result === "fail"
                  ? "불합격"
                  : "조건부 통과"}
              </span>
            ) : (
              <span className="text-muted-foreground">진행중</span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {completed}/{total} 완료
              {issues > 0 && (
                <span className="ml-2 text-red-400">{issues} 이슈</span>
              )}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      {dd.summary && (
        <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
          <p className="text-sm text-muted-foreground">{dd.summary}</p>
        </div>
      )}

      {/* Checklist grouped by category */}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            {category}
          </h4>
          <div className="space-y-1.5">
            {items.map((item) => (
              <ChecklistItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

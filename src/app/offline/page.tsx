"use client"

import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20">
        <WifiOff className="h-10 w-10 text-blue-400" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-foreground">오프라인 상태입니다</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        인터넷 연결이 끊어졌습니다. 연결이 복구되면 자동으로 돌아갑니다.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30"
      >
        다시 시도
      </button>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-lg skeleton-shimmer" />
        <p className="text-sm text-muted-foreground skeleton-shimmer rounded px-4 py-1">
          로딩 중...
        </p>
      </div>
    </div>
  )
}

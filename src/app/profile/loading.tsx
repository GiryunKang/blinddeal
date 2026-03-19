export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="h-8 w-24 bg-muted/50 rounded animate-pulse mb-6" />
      <div className="mb-6 rounded-2xl border border-border/50 p-6">
        <div className="flex items-start gap-4">
          <div className="size-16 bg-muted/50 rounded-full animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-32 bg-muted/50 rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted/30 rounded animate-pulse" />
            <div className="space-y-2 pt-2">
              <div className="h-4 w-56 bg-muted/30 rounded animate-pulse" />
              <div className="h-4 w-40 bg-muted/30 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted/30 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-muted/50 rounded animate-pulse" />
          <div className="mt-2 h-4 w-48 bg-muted/30 rounded animate-pulse" />
        </div>
        <div className="h-9 w-20 bg-muted/30 rounded-lg animate-pulse" />
      </div>
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-16 bg-muted/30 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-muted/30 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}

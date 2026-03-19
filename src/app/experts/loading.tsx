export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="h-8 w-40 bg-muted/50 rounded animate-pulse" />
        <div className="mt-2 h-4 w-48 bg-muted/30 rounded animate-pulse" />
      </div>
      <div className="mb-6">
        <div className="inline-flex gap-1 rounded-lg bg-muted/30 p-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-16 bg-muted/50 rounded-md animate-pulse" />
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-muted/30 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}

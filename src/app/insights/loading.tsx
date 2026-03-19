export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="h-8 w-32 bg-muted/50 rounded animate-pulse" />
        <div className="mt-2 h-4 w-64 bg-muted/30 rounded animate-pulse" />
      </div>
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-muted/30 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-muted/30 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <div>
          <div className="h-8 w-32 bg-muted/50 rounded animate-pulse" />
          <div className="mt-2 h-4 w-48 bg-muted/30 rounded animate-pulse" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted/30 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div>
          <div className="h-6 w-36 bg-muted/50 rounded animate-pulse mb-5" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="min-w-[180px] flex-1">
                <div className="h-12 bg-muted/30 rounded-xl animate-pulse mb-3" />
                <div className="h-24 bg-muted/20 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

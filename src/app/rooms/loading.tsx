export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="h-8 w-48 bg-muted/50 rounded animate-pulse mb-2" />
      <div className="h-4 w-32 bg-muted/30 rounded animate-pulse mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted/30 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}

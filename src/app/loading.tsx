export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 animate-pulse" />
        <p className="text-sm text-muted-foreground animate-pulse">
          로딩 중...
        </p>
      </div>
    </div>
  )
}

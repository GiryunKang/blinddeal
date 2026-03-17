"use client"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-background text-foreground">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            문제가 발생했습니다
          </h1>
          <p className="mt-2 text-muted-foreground">
            예기치 않은 오류가 발생했습니다.
          </p>
          <button
            onClick={reset}
            className="mt-8 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  )
}

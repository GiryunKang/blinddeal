import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-2 text-muted-foreground">
        요청하신 페이지가 존재하지 않거나, 이동되었을 수 있습니다.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          홈으로
        </Link>
        <Link
          href="/deals"
          className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          딜 둘러보기
        </Link>
      </div>
    </div>
  )
}

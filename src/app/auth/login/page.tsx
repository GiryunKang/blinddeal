import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form";
import { AuthLeftPanel } from "@/components/auth/auth-left-panel";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "로그인" }

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel -- animated client component */}
      <AuthLeftPanel />

      {/* Right Panel -- Login Form */}
      <div className="flex w-full items-center justify-center bg-background px-6 lg:w-1/2">
        <div className="w-full max-w-[420px]">
          {/* Mobile back link */}
          <div className="mb-6 lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              홈으로 돌아가기
            </Link>
          </div>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

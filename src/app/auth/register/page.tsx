import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form";
import { AuthLeftPanel } from "@/components/auth/auth-left-panel";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "회원가입" }

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel -- animated client component */}
      <AuthLeftPanel />

      {/* Right Panel -- Register Form */}
      <div className="flex w-full items-center justify-center bg-background px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-[420px]">
          {/* Mobile back link */}
          <div className="mb-6 lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              홈으로 돌아가기
            </Link>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

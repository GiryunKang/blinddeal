import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { Shield, Wallet, Users, ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "로그인" }

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel — hidden on mobile */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-12 lg:flex">
        {/* Subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Animated gradient orb */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-purple-500/20 blur-[120px]" />
        </div>

        {/* Top — Logo + Home link */}
        <div className="relative z-10 space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <span className="text-base font-bold text-white">B</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">
              BlindDeal
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/70"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            홈으로 돌아가기
          </Link>
        </div>

        {/* Center — Tagline & Features */}
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">
              보이지 않는 곳에서
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                가장 큰 거래가
              </span>
              <br />
              이루어집니다
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-white/50">
              부동산과 M&A 거래를 위한 프리미엄 비공개 플랫폼
            </p>
          </div>

          <div className="space-y-5">
            <FeatureBullet
              icon={<Shield className="h-5 w-5" />}
              title="비공개 딜"
              description="검증된 참여자만 접근 가능한 프리미엄 거래"
            />
            <FeatureBullet
              icon={<Wallet className="h-5 w-5" />}
              title="에스크로 안심결제"
              description="안전한 결제 시스템으로 거래 보호"
            />
            <FeatureBullet
              icon={<Users className="h-5 w-5" />}
              title="전문가 네트워크"
              description="업계 최고의 전문가 그룹과 함께"
            />
          </div>
        </div>

        {/* Bottom — Copyright */}
        <div className="relative z-10">
          <p className="text-xs text-white/30">
            &copy; 2026 BlindDeal. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex w-full items-center justify-center bg-background px-6 lg:w-1/2">
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
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function FeatureBullet({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-blue-400 ring-1 ring-white/[0.08]">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-0.5 text-xs text-white/40">{description}</p>
      </div>
    </div>
  );
}

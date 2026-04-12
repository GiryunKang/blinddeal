"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, ArrowLeft, Shield, Wallet, Users } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    // Redirect to login with success message
    router.push("/auth/login?message=password_changed");
  }

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
              부동산과 M&A 딜 정보를 연결하는 프리미엄 비공개 플랫폼
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
              title="안전 거래 파트너 연결"
              description="신뢰할 수 있는 에스크로 파트너 연결"
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

      {/* Right Panel — Form */}
      <div className="flex w-full items-center justify-center bg-background px-6 lg:w-1/2">
        <div className="w-full max-w-[420px] space-y-8">
          {/* Mobile-only logo */}
          <div className="text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <span className="text-lg font-bold text-white">B</span>
            </div>
            <h1 className="text-xl font-bold">BlindDeal</h1>
          </div>

          {/* Mobile back link */}
          <div className="lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              홈으로 돌아가기
            </Link>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">새 비밀번호 설정</h2>
            <p className="text-sm text-muted-foreground">
              새로운 비밀번호를 입력해주세요
            </p>
          </div>

          {/* Glass card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New password field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                  새 비밀번호
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="새 비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 transition-all duration-300 placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">8자 이상</p>
              </div>

              {/* Confirm password field */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-xs font-medium text-muted-foreground">
                  비밀번호 확인
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 transition-all duration-300 placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-5 font-medium text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-110 disabled:opacity-50"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                비밀번호 변경하기
              </Button>
            </form>
          </div>
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

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";

function getPasswordStrength(pw: string): {
  score: number;
  label: string;
  color: string;
  textColor: string;
} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "약함", color: "bg-red-500", textColor: "text-red-400" };
  if (score <= 2) return { score, label: "보통", color: "bg-amber-500", textColor: "text-amber-400" };
  return { score, label: "강함", color: "bg-emerald-500", textColor: "text-emerald-400" };
}

export function RegisterForm() {
  const router = useRouter();
  const [userType, setUserType] = useState<"individual" | "corporation">(
    "individual"
  );
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const isPasswordValid = strength.score >= 4;

  function validatePassword(pw: string): string | null {
    if (pw.length < 8) return "비밀번호는 최소 8자 이상이어야 합니다.";
    if (!/[A-Z]/.test(pw)) return "대문자를 최소 1개 포함해야 합니다.";
    if (!/[0-9]/.test(pw)) return "숫자를 최소 1개 포함해야 합니다.";
    if (!/[^A-Za-z0-9]/.test(pw))
      return "특수문자를 최소 1개 포함해야 합니다.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!agreedToTerms) {
      setError("이용약관에 동의해주세요.");
      setLoading(false);
      return;
    }

    const pwError = validatePassword(password);
    if (pwError) {
      setError(pwError);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          user_type: userType,
          company_name: userType === "corporation" ? companyName : null,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/auth/verify-email");
    router.refresh();
  }

  return (
    <div className="w-full max-w-[420px] space-y-8">
      {/* Mobile-only logo */}
      <div className="text-center lg:hidden">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
          <span className="text-lg font-bold text-white">B</span>
        </div>
        <h1 className="text-xl font-bold">BlindDeal</h1>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">회원가입</h2>
        <p className="text-sm text-muted-foreground">
          BlindDeal에 가입하고 거래를 시작하세요
        </p>
      </div>

      {/* Glass card */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <SocialLoginButtons />

          {/* User type tabs */}
          <div className="flex rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
            <button
              type="button"
              onClick={() => setUserType("individual")}
              className={cn(
                "relative flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-300",
                userType === "individual"
                  ? "bg-white/[0.06] text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground/80"
              )}
            >
              <span className="relative z-10">개인</span>
              {userType === "individual" && (
                <div className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setUserType("corporation")}
              className={cn(
                "relative flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-300",
                userType === "corporation"
                  ? "bg-white/[0.06] text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground/80"
              )}
            >
              <span className="relative z-10">기업</span>
              {userType === "corporation" && (
                <div className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
              )}
            </button>
          </div>

          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-xs font-medium text-muted-foreground">
              {userType === "corporation" ? "담당자 이름" : "이름"}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                id="displayName"
                type="text"
                placeholder={userType === "corporation" ? "담당자 이름" : "표시 이름"}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 transition-all duration-300 placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Company name — only for corporation */}
          {userType === "corporation" && (
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-xs font-medium text-muted-foreground">
                회사명
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  id="companyName"
                  type="text"
                  placeholder="회사명을 입력하세요"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 transition-all duration-300 placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
              이메일
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 transition-all duration-300 placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
              비밀번호
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                id="password"
                type="password"
                placeholder="8자 이상, 대문자/숫자/특수문자 포함"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 transition-all duration-300 placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            {/* Password strength bar */}
            {password.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-all duration-500 ease-out",
                        i < strength.score ? strength.color : "bg-white/[0.06]"
                      )}
                    />
                  ))}
                </div>
                <p className={cn("text-xs", strength.textColor)}>
                  {strength.label}
                </p>
                {strength.score < 4 && (
                  <ul className="mt-1 space-y-0.5 text-[11px] text-muted-foreground">
                    <li className={password.length >= 8 ? "text-emerald-400" : ""}>
                      {password.length >= 8 ? "\u2713" : "\u2022"} 8자 이상
                    </li>
                    <li className={/[A-Z]/.test(password) ? "text-emerald-400" : ""}>
                      {/[A-Z]/.test(password) ? "\u2713" : "\u2022"} 대문자 1개 이상
                    </li>
                    <li className={/[0-9]/.test(password) ? "text-emerald-400" : ""}>
                      {/[0-9]/.test(password) ? "\u2713" : "\u2022"} 숫자 1개 이상
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(password) ? "text-emerald-400" : ""}>
                      {/[^A-Za-z0-9]/.test(password) ? "\u2713" : "\u2022"} 특수문자 1개 이상
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Terms checkbox */}
          <label className="flex cursor-pointer items-start gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={agreedToTerms}
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-300",
                agreedToTerms
                  ? "border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-500 text-white"
                  : "border-white/[0.15] bg-white/[0.03] hover:border-white/[0.25]"
              )}
            >
              {agreedToTerms && <Check className="h-3 w-3" />}
            </button>
            <span className="text-xs leading-relaxed text-muted-foreground">
              <Link href="/terms" className="text-blue-400 hover:text-blue-300">이용약관</Link>
              {" "}및{" "}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300">개인정보처리방침</Link>
              에 동의합니다
            </span>
          </label>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-5 font-medium text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-110 disabled:opacity-50"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            회원가입
          </Button>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-blue-400 transition-colors duration-300 hover:text-blue-300"
            >
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

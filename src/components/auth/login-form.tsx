"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || "/";
  const redirect = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : "/";
  const message = searchParams.get("message");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failCount, setFailCount] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (failCount >= 5) {
      setError("로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setLoading(true);

    if (failCount > 0) {
      await new Promise((r) => setTimeout(r, Math.min(failCount * 2000, 10000)));
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setFailCount((c) => c + 1);
      setError(
        authError.message === "Invalid login credentials"
          ? "이메일 또는 비밀번호가 올바르지 않습니다."
          : authError.message
      );
      setLoading(false);
      return;
    }

    setFailCount(0);

    // Check if onboarding is completed
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .single();

    if (profile && !profile.onboarding_completed) {
      router.push("/auth/onboarding");
    } else {
      router.push(redirect);
    }
    router.refresh();
  }

  return (
    <motion.div
      className="w-full max-w-[420px] space-y-8"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Mobile-only logo */}
      <div className="text-center lg:hidden">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
          <span className="text-lg font-bold text-white">B</span>
        </div>
        <h1 className="text-xl font-bold">BlindDeal</h1>
      </div>

      {/* Header */}
      <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h2 className="text-2xl font-bold tracking-tight" variants={itemVariants}>로그인</motion.h2>
        <motion.p className="text-sm text-muted-foreground" variants={itemVariants}>
          계정에 로그인하고 거래를 이어가세요
        </motion.p>
      </motion.div>

      {/* Password changed success */}
      {message === "password_changed" && (
        <motion.div
          className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
          <p className="text-sm text-emerald-400">비밀번호가 변경되었습니다. 새 비밀번호로 로그인하세요.</p>
        </motion.div>
      )}

      {/* Glass card with animated gradient border */}
      <motion.div className="relative rounded-2xl p-[1px]" variants={containerVariants} initial="hidden" animate="visible">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 opacity-0 transition-opacity duration-500 hover:opacity-100" />
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 transition-all duration-300 placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20" />
              </div>
            </motion.div>

            {/* Password field */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <Input id="password" type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 transition-all duration-300 placeholder:text-muted-foreground/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20" />
              </div>
            </motion.div>

            {/* Forgot password */}
            <motion.div className="-mt-2 flex justify-end" variants={itemVariants}>
              <Link href="/auth/forgot-password" className="group relative inline-flex min-h-[44px] items-center py-3 text-xs text-muted-foreground transition-colors duration-300 hover:text-blue-400">
                비밀번호를 잊으셨나요?
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-blue-400/50 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </motion.div>

            {/* Error */}
            {error && (
              <motion.div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}

            {/* Submit button */}
            <motion.div variants={itemVariants}>
              <motion.button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-50" whileHover={{ scale: 1.01, boxShadow: "0 20px 40px -12px rgba(59,130,246,0.35)" }} whileTap={{ scale: 0.98 }}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                로그인
              </motion.button>
            </motion.div>

            {/* Register link */}
            <motion.p className="text-center text-sm text-muted-foreground" variants={itemVariants}>
              계정이 없으신가요?{" "}
              <Link href="/auth/register" className="group relative inline-flex min-h-[44px] items-center py-3 font-medium text-blue-400 transition-colors duration-300 hover:text-blue-300">
                회원가입
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-blue-400/50 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </motion.p>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

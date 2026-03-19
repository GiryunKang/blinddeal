"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function KakaoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="10" fill="#FEE500" />
      <path
        d="M10 5C6.68629 5 4 7.10325 4 9.69412C4 11.3529 5.10819 12.8044 6.78952 13.6176L6.2 15.8C6.17 15.91 6.29 16 6.39 15.94L9.01 14.28C9.33 14.32 9.66 14.3412 10 14.3412C13.3137 14.3412 16 12.285 16 9.69412C16 7.10325 13.3137 5 10 5Z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.171 8.368h-.67v-.035H10v3.333h4.709A4.998 4.998 0 0 1 5 10a5 5 0 0 1 5-5c1.275 0 2.434.48 3.317 1.266l2.357-2.357A8.295 8.295 0 0 0 10 1.667a8.333 8.333 0 1 0 8.171 6.7Z"
        fill="#FFC107"
      />
      <path
        d="M2.628 6.121l2.74 2.009A4.998 4.998 0 0 1 10 5c1.275 0 2.434.48 3.317 1.266l2.357-2.357A8.295 8.295 0 0 0 10 1.667a8.329 8.329 0 0 0-7.372 4.454Z"
        fill="#FF3D00"
      />
      <path
        d="M10 18.333a8.294 8.294 0 0 0 5.587-2.163l-2.579-2.183A4.963 4.963 0 0 1 10 15a4.998 4.998 0 0 1-4.701-3.319l-2.717 2.092A8.327 8.327 0 0 0 10 18.333Z"
        fill="#4CAF50"
      />
      <path
        d="M18.171 8.368H17.5v-.035H10v3.333h4.709a5.018 5.018 0 0 1-1.703 2.321l2.58 2.183c-.182.166 2.747-2.003 2.747-6.17 0-.559-.057-1.104-.162-1.632Z"
        fill="#1976D2"
      />
    </svg>
  );
}

export function SocialLoginButtons() {
  async function handleKakaoLogin() {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        toast.error("소셜 로그인 설정이 준비 중입니다. 이메일로 가입해주세요.");
      }
    } catch {
      toast.error("소셜 로그인 설정이 준비 중입니다. 이메일로 가입해주세요.");
    }
  }

  async function handleGoogleLogin() {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        toast.error("소셜 로그인 설정이 준비 중입니다. 이메일로 가입해주세요.");
      }
    } catch {
      toast.error("소셜 로그인 설정이 준비 중입니다. 이메일로 가입해주세요.");
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 rounded-xl border-white/[0.08] bg-white/[0.03] py-5 transition-all duration-300 hover:border-yellow-500/30 hover:bg-yellow-500/5 hover:shadow-lg hover:shadow-yellow-500/5"
          onClick={handleKakaoLogin}
        >
          <KakaoIcon /> 카카오로 시작하기
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 rounded-xl border-white/[0.08] bg-white/[0.03] py-5 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.05] hover:shadow-lg hover:shadow-white/5"
          onClick={handleGoogleLogin}
        >
          <GoogleIcon /> Google로 시작하기
        </Button>
      </div>
      {/* Separator */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.06]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-xs text-muted-foreground/50">또는</span>
        </div>
      </div>
    </>
  );
}

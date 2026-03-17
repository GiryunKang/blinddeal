"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleResend() {
    setResending(true);
    setError(null);
    setResent(false);

    const supabase = createClient();

    // Get the current user's email from the session or URL params
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const email = session?.user?.email;

    if (!email) {
      setError(
        "이메일 주소를 찾을 수 없습니다. 다시 회원가입을 시도해주세요."
      );
      setResending(false);
      return;
    }

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (resendError) {
      setError(resendError.message);
    } else {
      setResent(true);
    }

    setResending(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-border/50 bg-gradient-to-br from-card to-card/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl">이메일을 확인해주세요</CardTitle>
          <CardDescription className="mt-2">
            가입하신 이메일로 인증 링크를 보냈습니다.
            <br />
            이메일을 확인하고 링크를 클릭해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {resent && (
            <p className="text-center text-sm text-green-600 dark:text-green-400">
              인증 이메일을 다시 보냈습니다. 이메일을 확인해주세요.
            </p>
          )}

          {error && (
            <p className="text-center text-sm text-destructive">{error}</p>
          )}

          <div className="text-center">
            <p className="mb-3 text-sm text-muted-foreground">
              이메일을 받지 못하셨나요?
            </p>
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={resending}
              className="w-full"
            >
              {resending && <Loader2 className="animate-spin" />}
              인증 이메일 다시 보내기
            </Button>
          </div>

          <Link href="/auth/login" className="w-full">
            <Button variant="ghost" className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              로그인으로 돌아가기
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

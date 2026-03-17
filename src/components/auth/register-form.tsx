"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function getPasswordStrength(pw: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "약함", color: "bg-red-500" };
  if (score <= 2) return { score, label: "보통", color: "bg-amber-500" };
  return { score, label: "강함", color: "bg-emerald-500" };
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

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

    router.push("/auth/onboarding");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md border-border/50 bg-gradient-to-br from-card to-card/50">
      <CardHeader className="text-center">
        {/* BlindDeal Logo */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
          <span className="text-lg font-bold text-white">B</span>
        </div>
        <CardTitle className="text-xl">회원가입</CardTitle>
        <CardDescription>
          BlindDeal에 가입하고 거래를 시작하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Tabs
            value={userType}
            onValueChange={(val) =>
              setUserType(val as "individual" | "corporation")
            }
          >
            <TabsList className="w-full">
              <TabsTrigger value="individual" className="flex-1">
                개인
              </TabsTrigger>
              <TabsTrigger value="corporation" className="flex-1">
                법인
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual" className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="displayName-ind">이름</Label>
                <Input
                  id="displayName-ind"
                  type="text"
                  placeholder="표시 이름"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent
              value="corporation"
              className="mt-4 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="displayName-corp">담당자 이름</Label>
                <Input
                  id="displayName-corp"
                  type="text"
                  placeholder="담당자 이름"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="companyName">회사명</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="회사명을 입력하세요"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="8자 이상, 대문자·숫자·특수문자 포함"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            {password.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-all",
                        i < strength.score ? strength.color : "bg-border"
                      )}
                    />
                  ))}
                </div>
                <p
                  className={cn(
                    "text-xs",
                    strength.score <= 1
                      ? "text-red-400"
                      : strength.score <= 2
                        ? "text-amber-400"
                        : "text-emerald-400"
                  )}
                >
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="animate-spin" />}
            회원가입
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/auth/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              로그인
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

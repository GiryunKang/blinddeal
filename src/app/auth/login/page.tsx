import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "로그인" }

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}

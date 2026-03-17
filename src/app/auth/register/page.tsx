import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "회원가입" }

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <RegisterForm />
    </div>
  );
}

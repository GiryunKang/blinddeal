import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function sanitizeRedirect(path: string | null): string {
  if (!path) return "/"
  const trimmed = path.trim()
  if (!trimmed.startsWith("/")) return "/"
  if (trimmed.startsWith("//")) return "/"
  if (trimmed.includes("\\")) return "/"
  if (trimmed.toLowerCase().startsWith("javascript:")) return "/"
  if (trimmed.toLowerCase().startsWith("data:")) return "/"
  if (trimmed.includes("\0")) return "/"
  return trimmed
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeRedirect(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login`);
}

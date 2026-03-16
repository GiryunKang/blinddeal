"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Settings, User as UserIcon } from "lucide-react";

const navLinks = [
  { href: "/deals", label: "마켓" },
  { href: "/insights", label: "인사이트" },
  { href: "/community", label: "커뮤니티" },
  { href: "/experts", label: "전문가" },
];

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const displayName =
    user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <span className="text-sm font-bold text-white">B</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            BlindDeal
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                render={<Link href="/notifications" />}
              >
                <Bell className="size-4" />
              </Button>

              {/* New Deal */}
              <Button size="sm" render={<Link href="/deals/new" />}>
                딜 등록
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer outline-none">
                  <Avatar size="sm">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={displayName}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8}>
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">
                        {displayName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                  >
                    <UserIcon />
                    프로필
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                  >
                    <Settings />
                    설정
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              render={<Link href="/auth/login" />}
            >
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

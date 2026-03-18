"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell, LogOut, Settings, User as UserIcon, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const publicNavLinks = [
  { href: "/deals", label: "마켓" },
  { href: "/insights", label: "인사이트" },
  { href: "/community", label: "커뮤니티" },
  { href: "/experts", label: "전문가" },
];

const authNavLinks = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/deals", label: "마켓" },
  { href: "/deals/matched", label: "맞춤 딜" },
  { href: "/insights", label: "인사이트" },
  { href: "/community", label: "커뮤니티" },
  { href: "/experts", label: "전문가" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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
  const navLinks = user ? authNavLinks : publicNavLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 transition-shadow duration-300 group-hover:shadow-blue-500/40">
            <span className="text-sm font-bold text-white">B</span>
          </div>
          <span className="text-lg font-semibold tracking-tight transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-400 group-hover:bg-clip-text group-hover:text-transparent">
            BlindDeal
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative rounded-lg px-3 py-2 text-sm transition-colors duration-300",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
              {/* Gradient underline animation */}
              <span
                className={cn(
                  "absolute inset-x-1 -bottom-[1px] h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out",
                  pathname === link.href
                    ? "w-auto opacity-100"
                    : "w-0 opacity-0 group-hover:w-auto group-hover:opacity-70"
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              {/* Notifications */}
              <Link href="/notifications">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-xl text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  <Bell className="h-[18px] w-[18px]" />
                  {/* Notification badge dot */}
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                </Button>
              </Link>

              {/* New Deal button */}
              <Link href="/deals/new" className="hidden sm:block">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 rounded-xl border-blue-500/30 bg-transparent text-blue-400 transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-blue-300 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <Plus className="h-4 w-4" />
                  딜 등록
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer outline-none">
                  <Avatar className="h-8 w-8 ring-2 ring-white/[0.06] transition-all duration-300 hover:ring-white/[0.15]">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={displayName}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-xs font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-56 rounded-xl border-white/[0.08] bg-background/95 backdrop-blur-xl"
                >
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
                  <DropdownMenuSeparator className="bg-white/[0.06]" />
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="rounded-lg transition-colors duration-200"
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    프로필
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="rounded-lg transition-colors duration-200"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    설정
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/[0.06]" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="rounded-lg text-red-400 transition-colors duration-200 focus:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger className="md:hidden">
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="border-white/[0.06] bg-background/95 backdrop-blur-xl"
                >
                  <SheetHeader>
                    <SheetTitle>메뉴</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6 flex flex-col gap-1 px-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                          pathname === link.href
                            ? "bg-white/[0.06] text-foreground"
                            : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      href="/deals/new"
                      onClick={() => setMobileOpen(false)}
                      className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/25"
                    >
                      <Plus className="h-4 w-4" />
                      딜 등록
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              {/* Mobile menu for non-auth */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger className="md:hidden">
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="border-white/[0.06] bg-background/95 backdrop-blur-xl"
                >
                  <SheetHeader>
                    <SheetTitle>메뉴</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6 flex flex-col gap-1 px-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                          pathname === link.href
                            ? "bg-white/[0.06] text-foreground"
                            : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="mt-4 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/25"
                    >
                      로그인
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>

              <Link href="/auth/login" className="hidden md:block">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-white/[0.1] bg-transparent transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.05]"
                >
                  로그인
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKRW(amount: number | null): string {
  if (amount === null || amount === undefined) return "협의 후 공개";
  if (amount >= 1_000_000_000_000) return `₩${(amount / 1_000_000_000_000).toFixed(1)}T`;
  if (amount >= 100_000_000) return `${Math.round(amount / 100_000_000).toLocaleString()}억원`;
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(
  date: Date | string,
  pattern: string = "yyyy.MM.dd"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, pattern, { locale: ko });
}

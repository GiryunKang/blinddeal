import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKRW(amount: number): string {
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

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { Locale } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKRW(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return "협의 후 공개";
  if (amount >= 1_000_000_000_000) {
    const jo = amount / 1_000_000_000_000;
    return `${jo % 1 === 0 ? jo.toFixed(0) : jo.toFixed(1)}조원`;
  }
  if (amount >= 100_000_000) {
    const eok = amount / 100_000_000;
    return `${eok % 1 === 0 ? eok.toFixed(0) : eok.toFixed(1)}억원`;
  }
  if (amount >= 10_000) {
    const man = amount / 10_000;
    return `${man % 1 === 0 ? man.toFixed(0) : man.toFixed(1)}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export function formatDate(
  date: Date | string | null | undefined,
  pattern: string = "yyyy.MM.dd",
  locale_opt?: Locale
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  return format(d, pattern, { locale: locale_opt ?? ko });
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const serviceLinks = [
  { href: "/deals", label: "딜 마켓플레이스" },
  { href: "/insights", label: "인사이트" },
  { href: "/community", label: "커뮤니티" },
  { href: "/experts", label: "전문가" },
];

const companyLinks = [
  { href: "/about", label: "회사 소개" },
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/escrow-guide", label: "에스크로 안내" },
];

const supportLinks = [
  { href: "mailto:83482@daum.net", label: "문의하기" },
  { href: "/community", label: "게시판" },
  { href: "/about", label: "회사 소개" },
];

const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <motion.div variants={fadeInUp} className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="group relative inline-block text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              <span className="relative">
                {link.label}
                {/* Underline on hover */}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/30 bg-background">
      {/* Subtle glass-like top border glow */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-20 w-[600px] -translate-x-1/2 rounded-full opacity-30" style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.08), transparent 70%)", filter: "blur(30px)" }} />

      <div className="relative mx-auto max-w-7xl px-4 py-14">
        <motion.div
          className="grid gap-10 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerStagger}
        >
          {/* Brand */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                <span className="text-sm font-bold text-white">B</span>
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-lg font-semibold tracking-tight text-transparent">
                BlindDeal
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              부동산 &middot; M&amp;A 전문 거래 플랫폼
            </p>
          </motion.div>

          {/* Link columns */}
          <FooterLinkColumn title="서비스" links={serviceLinks} />
          <FooterLinkColumn title="회사" links={companyLinks} />
          <FooterLinkColumn title="고객지원" links={supportLinks} />
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-14 border-t border-border/30 pt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground/60">
              &copy; 2026 BlindDeal. All rights reserved. | 대표: 강기륜
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-xs text-muted-foreground/50 transition-colors hover:text-muted-foreground">
                이용약관
              </Link>
              <span className="h-3 w-px bg-border/30" />
              <Link href="/privacy" className="text-xs text-muted-foreground/50 transition-colors hover:text-muted-foreground">
                개인정보처리방침
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

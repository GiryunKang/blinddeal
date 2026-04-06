import Link from "next/link";

const serviceLinks = [
  { href: "/deals", label: "딜 마켓플레이스" },
  { href: "/insights", label: "인사이트" },
  { href: "/community", label: "커뮤니티" },
  { href: "/experts", label: "전문가" },
];

const companyLinks = [
  { href: "/about", label: "회사 소개" },
  { href: "/service", label: "서비스 소개" },
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/escrow-guide", label: "에스크로 안내" },
];

const supportLinks = [
  { href: "mailto:83482@daum.net", label: "문의하기" },
  { href: "/community", label: "게시판" },
  { href: "/about", label: "회사 소개" },
];

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="space-y-4">
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
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/30 bg-background">
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                <span className="text-sm font-bold text-white">B</span>
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-lg font-semibold tracking-tight text-transparent">
                BlindDeal
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              부동산 &middot; M&amp;A 딜 정보 플랫폼
            </p>
          </div>

          <FooterLinkColumn title="서비스" links={serviceLinks} />
          <FooterLinkColumn title="회사" links={companyLinks} />
          <FooterLinkColumn title="고객지원" links={supportLinks} />
        </div>

        <div className="mt-14 border-t border-border/30 pt-6">
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
        </div>
      </div>
    </footer>
  );
}

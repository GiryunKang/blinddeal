import Link from "next/link";

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
  { href: "/contact", label: "문의하기" },
  { href: "/faq", label: "FAQ" },
  { href: "/notices", label: "공지사항" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <span className="text-sm font-bold text-white">B</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                BlindDeal
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              부동산 &middot; M&amp;A 전문 거래 플랫폼
            </p>
          </div>

          {/* Service Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">서비스</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">회사</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">고객지원</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border/30 pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; 2026 BlindDeal. All rights reserved. | 사업자등록번호:
            000-00-00000 | 대표: 강기륜
          </p>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { PWARegister } from "@/components/pwa-register";
import { BASE_URL } from "@/lib/constants";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BlindDeal",
  },
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'BlindDeal — 부동산 · M&A 전문 거래 플랫폼',
    template: '%s | BlindDeal'
  },
  description: '부동산과 M&A 딜을 공개 또는 비공개로 안전하게 거래하세요. 검증된 상대방과 에스크로 결제, NDA, 전문가 네트워크를 통한 풀 프로세스 거래 플랫폼.',
  keywords: ['부동산', 'M&A', '딜', '거래', '투자', '에스크로', 'BlindDeal', '블라인드딜'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: BASE_URL,
    siteName: 'BlindDeal',
    title: 'BlindDeal — 부동산 · M&A 전문 거래 플랫폼',
    description: '부동산과 M&A 딜을 공개 또는 비공개로 안전하게 거래하세요.',
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("dark", "font-sans", geist.variable)}>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors closeButton />
        <PWARegister />
      </body>
    </html>
  );
}

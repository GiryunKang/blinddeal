import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  EyeOff,
  Shield,
  FileCheck,
  MessageSquare,
  ClipboardCheck,
  Wallet,
  Users,
  Target,
  TrendingUp,
  ArrowRight,
  Search,
  Handshake,
  FileSignature,
  Scale,
  CheckCircle2,
  Lock,
  Eye,
  Mail,
} from "lucide-react";
import { LandingHeader } from "@/components/layout/landing-header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { TextReveal } from "@/components/effects/text-reveal";

export const metadata: Metadata = {
  title: "서비스 소개",
  description:
    "BlindDeal의 철학, 핵심 기능, 딜 프로세스를 소개합니다. 부동산과 M&A 딜의 새로운 기준.",
};

/* ─── Data ─── */

const painPoints = [
  {
    number: "01",
    title: "정보 비대칭",
    accent: "blue",
    description:
      "기존 딜 시장에서는 정보를 가진 쪽이 유리합니다. 매도자는 매수자의 자격을 알 수 없고, 매수자는 딜의 실체를 확인할 수 없습니다. BlindDeal은 양측 모두에게 검증된 정보만을 제공합니다.",
  },
  {
    number: "02",
    title: "프라이버시 부재",
    accent: "indigo",
    description:
      "대형 딜을 진행할 때 정보 유출은 치명적입니다. 기존 방식으로는 딜 정보가 통제 없이 퍼져나갑니다. BlindDeal은 NDA 기반의 단계적 정보 공개로 이를 해결합니다.",
  },
  {
    number: "03",
    title: "파편화된 프로세스",
    accent: "purple",
    description:
      "매칭, 협상, 실사, 계약이 모두 다른 채널에서 이루어집니다. BlindDeal은 하나의 플랫폼에서 에스크로 파트너 연결까지 딜 프로세스 전체를 지원합니다.",
  },
];

const features = [
  {
    icon: EyeOff,
    title: "공개/비공개 딜 이중 구조",
    description:
      "딜 등록자가 공개 범위를 직접 결정합니다. 공개 딜은 검증된 모든 사용자가 열람할 수 있고, 비공개 딜은 인증 등급 기준을 충족한 사용자에게만 노출됩니다.",
    color: "blue",
  },
  {
    icon: Shield,
    title: "4단계 인증 체계",
    description:
      "Level 0(이메일 가입) → Level 1(본인인증) → Level 2(사업자 확인) → Level 3(자산 증빙) → Level 4(외부 기관 검증). 매수자의 인증 등급이 높을수록 더 큰 규모의 비공개 딜에 접근할 수 있습니다.",
    color: "indigo",
  },
  {
    icon: FileCheck,
    title: "비밀유지계약(NDA) 전자 서명",
    description:
      "비공개 딜의 상세 정보를 열람하려면 법적 구속력이 있는 NDA에 전자 서명해야 합니다. 서명 시 IP 주소, 타임스탬프가 자동 기록되어 법적 증거력을 확보합니다.",
    color: "cyan",
  },
  {
    icon: MessageSquare,
    title: "딜룸 — 안전한 협상 공간",
    description:
      "매도자와 매수자가 플랫폼 내에서 직접 소통합니다. 메시지, 파일 공유, 인수의향서(LOI) 교환까지 하나의 공간에서 이루어집니다.",
    color: "purple",
  },
  {
    icon: ClipboardCheck,
    title: "실사(Due Diligence) 워크플로우",
    description:
      "법률, 재무, 운영, 시장 분석 등 카테고리별 체크리스트를 자동 생성합니다. 전문가를 배정하고, 실사 진행 상황을 실시간으로 추적합니다.",
    color: "blue",
  },
  {
    icon: Wallet,
    title: "안전 거래 파트너 연결",
    description:
      "거래 규모에 맞는 에스크로 파트너(은행, 법무법인, 신탁회사)를 연결합니다. 자금 관리는 파트너가 직접 수행합니다.",
    color: "indigo",
  },
  {
    icon: Users,
    title: "전문가 네트워크",
    description:
      "법무법인, 회계법인, 세무법인, 감정평가법인 등 검증된 전문가가 실사부터 계약까지 지원합니다.",
    color: "cyan",
  },
  {
    icon: Target,
    title: "맞춤 딜 매칭",
    description:
      "관심 분야, 투자 규모, 지역 등을 설정하면 조건에 맞는 딜을 자동으로 추천합니다. 새로운 딜이 등록되면 알림을 받을 수 있습니다.",
    color: "purple",
  },
  {
    icon: TrendingUp,
    title: "시장 인사이트 & 커뮤니티",
    description:
      "부동산 시세 동향, M&A 시장 분석, 업종별 리포트 등 데이터 기반 인사이트를 제공합니다. 투자자 간 토론, Q&A, 딜 후기를 공유하는 커뮤니티도 운영합니다.",
    color: "blue",
  },
];

const processSteps = [
  {
    number: 1,
    icon: FileSignature,
    title: "딜 등록",
    description: "매도자가 딜 정보를 등록하고 공개 범위를 설정합니다.",
  },
  {
    number: 2,
    icon: Search,
    title: "검증 & 매칭",
    description: "플랫폼이 딜을 검증하고 조건에 맞는 매수자를 매칭합니다.",
  },
  {
    number: 3,
    icon: Lock,
    title: "NDA 서명",
    description: "매수자가 NDA에 전자 서명 후 상세 정보를 열람합니다.",
  },
  {
    number: 4,
    icon: Handshake,
    title: "협상 & LOI",
    description: "딜룸에서 협상을 진행하고 인수의향서를 교환합니다.",
  },
  {
    number: 5,
    icon: ClipboardCheck,
    title: "실사",
    description: "법률, 재무, 운영 등 전문가 팀이 실사를 수행합니다.",
  },
  {
    number: 6,
    icon: Scale,
    title: "계약",
    description: "최종 계약 조건을 확정하고 계약서에 서명합니다.",
  },
  {
    number: 7,
    icon: Wallet,
    title: "안전 거래",
    description: "에스크로 파트너를 통해 안전하게 거래를 진행합니다.",
  },
  {
    number: 8,
    icon: CheckCircle2,
    title: "거래 완료",
    description: "소유권 이전 후 에스크로 파트너를 통해 대금이 전달됩니다.",
  },
];

const commitments = [
  {
    icon: Eye,
    title: "투명한 거래",
    description: "거래의 모든 단계가 기록되고 추적 가능합니다.",
    gradient: "from-blue-500/20 to-blue-600/10",
    ring: "ring-blue-500/20",
    text: "text-blue-400",
  },
  {
    icon: Shield,
    title: "안전한 정보 보호",
    description: "NDA, 인증 체계, 에스크로 파트너 연결로 정보와 자금 안전을 지원합니다.",
    gradient: "from-indigo-500/20 to-indigo-600/10",
    ring: "ring-indigo-500/20",
    text: "text-indigo-400",
  },
  {
    icon: Users,
    title: "공정한 기회",
    description: "검증된 모든 참여자에게 동등한 거래 기회를 제공합니다.",
    gradient: "from-purple-500/20 to-purple-600/10",
    ring: "ring-purple-500/20",
    text: "text-purple-400",
  },
];

/* ─── Color helpers ─── */

function accentClasses(color: string) {
  const map: Record<string, { bg: string; ring: string; text: string; glow: string }> = {
    blue: {
      bg: "bg-gradient-to-br from-blue-500/20 to-blue-600/10",
      ring: "ring-blue-500/20 group-hover:ring-blue-500/40",
      text: "text-blue-400",
      glow: "rgba(59,130,246,0.08)",
    },
    indigo: {
      bg: "bg-gradient-to-br from-indigo-500/20 to-indigo-600/10",
      ring: "ring-indigo-500/20 group-hover:ring-indigo-500/40",
      text: "text-indigo-400",
      glow: "rgba(99,102,241,0.08)",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-500/20 to-purple-600/10",
      ring: "ring-purple-500/20 group-hover:ring-purple-500/40",
      text: "text-purple-400",
      glow: "rgba(139,92,246,0.08)",
    },
    cyan: {
      bg: "bg-gradient-to-br from-cyan-500/20 to-cyan-600/10",
      ring: "ring-cyan-500/20 group-hover:ring-cyan-500/40",
      text: "text-cyan-400",
      glow: "rgba(6,182,212,0.08)",
    },
  };
  return map[color] ?? map.blue;
}

/* ─── Page Component ─── */

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      {/* ────────────── Section 1: Hero — 우리의 철학 ────────────── */}
      <section className="relative overflow-hidden border-b border-border/30">
        {/* Background effects */}
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/8 blur-[120px]" />
        <div className="pointer-events-none absolute -top-20 left-1/4 h-[400px] w-[500px] rounded-full bg-indigo-500/8 blur-[100px]" />
        <div className="pointer-events-none absolute top-20 right-1/4 h-[300px] w-[400px] rounded-full bg-purple-500/6 blur-[100px]" />

        {/* Floating particles */}
        <div className="pointer-events-none absolute left-[10%] top-[20%] h-1 w-1 rounded-full bg-blue-400/40 float-particle" />
        <div
          className="pointer-events-none absolute left-[25%] top-[40%] h-1.5 w-1.5 rounded-full bg-indigo-400/30 float-particle"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="pointer-events-none absolute left-[70%] top-[15%] h-1 w-1 rounded-full bg-cyan-400/40 float-particle"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="pointer-events-none absolute left-[85%] top-[45%] h-1.5 w-1.5 rounded-full bg-purple-400/30 float-particle"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="pointer-events-none absolute left-[50%] top-[10%] h-1 w-1 rounded-full bg-blue-300/30 float-particle"
          style={{ animationDelay: "4s" }}
        />

        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-32 text-center md:pb-28 md:pt-40">
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-xs font-medium text-muted-foreground backdrop-blur-xl">
            <Shield className="h-3.5 w-3.5 text-blue-400" />
            <span>서비스 소개</span>
            <span className="h-1 w-1 rounded-full bg-blue-400 pulse-dot" />
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            <TextReveal delay={0}>모든 거래에는</TextReveal>
            <TextReveal delay={200}>
              <span className="gradient-text">신뢰</span>가
              필요합니다
            </TextReveal>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            부동산과 M&A 거래는 단순한 매매가 아닙니다.
            <br className="hidden md:block" />
            수십억, 수백억의 가치가 오가는 거래에서 가장 중요한 것은
            &lsquo;신뢰&rsquo;입니다.
            <br className="hidden md:block" />
            BlindDeal은 거래의 모든 과정에서 신뢰를 설계합니다.
          </p>
        </div>
      </section>

      {/* ────────────── Section 2: 왜 BlindDeal을 만들었는가 ────────────── */}
      <section className="relative border-b border-border/30">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Why BlindDeal
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                왜 BlindDeal을 만들었는가
              </h2>
              <p className="mt-4 text-muted-foreground">
                기존 딜 시장의 세 가지 근본적인 문제를 해결합니다
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {painPoints.map((point, i) => {
              const ac = accentClasses(point.accent);
              return (
                <ScrollReveal key={point.number} delay={i * 120}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.04]">
                    {/* Hover glow */}
                    <div
                      className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
                      style={{ background: ac.glow }}
                    />
                    <div className="relative">
                      <span
                        className={`text-5xl font-black ${ac.text} opacity-20`}
                      >
                        {point.number}
                      </span>
                      <h3 className="mt-2 text-xl font-bold">{point.title}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────────────── Section 3: 핵심 기능 소개 ────────────── */}
      <section className="relative border-b border-border/30">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/[0.02] via-indigo-500/[0.02] to-purple-500/[0.02]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Core Features
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                핵심 기능 소개
              </h2>
              <p className="mt-4 text-muted-foreground">
                안전하고 투명한 거래를 위한 9가지 핵심 기능
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const ac = accentClasses(feature.color);
              return (
                <ScrollReveal key={feature.title} delay={i * 80}>
                  <div className="hover-lift group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.04]">
                    {/* Hover glow */}
                    <div
                      className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
                      style={{ background: ac.glow }}
                    />
                    <div className="relative">
                      <div
                        className={`icon-glow flex h-12 w-12 items-center justify-center rounded-2xl ${ac.bg} ${ac.text} ring-1 ${ac.ring} transition-all`}
                      >
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold">
                        {feature.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────────────── 빠른 시작 가이드 ────────────── */}
      <section className="relative border-b border-border/30">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Quick Start Guide
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                빠른 시작 가이드
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                이 가이드를 따라하면 처음 이용하시는 분도 쉽게 BlindDeal을 시작할 수 있습니다.
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto mt-14 max-w-3xl">
            {[
              { step: "1", title: "회원가입 → 이메일 인증", desc: "이메일과 비밀번호로 간단히 가입하고, 이메일 인증을 완료하세요." },
              { step: "2", title: "프로필 설정 → 관심 분야 선택", desc: "프로필을 작성하고, 관심 있는 딜 분야와 투자 규모를 설정하세요." },
              { step: "3", title: "딜 등록 또는 딜 탐색", desc: "매도자라면 딜을 등록하고, 매수자라면 마켓플레이스에서 딜을 탐색하세요." },
              { step: "4", title: "관심 딜 발견 → NDA 서명 → 상세 열람", desc: "비공개 딜은 비밀유지계약(NDA)에 서명한 후 상세 정보를 열람할 수 있습니다." },
              { step: "5", title: "문의하기 → 협상방 개설", desc: "딜에 관심이 있다면 '문의하기'를 눌러 매도자와 직접 소통하세요." },
              { step: "6", title: "전문가 배정 → 실사 진행", desc: "법무, 회계, 세무 전문가를 배정받고 체계적인 실사를 진행합니다." },
              { step: "7", title: "계약 체결 → 안전 거래", desc: "계약이 완료되면 에스크로 파트너를 통해 안전하게 거래를 마무리합니다." },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="group flex gap-5 py-5 border-b border-border/20 last:border-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-sm font-bold text-primary ring-1 ring-blue-500/20">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── Section 4: 거래 프로세스 시각화 ────────────── */}
      <section className="relative border-b border-border/30">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Deal Process
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                거래 프로세스
              </h2>
              <p className="mt-4 text-muted-foreground">
                딜 등록부터 거래 완료까지, 프로세스 전체를 관리합니다
              </p>
            </div>
          </ScrollReveal>

          {/* Desktop: horizontal timeline */}
          <div className="relative mt-16">
            {/* Gradient connecting line — desktop only */}
            <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-0.5 lg:block">
              <div className="step-connector mx-auto h-full w-[calc(100%-120px)]" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, i) => (
                <ScrollReveal key={step.number} delay={i * 100}>
                  <div className="group relative flex flex-col items-center text-center">
                    {/* Numbered circle */}
                    <div className="relative z-10 flex h-[104px] w-[104px] flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm transition-all group-hover:border-blue-500/30 group-hover:bg-white/[0.06]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 ring-1 ring-blue-500/20">
                        <step.icon className="h-5 w-5" />
                      </div>
                      <span className="mt-1.5 text-[10px] font-bold text-muted-foreground/50">
                        STEP {step.number}
                      </span>
                    </div>

                    {/* Title & description */}
                    <h3 className="mt-5 text-base font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── Section 4.5: 빠른 시작 가이드 ────────────── */}
      <section className="relative border-b border-border/30">
        <div className="relative mx-auto max-w-4xl px-4 py-20 md:py-28">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                Quick Start
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                빠른 시작 가이드
              </h2>
              <p className="mt-4 text-muted-foreground">
                처음 이용하시는 분도 쉽게 따라할 수 있도록 단계별로 안내합니다
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 space-y-4">
            {[
              { step: "1", title: "회원가입", desc: "이메일로 가입하고 인증을 완료하세요.", link: "/auth/register", linkText: "회원가입 하기" },
              { step: "2", title: "프로필 설정", desc: "관심 분야, 투자 규모, 선호 지역을 설정하면 맞춤 딜을 추천받을 수 있습니다.", link: "/profile/matches", linkText: "매칭 설정" },
              { step: "3", title: "딜 등록 또는 탐색", desc: "매도자라면 딜을 등록하고, 매수자라면 마켓에서 딜을 탐색하세요.", link: "/deals", linkText: "딜 둘러보기" },
              { step: "4", title: "관심 딜 발견 → NDA 서명", desc: "비공개 딜의 상세 정보를 보려면 비밀유지계약(NDA)에 서명합니다.", link: null, linkText: null },
              { step: "5", title: "문의하기 → 협상방 개설", desc: "딜에 관심이 있으면 '문의하기'를 눌러 매도자와 직접 소통을 시작합니다.", link: null, linkText: null },
              { step: "6", title: "전문가 배정 → 실사 진행", desc: "법무, 회계, 세무 전문가를 배정하고 실사 체크리스트를 진행합니다.", link: null, linkText: null },
              { step: "7", title: "계약 체결 → 안전 거래", desc: "계약이 완료되면 에스크로 파트너를 통해 안전하게 거래를 마무리합니다.", link: null, linkText: null },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 60}>
                <div className="group flex items-start gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-sm font-bold text-emerald-400 ring-1 ring-emerald-500/20">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                  {item.link && (
                    <Link href={item.link} className="mt-1 shrink-0 text-xs font-medium text-emerald-400 transition-colors hover:text-emerald-300">
                      {item.linkText} →
                    </Link>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── Section 5: 우리의 약속 ────────────── */}
      <section className="relative border-b border-border/30">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/[0.02] via-transparent to-purple-500/[0.02]" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 md:py-28">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Our Promise
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                우리의 약속
              </h2>
              <p className="mt-4 text-muted-foreground">
                BlindDeal이 지켜나가는 세 가지 원칙
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {commitments.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 120}>
                <div className="glass-card group relative h-full overflow-hidden rounded-2xl p-8 text-center transition-all hover:border-white/[0.12]">
                  <div
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} ${item.text} ring-1 ${item.ring} transition-all`}
                  >
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── Section 6: 참여 CTA ────────────── */}
      <section className="relative overflow-hidden">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/6 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-[300px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-[300px] w-[400px] rounded-full bg-purple-500/5 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-4 py-20 md:py-28">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                지금{" "}
                <span className="gradient-text">BlindDeal</span>에
                참여하세요
              </h2>
              <p className="mt-4 text-muted-foreground">
                당신의 역할에 맞는 방법으로 시작할 수 있습니다
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {/* 매도자 */}
            <ScrollReveal delay={0}>
              <div className="hover-lift group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm transition-all hover:border-blue-500/20 hover:bg-white/[0.04]">
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400 ring-1 ring-blue-500/20">
                    <FileSignature className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">매도자</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    딜을 등록하고 검증된 매수자를 만나세요
                  </p>
                  <Link href="/deals/new" className="mt-6 inline-block">
                    <Button
                      size="sm"
                      className="min-h-[44px] gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-400 hover:to-indigo-400 hover:shadow-blue-500/30"
                    >
                      딜 등록하기
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* 매수자 */}
            <ScrollReveal delay={120}>
              <div className="hover-lift group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm transition-all hover:border-indigo-500/20 hover:bg-white/[0.04]">
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 text-indigo-400 ring-1 ring-indigo-500/20">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">매수자</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    관심 딜 조건을 설정하고 맞춤 딜을 받아보세요
                  </p>
                  <Link href="/auth/register" className="mt-6 inline-block">
                    <Button
                      size="sm"
                      variant="outline"
                      className="min-h-[44px] gap-2 rounded-xl border-indigo-500/30 text-indigo-400 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5"
                    >
                      회원가입
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* 전문가 */}
            <ScrollReveal delay={240}>
              <div className="hover-lift group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm transition-all hover:border-purple-500/20 hover:bg-white/[0.04]">
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-500/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 text-purple-400 ring-1 ring-purple-500/20">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">전문가</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    전문가로 등록하고 딜에 참여하세요
                  </p>
                  <a
                    href="mailto:83482@daum.net"
                    className="mt-6 inline-block"
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 rounded-xl border-purple-500/30 text-purple-400 transition-all hover:border-purple-500/50 hover:bg-purple-500/5"
                    >
                      <Mail className="h-4 w-4" />
                      문의하기
                    </Button>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Bottom inquiry link */}
          <ScrollReveal delay={360}>
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                더 궁금한 점이 있으신가요?
              </p>
              <Link
                href="/#inquiry-section"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                문의 폼 바로가기
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}

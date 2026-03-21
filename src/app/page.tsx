import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  Building2,
  Briefcase,
  Shield,
  Users,
  TrendingUp,
  MessageSquare,
  Plus,
  FileCheck,
  Scale,
  MessageSquareHeart,
  Calculator,
  FileSearch,
  Mouse,
} from "lucide-react";
import { formatKRW } from "@/lib/utils";
import { SpotlightHero } from "@/components/effects/spotlight-hero";
import { ClassifiedStamp } from "@/components/effects/classified-stamp";
import { LandingHeader } from "@/components/layout/landing-header";
import { Footer } from "@/components/layout/footer";
import { FloatingCTA } from "@/components/effects/floating-cta";
import { TextReveal } from "@/components/effects/text-reveal";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { TiltCard } from "@/components/effects/tilt-card";
import {
  PremiumHowItWorks,
  PremiumTrustSecurity,
  PremiumWhyBlindDeal,
  PremiumPartners,
  PremiumInquiryWrapper,
  PremiumBottomCTA,
} from "@/components/landing/premium-sections";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Transparent header that becomes solid on scroll */}
      <LandingHeader />
      {/* Hero Section — Premium BlindDeal Identity */}
      <SpotlightHero>
      <section className="relative overflow-hidden border-b border-border/30">
        {/* Grid dot background */}
        <div className="grid-bg pointer-events-none absolute inset-0" />

        {/* Ambient glows — larger, more dramatic */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/8 blur-[120px]" />
        <div className="pointer-events-none absolute -top-20 left-1/4 h-[400px] w-[500px] rounded-full bg-indigo-500/8 blur-[100px]" />
        <div className="pointer-events-none absolute top-20 right-1/4 h-[300px] w-[400px] rounded-full bg-purple-500/6 blur-[100px]" />

        {/* Floating particles — pure CSS */}
        <div className="pointer-events-none absolute left-[10%] top-[20%] h-1 w-1 rounded-full bg-blue-400/40 float-particle" />
        <div className="pointer-events-none absolute left-[25%] top-[40%] h-1.5 w-1.5 rounded-full bg-indigo-400/30 float-particle" style={{ animationDelay: '1s' }} />
        <div className="pointer-events-none absolute left-[70%] top-[15%] h-1 w-1 rounded-full bg-cyan-400/40 float-particle" style={{ animationDelay: '2s' }} />
        <div className="pointer-events-none absolute left-[85%] top-[45%] h-1.5 w-1.5 rounded-full bg-purple-400/30 float-particle" style={{ animationDelay: '3s' }} />
        <div className="pointer-events-none absolute left-[50%] top-[10%] h-1 w-1 rounded-full bg-blue-300/30 float-particle" style={{ animationDelay: '4s' }} />
        <div className="pointer-events-none absolute left-[40%] top-[55%] h-0.5 w-0.5 rounded-full bg-indigo-300/50 float-particle" style={{ animationDelay: '1.5s' }} />
        <div className="pointer-events-none absolute left-[60%] top-[35%] h-1 w-1 rounded-full bg-cyan-300/30 float-particle" style={{ animationDelay: '2.5s' }} />
        <div className="pointer-events-none absolute left-[15%] top-[60%] h-0.5 w-0.5 rounded-full bg-purple-300/40 float-particle" style={{ animationDelay: '0.5s' }} />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-xs font-medium text-muted-foreground backdrop-blur-xl">
              <Lock className="h-3.5 w-3.5 text-blue-400" />
              <span>검증된 딜만, 원하는 만큼만 공개합니다</span>
              <span className="h-1 w-1 rounded-full bg-blue-400 pulse-dot" />
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <TextReveal delay={0}>
                보이지 않는 곳에서
              </TextReveal>
              <TextReveal delay={200}>
                <span className="gradient-text">
                  가장 큰 거래
                </span>
                가 이루어집니다
              </TextReveal>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              부동산과 M&A(인수합병) 딜을 공개 또는 비공개로 등록하세요.
              <br className="hidden md:block" />
              검증된 상대방과 안전한 프로세스 위에서 거래합니다.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <MagneticButton>
                <Link href="/deals/new">
                  <Button size="lg" className="glow-button relative gap-2 px-10 py-3 text-base font-semibold">
                    <Plus className="h-4 w-4" />
                    딜 등록하기
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/deals">
                  <Button size="lg" variant="outline" className="gap-2 border-white/10 px-10 py-3 text-base backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/5">
                    딜 둘러보기
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </div>

          {/* Scroll-down indicator */}
          <div className="mt-12 flex justify-center">
            <div className="flex flex-col items-center gap-1.5 text-muted-foreground/30">
              <Mouse className="h-5 w-5 animate-bounce" />
              <span className="text-[9px] font-medium tracking-[0.2em] uppercase">Scroll</span>
            </div>
          </div>
        </div>
      </section>
      </SpotlightHero>

      {/* Quick Deal Registration CTA — Premium Cards */}
      <ScrollReveal>
      <section className="relative border-b border-border/30">
        {/* Subtle gradient background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] via-indigo-500/[0.03] to-purple-500/[0.03]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-5 md:grid-cols-2">
            <ScrollReveal delay={0}>
            <Link href="/deals/new?category=real_estate">
              <div className="hover-lift group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 backdrop-blur-sm transition-all hover:border-blue-500/20 hover:bg-white/[0.04]">
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
                <div className="relative flex items-start gap-5">
                  <div className="icon-glow relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400 ring-1 ring-blue-500/20 transition-all group-hover:ring-blue-500/40">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">부동산 딜 등록</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      오피스, 물류센터, 토지, 리테일, 개발 프로젝트 — 3분이면 등록 완료
                    </p>
                  </div>
                  <ArrowRight className="ml-auto mt-2 h-5 w-5 shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-1 group-hover:text-blue-400" />
                </div>
              </div>
            </Link>
            </ScrollReveal>
            <ScrollReveal delay={120}>
            <Link href="/deals/new?category=ma">
              <div className="hover-lift group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 backdrop-blur-sm transition-all hover:border-purple-500/20 hover:bg-white/[0.04]">
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-500/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
                <div className="relative flex items-start gap-5">
                  <div className="icon-glow relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 text-purple-400 ring-1 ring-purple-500/20 transition-all group-hover:ring-purple-500/40">
                    <Briefcase className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">M&A 딜 등록</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      기업 인수, 지분 매각, 사업부 매각, 합병 — 비공개로도 안전하게
                    </p>
                  </div>
                  <ArrowRight className="ml-auto mt-2 h-5 w-5 shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-1 group-hover:text-purple-400" />
                </div>
              </div>
            </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Blind Deal Showcase — 공개 vs 비공개 */}
      <ScrollReveal>
      <section className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">실시간 딜</h2>
            <p className="mt-2 text-sm text-muted-foreground">이런 딜들이 BlindDeal에 등록됩니다</p>
          </div>
          <Link href="/deals" className="group flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80">
            전체 보기
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Public Deal */}
          <ScrollReveal delay={0}>
          <TiltCard maxTilt={3}>
          <Link href="/auth/register" className="block">
            <DealPreviewCard
              title="판교 프라임 물류센터"
              category="부동산"
              categoryColor="blue"
              dealType="물류센터"
              location="경기 성남"
              amount={45000000000}
              tags={["수도권", "물류", "임대수익"]}
            />
          </Link>
          </TiltCard>
          </ScrollReveal>
          {/* Public Deal */}
          <ScrollReveal delay={80}>
          <TiltCard maxTilt={3}>
          <Link href="/auth/register" className="block">
            <DealPreviewCard
              title="제주 리조트 개발 프로젝트"
              category="부동산"
              categoryColor="blue"
              dealType="개발"
              location="제주"
              amount={78000000000}
              tags={["관광", "레저", "개발"]}
            />
          </Link>
          </TiltCard>
          </ScrollReveal>
          {/* Public Deal */}
          <ScrollReveal delay={160}>
          <TiltCard maxTilt={3}>
          <Link href="/auth/register" className="block">
            <DealPreviewCard
              title="SaaS 기업 지분 매각"
              category="M&A"
              categoryColor="purple"
              dealType="지분 매각"
              location="서울"
              amount={null}
              tags={["IT", "SaaS", "ARR 50억"]}
            />
          </Link>
          </TiltCard>
          </ScrollReveal>
          {/* Public Deal */}
          <ScrollReveal delay={240}>
          <TiltCard maxTilt={3}>
          <Link href="/auth/register" className="block">
            <DealPreviewCard
              title="강남 프라임 오피스 빌딩"
              category="부동산"
              categoryColor="blue"
              dealType="오피스"
              location="서울 강남"
              amount={120000000000}
              tags={["강남", "오피스", "프라임"]}
            />
          </Link>
          </TiltCard>
          </ScrollReveal>
          {/* Private Deal — Blurred/Hidden */}
          <ScrollReveal delay={320}>
          <BlindDealCard
            category="M&A"
            categoryColor="purple"
            dealType="기업 인수"
            industry="헬스케어"
            requiredLevel={3}
          />
          </ScrollReveal>
          {/* Private Deal */}
          <ScrollReveal delay={400}>
          <BlindDealCard
            category="M&A"
            categoryColor="purple"
            dealType="사업부 매각"
            industry="제조/화학"
            requiredLevel={4}
          />
          </ScrollReveal>
        </div>
      </section>
      </ScrollReveal>

      {/* How It Works — Premium Framer Motion */}
      <PremiumHowItWorks />

      {/* Trust & Security — Premium Glass Cards */}
      <PremiumTrustSecurity />

      {/* Inquiry / Meeting Request Form — Premium Wrapper */}
      <PremiumInquiryWrapper />

      {/* Trust Indicators — Why BlindDeal */}
      <PremiumWhyBlindDeal />

      {/* Partner Recruitment — Premium */}
      <PremiumPartners />

      {/* Bottom CTA — Premium Full Gradient */}
      <PremiumBottomCTA />

      {/* Floating CTA */}
      <FloatingCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}

/* ─── Components ─── */

function DealPreviewCard({
  title, category, categoryColor, dealType, location, amount, tags,
}: {
  title: string; category: string; categoryColor: "blue" | "purple"; dealType: string;
  location: string; amount: number | null;
  tags: string[];
}) {
  return (
    <Card className="hover-lift inner-glow group cursor-pointer overflow-hidden border-white/[0.06] bg-white/[0.02] p-0 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.04]">
      <div className="p-5">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={categoryColor === "blue" ? "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20" : "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20"}>
            {category}
          </Badge>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
            <Eye className="mr-1 h-3 w-3" />공개
          </Badge>
          <span className="ml-auto text-xs text-muted-foreground/60">{dealType}</span>
        </div>
        <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
          검증완료
        </div>
        <h3 className="mt-1.5 text-base font-semibold leading-tight">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground/70">{location}</p>
        <div className="mt-4">
          <span className="text-lg font-bold text-primary">{formatKRW(amount)}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 text-[10px] text-muted-foreground/70">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function BlindDealCard({
  category, categoryColor, dealType, industry, requiredLevel,
}: {
  category: string; categoryColor: "blue" | "purple"; dealType: string;
  industry: string; requiredLevel: number;
}) {
  return (
    <Card className="watermark-confidential hover-lift group relative overflow-hidden border-red-500/10 bg-white/[0.02] p-0 backdrop-blur-sm transition-all hover:border-amber-500/20">
      {/* Classified stamp overlay */}
      <ClassifiedStamp level={requiredLevel} />

      {/* Top section with badges — always visible */}
      <div className="relative z-20 flex items-center gap-2 px-5 pt-5">
        <Badge variant="secondary" className={categoryColor === "blue" ? "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20" : "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20"}>
          {category}
        </Badge>
        <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
          <EyeOff className="mr-1 h-3 w-3" />비공개
        </Badge>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
          관리자 검증
        </span>
        <span className="ml-auto text-xs text-muted-foreground/60">{dealType}</span>
      </div>

      {/* Masked/redacted content area */}
      <div className="relative mt-3 px-5">
        {/* Redacted title — monospace, uneven widths */}
        <div className="relative select-none">
          <p className="redacted text-base font-semibold tracking-wider" aria-hidden="true">
            <span className="inline-block">██████</span>{" "}
            <span className="inline-block">████</span>{" "}
            <span className="inline-block">████████</span>
          </p>
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
        <p className="mt-1 text-sm text-muted-foreground/60">{industry}</p>

        {/* Redacted price */}
        <div className="mt-3">
          <div className="relative inline-block select-none">
            <span className="redacted text-lg font-bold">&#8361;██,███,███,███</span>
            <div className="absolute inset-0 backdrop-blur-[3px]" />
          </div>
        </div>
      </div>

      {/* Gradient overlay fading to dark at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Ambient glow behind card — red/amber tint for classified feel */}
      <div className="pointer-events-none absolute -bottom-4 left-1/2 h-24 w-48 -translate-x-1/2 rounded-full bg-red-500/5 blur-3xl" />

      {/* Centered lock overlay */}
      <div className="relative z-10 mx-5 mb-5 mt-5">
        <div className="glass-card flex flex-col items-center gap-2.5 rounded-xl px-4 py-5">
          <div className="pulse-glow flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Lock className="h-4.5 w-4.5 text-white/80" />
          </div>
          <span className="text-xs font-medium text-white/80">비공개 딜</span>
          <span className="text-[10px] text-white/40">인증 등급 {requiredLevel} 이상 열람 가능</span>
          <Link
            href="/profile/verification"
            className="mt-1 rounded-full border border-white/10 bg-white/5 px-5 py-1.5 text-[10px] font-medium text-white/60 transition-all hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white"
          >
            인증하기
          </Link>
        </div>
      </div>
    </Card>
  );
}

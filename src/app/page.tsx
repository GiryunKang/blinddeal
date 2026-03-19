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
  CheckCircle,
  MessageSquareHeart,
} from "lucide-react";
import { formatKRW } from "@/lib/utils";
import { SpotlightHero } from "@/components/effects/spotlight-hero";
import { ClassifiedStamp } from "@/components/effects/classified-stamp";
import { InquiryForm } from "@/components/inquiry/inquiry-form";
import { LandingHeader } from "@/components/layout/landing-header";
import { Footer } from "@/components/layout/footer";

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
              보이지 않는 곳에서
              <br />
              <span className="gradient-text">
                가장 큰 거래
              </span>
              가 이루어집니다
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              부동산과 M&A(인수합병) 딜을 공개 또는 비공개로 등록하세요.
              <br className="hidden md:block" />
              검증된 상대방과 안전한 프로세스 위에서 거래합니다.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/deals/new">
                <Button size="lg" className="glow-button relative gap-2 px-10 py-3 text-base font-semibold">
                  <Plus className="h-4 w-4" />
                  딜 등록하기
                </Button>
              </Link>
              <Link href="/deals">
                <Button size="lg" variant="outline" className="gap-2 border-white/10 px-10 py-3 text-base backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/5">
                  딜 둘러보기
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </SpotlightHero>

      {/* Quick Deal Registration CTA — Premium Cards */}
      <section className="relative border-b border-border/30">
        {/* Subtle gradient background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] via-indigo-500/[0.03] to-purple-500/[0.03]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-5 md:grid-cols-2">
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
          </div>
        </div>
      </section>

      {/* Blind Deal Showcase — 공개 vs 비공개 */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">실시간 딜</h2>
            <p className="mt-2 text-sm text-muted-foreground">공개 딜은 누구나, 비공개 딜은 검증 후 열람</p>
          </div>
          <Link href="/deals" className="group flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80">
            전체 보기
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Public Deal */}
          <DealPreviewCard
            title="판교 프라임 물류센터"
            category="부동산"
            categoryColor="blue"
            dealType="물류센터"
            location="경기 성남"
            amount={45000000000}
            visibility="public"
            tags={["수도권", "물류", "임대수익"]}
          />
          {/* Private Deal — Blurred/Hidden */}
          <BlindDealCard
            category="M&A"
            categoryColor="purple"
            dealType="기업 인수"
            industry="헬스케어"
            requiredLevel={3}
          />
          {/* Public Deal */}
          <DealPreviewCard
            title="제주 리조트 개발 프로젝트"
            category="부동산"
            categoryColor="blue"
            dealType="개발"
            location="제주"
            amount={78000000000}
            visibility="public"
            tags={["관광", "레저", "개발"]}
          />
          {/* Private Deal — Blurred/Hidden */}
          <BlindDealCard
            category="부동산"
            categoryColor="blue"
            dealType="오피스"
            industry="강남 핵심권"
            requiredLevel={2}
          />
          {/* Public Deal */}
          <DealPreviewCard
            title="SaaS 기업 지분 매각"
            category="M&A"
            categoryColor="purple"
            dealType="지분 매각"
            location="서울"
            amount={null}
            visibility="public"
            tags={["IT", "SaaS", "ARR 50억"]}
          />
          {/* Private Deal */}
          <BlindDealCard
            category="M&A"
            categoryColor="purple"
            dealType="사업부 매각"
            industry="제조/화학"
            requiredLevel={4}
          />
        </div>
      </section>

      {/* How It Works — Gradient Orbs + Connector */}
      <section className="relative border-t border-border/30">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
          <h2 className="mb-3 text-center text-2xl font-bold md:text-3xl">어떻게 작동하나요?</h2>
          <p className="mb-14 text-center text-sm text-muted-foreground">파는 사람도, 사는 사람도 안전하게</p>

          {/* Step connector line — hidden on mobile */}
          <div className="relative">
            <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-[2px] md:block">
              <div className="step-connector mx-auto h-full w-[calc(100%-120px)] rounded-full opacity-30" />
            </div>

            <div className="grid gap-8 md:grid-cols-4">
              <ProcessStep
                step="01"
                icon={<Plus className="h-5 w-5" />}
                title="딜 등록"
                description="부동산 또는 M&A 딜을 등록하세요. 공개/비공개를 직접 선택합니다."
                color="blue"
              />
              <ProcessStep
                step="02"
                icon={<Shield className="h-5 w-5" />}
                title="검증 & 매칭"
                description="비공개 딜은 자격이 검증된 상대방에게만 노출됩니다. 조건에 맞는 딜을 자동 매칭합니다."
                color="indigo"
              />
              <ProcessStep
                step="03"
                icon={<MessageSquare className="h-5 w-5" />}
                title="협상 & 실사(정밀조사)"
                description="플랫폼 내에서 안전하게 소통하고, 비밀유지계약(NDA) 서명 후 상세 자료를 공유합니다."
                color="purple"
              />
              <ProcessStep
                step="04"
                icon={<TrendingUp className="h-5 w-5" />}
                title="계약 & 에스크로(안심결제)"
                description="전문가 검토, 계약 체결, 에스크로(안심결제)까지 한 곳에서 완료합니다."
                color="cyan"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Section — Glass Cards */}
      <section className="relative border-t border-border/30">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
          <h2 className="mb-3 text-center text-2xl font-bold md:text-3xl">안전한 거래를 위한 보호 장치</h2>
          <p className="mb-14 text-center text-sm text-muted-foreground">모든 거래 단계에서 보호받으세요</p>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="hover-lift glass-card inner-glow group rounded-2xl p-7 transition-all hover:border-blue-500/15">
              <div className="icon-glow relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/15 to-blue-600/5 text-blue-400 ring-1 ring-blue-500/20">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold">에스크로(안심결제)</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                거래 대금은 제3자(플랫폼)가 안전하게 보관하다가, 소유권 이전이 확인된 후에만 매도자에게 전달됩니다.
              </p>
            </div>
            <div className="hover-lift glass-card inner-glow group rounded-2xl p-7 transition-all hover:border-indigo-500/15">
              <div className="icon-glow relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-indigo-600/5 text-indigo-400 ring-1 ring-indigo-500/20">
                <FileCheck className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold">법적 구속력 있는 비밀유지계약(NDA)</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                비공개 딜 열람 시 전자 서명하는 비밀유지계약(NDA)은 법적 구속력을 가집니다. IP 주소, 타임스탬프가 자동 기록됩니다.
              </p>
            </div>
            <div className="hover-lift glass-card inner-glow group rounded-2xl p-7 transition-all hover:border-purple-500/15">
              <div className="icon-glow relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/15 to-purple-600/5 text-purple-400 ring-1 ring-purple-500/20">
                <Scale className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold">분쟁 해결 프로세스</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                거래 과정에서 분쟁 발생 시 플랫폼의 중재 프로세스와 전문가 자문을 통해 공정하게 해결합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators — Why BlindDeal */}
      <section className="relative border-t border-border/30">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
          <h2 className="mb-3 text-center text-2xl font-bold md:text-3xl">왜 <span className="gradient-text">BlindDeal</span>인가?</h2>
          <p className="mb-14 text-center text-sm text-muted-foreground">차별화된 거래 환경</p>
          <div className="grid gap-8 md:grid-cols-3">
            <TrustCard
              icon={<EyeOff className="h-6 w-6" />}
              title="원하는 만큼만 공개"
              description="등록된 딜을 비공개로 운영할 수 있습니다. 딜을 전부 공개할지, 검증된 사람에게만 보여줄지 등록자가 직접 결정합니다. 비밀유지계약(NDA) 서명 후에만 상세 정보에 접근 가능합니다."
              color="blue"
            />
            <TrustCard
              icon={<Shield className="h-6 w-6" />}
              title="단계적 인증 체계"
              description="4단계 인증 시스템을 통해 매수자의 자격을 검증합니다. 인증 등급이 높을수록 더 큰 규모의 비공개 딜에 접근할 수 있으며, 검증된 사용자만 접근할 수 있습니다."
              color="indigo"
            />
            <TrustCard
              icon={<Users className="h-6 w-6" />}
              title="전문가 네트워크"
              description="법무, 회계, 세무, 감정 전문가가 실사(기업·자산 정밀조사)부터 계약까지 지원합니다. 체계적인 프로세스로 거래를 지원합니다."
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Partner Recruitment */}
      <section className="relative border-t border-border/30">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
          <h2 className="mb-3 text-center text-2xl font-bold md:text-3xl">함께할 <span className="gradient-text">전문 기관</span>을 모집합니다</h2>
          <p className="mb-10 text-center text-sm text-muted-foreground">법무법인, 회계법인, 감정평가법인, 신탁회사 파트너를 찾고 있습니다</p>

          <div className="flex justify-center">
            <a href="mailto:83482@daum.net">
              <Button size="lg" variant="outline" className="gap-2 border-white/10 px-10 py-3 text-base backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/5">
                파트너 제휴 문의
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Inquiry / Meeting Request Form */}
      <section id="inquiry" className="relative border-t border-border/30">
        {/* Gradient background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-indigo-500/[0.03] to-purple-500/[0.05]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-500/8 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-2xl">
            {/* Section Header */}
            <div className="mb-10 text-center">
              <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-xs font-medium text-muted-foreground backdrop-blur-xl">
                <MessageSquareHeart className="h-3.5 w-3.5 text-indigo-400" />
                <span>회원가입 없이 간편하게</span>
              </div>
              <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">
                딜을 찾거나 등록하고 <span className="gradient-text">싶으신가요?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
                회원가입 없이 간편하게 문의하세요. 전문 담당자가 직접 연락드립니다.
              </p>
            </div>

            {/* Glass Card Form Container */}
            <div className="animated-border glass-card inner-glow rounded-2xl p-6 md:p-10">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA — Full gradient section */}
      <section className="relative overflow-hidden border-t border-border/30">
        {/* Dramatic gradient background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/[0.07] via-indigo-500/[0.05] to-purple-500/[0.07]" />
        <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center md:py-28">
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            보이지 않는 딜을 <span className="gradient-text">시작하세요</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground md:text-lg">
            지금 바로 딜을 등록하거나, 조건에 맞는 딜을 찾아보세요.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/deals/new">
              <span className="animated-border glow-button relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-3.5 text-base font-semibold text-white transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/25">
                <Plus className="h-4 w-4" />
                딜 등록하기
              </span>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="border-white/10 px-10 py-3 text-base backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/5">
                무료 가입하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

/* ─── Components ─── */

function DealPreviewCard({
  title, category, categoryColor, dealType, location, amount, visibility, tags,
}: {
  title: string; category: string; categoryColor: "blue" | "purple"; dealType: string;
  location: string; amount: number | null; visibility: "public" | "private";
  tags: string[];
}) {
  return (
    <Card className="hover-lift inner-glow group overflow-hidden border-white/[0.06] bg-white/[0.02] p-0 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.04]">
      <div className="p-5">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={categoryColor === "blue" ? "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20" : "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20"}>
            {category}
          </Badge>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
            <Eye className="mr-1 h-3 w-3" />공개
          </Badge>
          <Badge variant="secondary" className="bg-white/[0.06] text-muted-foreground/60 ring-1 ring-white/[0.08] text-[10px]">
            예시
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
        <Badge variant="secondary" className="bg-white/[0.06] text-muted-foreground/60 ring-1 ring-white/[0.08] text-[10px]">
          예시
        </Badge>
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

function ProcessStep({
  step, icon, title, description, color,
}: {
  step: string; icon: React.ReactNode; title: string; description: string;
  color: "blue" | "indigo" | "purple" | "cyan";
}) {
  const gradientMap = {
    blue: "from-blue-500/30 to-blue-600/10",
    indigo: "from-indigo-500/30 to-indigo-600/10",
    purple: "from-purple-500/30 to-purple-600/10",
    cyan: "from-cyan-500/30 to-cyan-600/10",
  };
  const textColorMap = {
    blue: "text-blue-400",
    indigo: "text-indigo-400",
    purple: "text-purple-400",
    cyan: "text-cyan-400",
  };
  const ringMap = {
    blue: "ring-blue-500/30",
    indigo: "ring-indigo-500/30",
    purple: "ring-purple-500/30",
    cyan: "ring-cyan-500/30",
  };

  return (
    <div className="hover-lift group text-center">
      {/* Gradient orb */}
      <div className="relative mx-auto mb-5">
        <div className="gradient-orb pointer-events-none absolute -inset-4 opacity-50 blur-xl" />
        <div className={`relative mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-gradient-to-br ${gradientMap[color]} ${textColorMap[color]} ring-1 ${ringMap[color]} transition-all group-hover:scale-105`}>
          {icon}
        </div>
      </div>
      <div className="gradient-text mb-2 text-xs font-bold tracking-widest">{step}</div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mx-auto mt-2.5 max-w-[240px] text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function TrustCard({
  icon, title, description, color,
}: {
  icon: React.ReactNode; title: string; description: string;
  color: "blue" | "indigo" | "purple";
}) {
  const gradientMap = {
    blue: "from-blue-500/15 to-blue-600/5",
    indigo: "from-indigo-500/15 to-indigo-600/5",
    purple: "from-purple-500/15 to-purple-600/5",
  };
  const textColorMap = {
    blue: "text-blue-400",
    indigo: "text-indigo-400",
    purple: "text-purple-400",
  };
  const ringMap = {
    blue: "ring-blue-500/20",
    indigo: "ring-indigo-500/20",
    purple: "ring-purple-500/20",
  };
  const hoverBorderMap = {
    blue: "hover:border-blue-500/15",
    indigo: "hover:border-indigo-500/15",
    purple: "hover:border-purple-500/15",
  };

  return (
    <div className={`animated-border hover-lift glass-card inner-glow group rounded-2xl p-7 transition-all ${hoverBorderMap[color]}`}>
      <div className={`icon-glow relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradientMap[color]} ${textColorMap[color]} ring-1 ${ringMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
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
} from "lucide-react";
import { formatKRW } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section — BlindDeal Identity */}
      <section className="relative overflow-hidden border-b border-border/30">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="pointer-events-none absolute -top-20 left-1/4 h-[300px] w-[400px] rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <Lock className="h-3 w-3 text-blue-400" />
              검증된 딜만, 원하는 만큼만 공개합니다
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              보이지 않는 곳에서
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                가장 큰 거래
              </span>
              가 이루어집니다
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              부동산과 M&A(인수합병) 딜을 공개 또는 비공개로 등록하세요.
              <br className="hidden md:block" />
              검증된 상대방과 안전한 프로세스 위에서 거래합니다.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/deals/new">
                <Button size="lg" className="gap-2 px-8 text-base">
                  <Plus className="h-4 w-4" />
                  딜 등록하기
                </Button>
              </Link>
              <Link href="/deals">
                <Button size="lg" variant="outline" className="gap-2 px-8 text-base">
                  딜 둘러보기
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-b border-border/30 bg-card/20">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white md:text-3xl">₩1.2T+</div>
              <div className="mt-1 text-xs text-muted-foreground">누적 거래액</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white md:text-3xl">2,400+</div>
              <div className="mt-1 text-xs text-muted-foreground">검증된 딜</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white md:text-3xl">8,700+</div>
              <div className="mt-1 text-xs text-muted-foreground">활성 사용자</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white md:text-3xl">94%</div>
              <div className="mt-1 text-xs text-muted-foreground">거래 성사율</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Deal Registration CTA */}
      <section className="border-b border-border/30 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/deals/new?category=real_estate">
              <Card className="group cursor-pointer border-border/50 bg-card/50 p-6 transition-all hover:border-blue-500/30 hover:bg-card/80">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/20">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">부동산 딜 등록</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      오피스, 물류센터, 토지, 리테일, 개발 프로젝트 — 3분이면 등록 완료
                    </p>
                  </div>
                  <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-blue-400" />
                </div>
              </Card>
            </Link>
            <Link href="/deals/new?category=ma">
              <Card className="group cursor-pointer border-border/50 bg-card/50 p-6 transition-all hover:border-purple-500/30 hover:bg-card/80">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 transition-colors group-hover:bg-purple-500/20">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">M&A 딜 등록</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      기업 인수, 지분 매각, 사업부 매각, 합병 — 비공개로도 안전하게
                    </p>
                  </div>
                  <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-purple-400" />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Blind Deal Showcase — 공개 vs 비공개 */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">실시간 딜</h2>
            <p className="mt-1 text-sm text-muted-foreground">공개 딜은 누구나, 비공개 딜은 검증 후 열람</p>
          </div>
          <Link href="/deals" className="text-sm text-primary hover:underline">
            전체 보기
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Public Deal */}
          <DealPreviewCard
            title="판교 프라임 물류센터"
            category="부동산"
            categoryColor="blue"
            dealType="물류센터"
            location="경기 성남"
            amount={45000000000}
            visibility="public"
            interests={23}
            tags={["수도권", "물류", "임대수익"]}
          />
          {/* Private Deal — Blurred/Hidden */}
          <BlindDealCard
            category="M&A"
            categoryColor="purple"
            dealType="기업 인수"
            industry="헬스케어"
            requiredLevel={3}
            interests={47}
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
            interests={15}
            tags={["관광", "레저", "개발"]}
          />
          {/* Private Deal — Blurred/Hidden */}
          <BlindDealCard
            category="부동산"
            categoryColor="blue"
            dealType="오피스"
            industry="강남 핵심권"
            requiredLevel={2}
            interests={31}
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
            interests={38}
            tags={["IT", "SaaS", "ARR 50억"]}
          />
          {/* Private Deal */}
          <BlindDealCard
            category="M&A"
            categoryColor="purple"
            dealType="사업부 매각"
            industry="제조/화학"
            requiredLevel={4}
            interests={12}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border/30 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="mb-2 text-center text-xl font-bold">어떻게 작동하나요?</h2>
          <p className="mb-10 text-center text-sm text-muted-foreground">파는 사람도, 사는 사람도 안전하게</p>

          <div className="grid gap-6 md:grid-cols-4">
            <ProcessStep
              step="01"
              icon={<Plus className="h-5 w-5" />}
              title="딜 등록"
              description="부동산 또는 M&A 딜을 등록하세요. 공개/비공개를 직접 선택합니다."
            />
            <ProcessStep
              step="02"
              icon={<Shield className="h-5 w-5" />}
              title="검증 & 매칭"
              description="비공개 딜은 자격이 검증된 상대방에게만 노출됩니다. 조건에 맞는 딜을 자동 매칭합니다."
            />
            <ProcessStep
              step="03"
              icon={<MessageSquare className="h-5 w-5" />}
              title="협상 & 실사(정밀조사)"
              description="플랫폼 내에서 안전하게 소통하고, 비밀유지계약(NDA) 서명 후 상세 자료를 공유합니다."
            />
            <ProcessStep
              step="04"
              icon={<TrendingUp className="h-5 w-5" />}
              title="계약 & 에스크로(안심결제)"
              description="전문가 검토, 계약 체결, 에스크로(안심결제)까지 한 곳에서 완료합니다."
            />
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="border-t border-border/30 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="mb-2 text-center text-xl font-bold">안전한 거래를 위한 보호 장치</h2>
          <p className="mb-10 text-center text-sm text-muted-foreground">모든 거래 단계에서 보호받으세요</p>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border/50 bg-background/50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">에스크로(안심결제)</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                거래 대금은 제3자(플랫폼)가 안전하게 보관하다가, 소유권 이전이 확인된 후에만 매도자에게 전달됩니다.
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">법적 구속력 있는 비밀유지계약(NDA)</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                비공개 딜 열람 시 전자 서명하는 비밀유지계약(NDA)은 법적 구속력을 가집니다. IP 주소, 타임스탬프가 자동 기록됩니다.
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Scale className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">분쟁 해결 프로세스</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                거래 과정에서 분쟁 발생 시 플랫폼의 중재 프로세스와 전문가 자문을 통해 공정하게 해결합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-t border-border/30">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="mb-2 text-center text-xl font-bold">왜 BlindDeal인가?</h2>
          <p className="mb-10 text-center text-sm text-muted-foreground">차별화된 거래 환경</p>
          <div className="grid gap-8 md:grid-cols-3">
            <TrustCard
              icon={<EyeOff className="h-6 w-6" />}
              title="원하는 만큼만 공개"
              description="등록된 딜의 62%가 비공개로 운영됩니다. 딜을 전부 공개할지, 검증된 사람에게만 보여줄지 등록자가 직접 결정합니다. 비밀유지계약(NDA) 서명 후에만 상세 정보에 접근 가능합니다."
            />
            <TrustCard
              icon={<Shield className="h-6 w-6" />}
              title="단계적 인증 체계"
              description="4단계 인증 시스템을 통해 매수자의 자격을 검증합니다. 인증 등급이 높을수록 더 큰 규모의 비공개 딜에 접근할 수 있으며, 현재 8,700명 이상의 검증된 사용자가 활동 중입니다."
            />
            <TrustCard
              icon={<Users className="h-6 w-6" />}
              title="전문가 네트워크"
              description="120명 이상의 법무, 회계, 세무, 감정 전문가가 실사(기업·자산 정밀조사)부터 계약까지 지원합니다. 평균 거래 완료 기간 45일, 거래 성사율 94%의 검증된 프로세스입니다."
            />
          </div>
        </div>
      </section>

      {/* Partner / Credential Logos */}
      <section className="border-t border-border/30 bg-card/20">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="mb-2 text-center text-xl font-bold">신뢰할 수 있는 파트너십</h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">함께하는 전문 기관들</p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {["법무법인 A", "회계법인 B", "감정평가법인 C", "신탁회사 D"].map((partner) => (
              <div
                key={partner}
                className="flex h-14 items-center justify-center rounded-lg border border-border/30 bg-muted/10 px-8 text-sm font-medium text-muted-foreground/60"
              >
                {partner}
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground/50">
            실제 파트너 기관은 서비스 런칭 시 공개됩니다
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border/30">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            보이지 않는 딜을 시작하세요
          </h2>
          <p className="mt-3 text-muted-foreground">
            지금 바로 딜을 등록하거나, 조건에 맞는 딜을 찾아보세요.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/deals/new">
              <Button size="lg" className="gap-2 px-8">
                <Plus className="h-4 w-4" />
                딜 등록하기
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="px-8">
                무료 가입하기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Components ─── */

function DealPreviewCard({
  title, category, categoryColor, dealType, location, amount, visibility, interests, tags,
}: {
  title: string; category: string; categoryColor: "blue" | "purple"; dealType: string;
  location: string; amount: number | null; visibility: "public" | "private";
  interests: number; tags: string[];
}) {
  return (
    <Card className="group border-border/50 bg-card/50 p-5 transition-all hover:border-border hover:bg-card/80">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className={categoryColor === "blue" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"}>
          {category}
        </Badge>
        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400">
          <Eye className="mr-1 h-3 w-3" />공개
        </Badge>
        <span className="ml-auto text-xs text-muted-foreground">{dealType}</span>
      </div>
      <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
        <CheckCircle className="h-3 w-3" />
        검증완료
      </div>
      <h3 className="mt-1 font-semibold leading-tight">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{location}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-primary">{formatKRW(amount)}</span>
        <span className="text-xs text-muted-foreground">관심 {interests}명</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className="rounded-md bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );
}

function BlindDealCard({
  category, categoryColor, dealType, industry, requiredLevel, interests,
}: {
  category: string; categoryColor: "blue" | "purple"; dealType: string;
  industry: string; requiredLevel: number; interests: number;
}) {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 transition-all hover:border-amber-500/20">
      {/* Top section with badges — always visible */}
      <div className="relative z-20 flex items-center gap-2 px-5 pt-5">
        <Badge variant="secondary" className={categoryColor === "blue" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"}>
          {category}
        </Badge>
        <Badge variant="secondary" className="bg-amber-500/10 text-amber-400">
          <EyeOff className="mr-1 h-3 w-3" />비공개
        </Badge>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
          <CheckCircle className="h-3 w-3" />
          관리자 검증
        </span>
        <span className="ml-auto text-xs text-muted-foreground">{dealType}</span>
      </div>

      {/* Masked/redacted content area */}
      <div className="relative mt-3 px-5">
        {/* Blurred masked title */}
        <div className="relative select-none">
          <p className="text-base font-semibold tracking-wider text-muted-foreground/30" aria-hidden="true">
            ██████ ████ ██████
          </p>
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{industry}</p>

        {/* Blurred price */}
        <div className="mt-3 flex items-center justify-between">
          <div className="relative select-none">
            <span className="text-lg font-bold text-muted-foreground/20">₩██,███,███,███</span>
            <div className="absolute inset-0 backdrop-blur-[3px]" />
          </div>
          <span className="text-xs text-muted-foreground">관심 {interests}명</span>
        </div>
      </div>

      {/* Gradient overlay fading to dark at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Ambient glow behind card */}
      <div className="pointer-events-none absolute -bottom-4 left-1/2 h-20 w-40 -translate-x-1/2 rounded-full bg-blue-500/5 blur-2xl" />

      {/* Centered lock overlay */}
      <div className="relative z-10 mx-5 mb-5 mt-5">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-4 backdrop-blur-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-lg shadow-blue-500/5">
            <Lock className="h-4 w-4 text-white/70" />
          </div>
          <span className="text-xs font-medium text-white/70">비공개 딜</span>
          <span className="text-[10px] text-white/40">인증 등급 {requiredLevel} 이상 열람 가능</span>
          <Link
            href="/profile/verification"
            className="mt-1 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[10px] font-medium text-white/60 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            인증하기
          </Link>
        </div>
      </div>
    </Card>
  );
}

function ProcessStep({
  step, icon, title, description,
}: {
  step: string; icon: React.ReactNode; title: string; description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="mb-1 text-xs font-bold text-muted-foreground">{step}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function TrustCard({
  icon, title, description,
}: {
  icon: React.ReactNode; title: string; description: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

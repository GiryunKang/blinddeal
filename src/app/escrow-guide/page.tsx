import type { Metadata } from "next"
import { MainLayout } from "@/components/layout/main-layout"
import {
  FileCheck,
  Wallet,
  CheckCircle2,
  ArrowDown,
  HelpCircle,
  Lock,
  Users,
  Building2,
  Scale,
  Landmark,
} from "lucide-react"

export const metadata: Metadata = { title: "안전 거래 안내 — 에스크로 파트너 연결" }

const steps = [
  {
    icon: FileCheck,
    step: "01",
    title: "거래 합의",
    description:
      "매수자와 매도자가 딜 조건에 합의하고, 안전한 거래 진행을 위해 에스크로 파트너 연결을 요청합니다.",
  },
  {
    icon: Building2,
    step: "02",
    title: "에스크로 파트너 연결",
    description:
      "BlindDeal이 거래 규모와 유형에 맞는 신뢰할 수 있는 에스크로 파트너(은행, 법무법인 등)를 연결합니다.",
  },
  {
    icon: Wallet,
    step: "03",
    title: "대금 예치 및 관리",
    description:
      "매수자가 에스크로 파트너의 신탁/예치 계좌에 거래 대금을 입금합니다. 자금 관리는 에스크로 파트너가 직접 수행합니다.",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "거래 완료 및 정산",
    description:
      "거래 조건이 모두 충족되면 에스크로 파트너를 통해 매도자에게 대금이 정산됩니다. BlindDeal은 거래 진행 상태를 추적합니다.",
  },
];

const partners = [
  {
    icon: Landmark,
    title: "은행 에스크로",
    description:
      "시중은행 에스크로 파트너의 신탁 계좌를 통한 대금 예치. 금융감독원의 감독 하에 파트너가 직접 운영합니다.",
    suitable: "모든 규모의 부동산 거래",
  },
  {
    icon: Scale,
    title: "법무법인 신탁계좌",
    description:
      "대형 법무법인의 신탁계좌를 통한 자금 관리. 법률 전문가의 감독 하에 거래 조건 충족 여부를 검증합니다.",
    suitable: "M&A, 대규모 부동산 개발 딜",
  },
  {
    icon: Building2,
    title: "신탁회사",
    description:
      "부동산 신탁회사를 통한 자산 관리 및 대금 정산. 부동산 개발 프로젝트에 특화된 에스크로 서비스를 제공합니다.",
    suitable: "부동산 개발, PF 거래",
  },
];

const platformRole = [
  "거래 규모와 유형에 맞는 에스크로 파트너 추천",
  "에스크로 파트너와의 연결 및 초기 상담 지원",
  "딜 프로세스 전반의 상태 추적 및 알림",
  "거래 관련 문서(NDA, LOI 등) 관리 도구 제공",
  "전문가(법무, 회계, 세무) 네트워크 연결",
];

const faqs = [
  {
    question: "BlindDeal이 직접 에스크로를 운영하나요?",
    answer:
      "아닙니다. BlindDeal은 에스크로 서비스를 직접 제공하지 않습니다. 거래 규모와 유형에 적합한 신뢰할 수 있는 에스크로 파트너(은행, 법무법인, 신탁회사 등)를 연결해드립니다. 자금 관리와 정산은 에스크로 파트너가 직접 수행합니다.",
  },
  {
    question: "에스크로 파트너 연결 비용이 있나요?",
    answer:
      "BlindDeal의 파트너 연결 서비스 자체는 멤버십에 포함되어 있습니다. 에스크로 파트너의 서비스 이용료는 해당 파트너의 요금 체계에 따르며, 연결 전 예상 비용을 안내해드립니다.",
  },
  {
    question: "거래 금액에 제한이 있나요?",
    answer:
      "BlindDeal 플랫폼 자체에는 거래 금액 제한이 없습니다. 에스크로 파트너에 따라 최소/최대 거래 금액이 다를 수 있으며, 거래 규모에 맞는 적절한 파트너를 추천합니다.",
  },
  {
    question: "분쟁이 발생하면 어떻게 처리되나요?",
    answer:
      "거래 분쟁은 에스크로 파트너의 약관 및 관련 법령에 따라 처리됩니다. BlindDeal은 분쟁 해결을 위한 전문가(변호사, 중재인) 연결을 지원할 수 있으며, 거래 이력 및 관련 문서를 제공합니다.",
  },
  {
    question: "어떤 에스크로 파트너를 이용할 수 있나요?",
    answer:
      "시중은행, 대형 법무법인, 부동산 신탁회사 등 검증된 금융기관과 제휴하고 있습니다. 거래 상담 시 구체적인 파트너 목록과 각 파트너의 특징을 안내해드립니다.",
  },
];

export default function EscrowGuidePage() {
  return (
    <MainLayout>
      <div className="py-12">
        {/* Hero */}
        <section className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            안전 거래 안내
          </h1>
          <p className="mt-2 text-base text-muted-foreground/80">
            대형 부동산·M&A 거래에는 전문 금융기관의 에스크로 서비스가 필수입니다.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            BlindDeal은 거래 규모와 유형에 맞는 신뢰할 수 있는 에스크로
            파트너(은행, 법무법인, 신탁회사)를 연결하여 안전한 거래를
            지원합니다.
          </p>
        </section>

        {/* How It Works */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            안전 거래 프로세스
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            4단계로 진행되는 파트너 기반 안전 거래 흐름
          </p>

          <div className="mt-10 space-y-0">
            {steps.map((step, index) => (
              <div key={step.step}>
                <div className="flex gap-4 rounded-xl border border-border/50 bg-card/50 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Step {step.step}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowDown className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Escrow Partners */}
        <section className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            에스크로 파트너 유형
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            거래 규모와 유형에 맞는 최적의 파트너를 연결합니다
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {partners.map((partner) => (
              <div
                key={partner.title}
                className="rounded-xl border border-border/50 bg-card/50 p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <partner.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{partner.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {partner.description}
                </p>
                <p className="mt-3 text-xs font-medium text-primary">
                  적합한 거래: {partner.suitable}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Role */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            BlindDeal의 역할
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            플랫폼은 거래를 중개하지 않으며, 딜 정보 연결과 프로세스 관리를
            지원합니다
          </p>

          <div className="mt-10 rounded-xl border border-border/50 bg-card/50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold">플랫폼 지원 범위</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {platformRole.map((role) => (
                <li key={role} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                  <span className="text-sm text-muted-foreground">{role}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-sm text-amber-200/80">
                <strong>유의사항:</strong> BlindDeal은 거래 자금을 직접
                수취하거나 관리하지 않습니다. 모든 자금 관련 업무는 연결된
                에스크로 파트너가 직접 수행하며, 파트너의 약관이 적용됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            자주 묻는 질문
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            안전 거래 서비스에 대해 궁금한 점을 확인하세요
          </p>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-border/50 bg-card/50 p-6"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

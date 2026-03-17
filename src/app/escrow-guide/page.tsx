import type { Metadata } from "next"
import { MainLayout } from "@/components/layout/main-layout";

export const metadata: Metadata = { title: "에스크로 안내" }
import {
  Shield,
  FileCheck,
  Wallet,
  CheckCircle2,
  ArrowDown,
  HelpCircle,
  Lock,
  Users,
} from "lucide-react";

const steps = [
  {
    icon: FileCheck,
    step: "01",
    title: "거래 합의",
    description:
      "매수자와 매도자가 딜 조건에 합의하고, 에스크로 결제를 선택합니다.",
  },
  {
    icon: Wallet,
    step: "02",
    title: "대금 예치",
    description:
      "매수자가 거래 대금을 BlindDeal 에스크로 계좌에 예치합니다. 예치 즉시 매도자에게 입금 확인이 통보됩니다.",
  },
  {
    icon: Shield,
    step: "03",
    title: "안전 보관",
    description:
      "거래 대금은 BlindDeal이 안전하게 보관합니다. 양 당사자의 합의 없이는 자금이 이동하지 않습니다.",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "거래 완료 및 정산",
    description:
      "거래 조건이 모두 충족되면 매수자가 인수 확인을 하고, 에스크로 대금이 매도자에게 정산됩니다.",
  },
];

const buyerBenefits = [
  "대금을 안전하게 예치하고 거래 조건 충족 후 지급",
  "매도자의 의무 이행 전까지 자금 보호",
  "거래 불발 시 환불 절차 보장",
  "모든 거래 내역의 투명한 기록",
];

const sellerBenefits = [
  "매수자의 자금력을 사전에 확인",
  "거래 완료 즉시 신속한 대금 정산",
  "대금 미지급 리스크 제거",
  "분쟁 발생 시 중립적 중재 지원",
];

const faqs = [
  {
    question: "에스크로 수수료는 얼마인가요?",
    answer:
      "에스크로 수수료는 거래 금액의 0.1~0.5%이며, 거래 유형과 금액에 따라 차등 적용됩니다. 정확한 수수료는 거래 진행 시 사전에 안내됩니다.",
  },
  {
    question: "에스크로 예치 기간은 얼마나 되나요?",
    answer:
      "기본 에스크로 예치 기간은 거래 합의 시 설정되며, 일반적으로 7일~90일 사이에서 거래 당사자 간 합의로 정합니다. 기간 연장도 양측 합의 시 가능합니다.",
  },
  {
    question: "거래가 취소되면 환불은 어떻게 되나요?",
    answer:
      "거래 취소 사유에 따라 환불 절차가 진행됩니다. 양측 합의에 의한 취소 시 즉시 환불되며, 일방 귀책 사유에 의한 취소 시 회사의 분쟁 조정 절차를 따릅니다.",
  },
  {
    question: "에스크로 대금은 어디에 보관되나요?",
    answer:
      "에스크로 대금은 회사의 운영 자금과 완전히 분리된 별도의 에스크로 전용 계좌에 보관됩니다. 금융기관과의 협약을 통해 예치금의 안전성을 보장합니다.",
  },
  {
    question: "분쟁이 발생하면 어떻게 처리되나요?",
    answer:
      "거래 분쟁 발생 시 BlindDeal은 중립적 입장에서 양측의 주장을 검토하고 조정을 진행합니다. 조정이 이루어지지 않을 경우 관련 법령에 따른 분쟁 해결 절차를 안내합니다.",
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
            안전한 에스크로 결제
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            BlindDeal의 에스크로 서비스는 거래 대금을 안전하게 보관하여
            매수자와 매도자 모두를 보호합니다. 신뢰할 수 있는 제3자 예치
            시스템으로 안심하고 거래하세요.
          </p>
        </section>

        {/* How It Works */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            에스크로 결제 프로세스
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            4단계로 진행되는 안전한 거래 흐름
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

        {/* Protection */}
        <section className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            거래 당사자 보호
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            매수자와 매도자 모두를 위한 안전장치
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Buyer Protection */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold">매수자 보호</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {buyerBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                    <span className="text-sm text-muted-foreground">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Seller Protection */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                  <Shield className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold">매도자 보호</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {sellerBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                    <span className="text-sm text-muted-foreground">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            자주 묻는 질문
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            에스크로 서비스에 대해 궁금한 점을 확인하세요
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

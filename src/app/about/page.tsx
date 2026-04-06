import type { Metadata } from "next"
import { MainLayout } from "@/components/layout/main-layout";

export const metadata: Metadata = { title: "회사 소개" }
import { Shield, Lightbulb, Award, Mail, MapPin, Phone } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "신뢰",
    description:
      "에스크로 파트너 연결과 NDA 시스템을 통해 모든 거래 당사자의 이익을 보호합니다. 투명한 거래 프로세스로 신뢰를 구축합니다.",
  },
  {
    icon: Award,
    title: "전문성",
    description:
      "부동산과 M&A 분야의 전문가 네트워크를 통해 검증된 딜 정보와 전문적인 자문 서비스를 제공합니다.",
  },
  {
    icon: Lightbulb,
    title: "혁신",
    description:
      "전통적인 거래 방식의 한계를 기술로 극복합니다. 데이터 기반 인사이트와 자동화된 프로세스로 거래 효율을 높입니다.",
  },
];

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="py-12">
        {/* Hero Section */}
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            BlindDeal은 부동산과 M&amp;A 거래의
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              새로운 기준
            </span>
            을 만들어갑니다
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            복잡하고 불투명했던 대형 거래를 누구나 안전하고 효율적으로 진행할 수
            있도록, 기술과 전문성을 결합한 플랫폼을 만들고 있습니다.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mx-auto mt-20 max-w-3xl">
          <div className="rounded-2xl border border-border/50 bg-card/50 p-8 text-center sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our Mission
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              모든 거래가 투명하고 안전하게
              <br />
              이루어지는 세상
            </h2>
            <p className="mt-6 text-muted-foreground">
              BlindDeal은 정보 비대칭과 신뢰 부족으로 인해 많은 기회가
              사라지는 현실에 도전합니다. 매수자와 매도자 모두가 공정한
              조건에서 거래할 수 있는 환경을 만들어, 더 많은 거래가 성사되고
              더 큰 가치가 창출되는 시장을 구현합니다.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            핵심 가치
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            BlindDeal을 이끄는 세 가지 원칙
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-border/50 bg-card/50 p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            연락처
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            BlindDeal에 대해 더 알고 싶으시다면 연락 주세요
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/50 p-6">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">이메일</span>
              <span className="text-sm text-muted-foreground">
                info@blinddeal.com
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/50 p-6">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">전화</span>
              <span className="text-sm text-muted-foreground">
                02-0000-0000
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/50 p-6">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">주소</span>
              <span className="text-sm text-muted-foreground">
                서울특별시 강남구
              </span>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

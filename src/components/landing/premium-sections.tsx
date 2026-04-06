"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  EyeOff,
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
  Building2,
  ArrowRight,
} from "lucide-react";
import { InquiryForm } from "@/components/inquiry/inquiry-form";

/* ─── Shared Animation Variants ─── */

const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ─── Floating Particle for Background ─── */
function FloatingParticle({
  left,
  top,
  size,
  color,
  duration,
  delay,
}: {
  left: string;
  top: string;
  size: number;
  color: string;
  duration: number;
  delay: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full"
      style={{ left, top, width: size, height: size, background: color, filter: `blur(${size < 5 ? 0 : 1}px)` }}
      animate={{ y: [0, -25, 0], x: [0, 12, 0], opacity: [0.15, 0.4, 0.15] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   HOW IT WORKS SECTION
   ═══════════════════════════════════════════════════════════ */

const steps = [
  { step: "01", icon: Plus, title: "딜 등록", description: "부동산 또는 M&A 딜을 등록하세요. 공개/비공개를 직접 선택합니다.", color: "blue" as const },
  { step: "02", icon: Shield, title: "검증 & 매칭", description: "비공개 딜은 자격이 검증된 상대방에게만 노출됩니다. 조건에 맞는 딜을 자동 매칭합니다.", color: "indigo" as const },
  { step: "03", icon: MessageSquare, title: "협상 & 실사(정밀조사)", description: "플랫폼 내에서 안전하게 소통하고, 비밀유지계약(NDA) 서명 후 상세 자료를 공유합니다.", color: "purple" as const },
  { step: "04", icon: TrendingUp, title: "계약 & 안전 거래", description: "전문가 검토, 계약 체결, 신뢰할 수 있는 에스크로 파트너 연결까지 한 곳에서 지원합니다.", color: "cyan" as const },
];

const colorMap = {
  blue: { gradient: "from-blue-500/30 to-blue-600/10", text: "text-blue-400", ring: "ring-blue-500/30", orb: "rgba(59,130,246,0.3)", border: "border-blue-500/20", glow: "rgba(59,130,246,0.15)" },
  indigo: { gradient: "from-indigo-500/30 to-indigo-600/10", text: "text-indigo-400", ring: "ring-indigo-500/30", orb: "rgba(99,102,241,0.3)", border: "border-indigo-500/20", glow: "rgba(99,102,241,0.15)" },
  purple: { gradient: "from-purple-500/30 to-purple-600/10", text: "text-purple-400", ring: "ring-purple-500/30", orb: "rgba(168,85,247,0.3)", border: "border-purple-500/20", glow: "rgba(168,85,247,0.15)" },
  cyan: { gradient: "from-cyan-500/30 to-cyan-600/10", text: "text-cyan-400", ring: "ring-cyan-500/30", orb: "rgba(34,211,238,0.3)", border: "border-cyan-500/20", glow: "rgba(34,211,238,0.15)" },
};

export function PremiumHowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-t border-border/30">
      {/* Parallax gradient background */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          y: bgY,
          background: "linear-gradient(180deg, rgba(59,130,246,0.03) 0%, rgba(99,102,241,0.02) 50%, transparent 100%)",
        }}
      />
      {/* Subtle mesh orb */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-30" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)", filter: "blur(80px)" }} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerStagger}
          className="mb-16 text-center"
        >
          <motion.h2 variants={fadeInUp} className="mb-3 text-2xl font-bold md:text-3xl">
            어떻게 작동하나요?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-sm text-muted-foreground">
            파는 사람도, 사는 사람도 안전하게
          </motion.p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-[2px] md:block">
            <div className="mx-auto w-[calc(100%-120px)] overflow-hidden rounded-full">
              <motion.div
                className="h-full w-full origin-left"
                style={{ background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)", backgroundSize: "200% 100%" }}
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 0.3 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 }}
              />
            </div>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerStagger}
          >
            {steps.map((s, i) => {
              const c = colorMap[s.color];
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] as const },
                    },
                  }}
                  className="group text-center"
                >
                  {/* Step orb */}
                  <div className="relative mx-auto mb-5">
                    {/* Glow halo */}
                    <motion.div
                      className="pointer-events-none absolute -inset-4 rounded-full opacity-0 blur-xl"
                      style={{ background: `radial-gradient(circle, ${c.orb}, transparent 70%)` }}
                      whileInView={{ opacity: 0.5 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.2, duration: 0.8 }}
                    />
                    {/* Number orb with bounce */}
                    <motion.div
                      className={`relative mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} ${c.text} ring-1 ${c.ring}`}
                      whileInView={{ scale: [0.7, 1.08, 1] }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                    >
                      <motion.div whileHover={{ rotate: 5, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Icon className="h-5 w-5" />
                      </motion.div>
                    </motion.div>
                  </div>
                  {/* Step number */}
                  <motion.div
                    className="gradient-text mb-2 text-xs font-bold tracking-widest"
                    whileInView={{ opacity: [0, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
                  >
                    {s.step}
                  </motion.div>
                  <h3 className="text-base font-semibold">{s.title}</h3>
                  <p className="mx-auto mt-2.5 max-w-[240px] text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRUST & SECURITY SECTION
   ═══════════════════════════════════════════════════════════ */

const trustItems = [
  { icon: Shield, title: "에스크로 파트너 연결", description: "거래 규모에 맞는 신뢰할 수 있는 에스크로 파트너(은행, 법무법인)를 연결합니다. 자금 관리는 파트너가 직접 수행합니다.", color: "blue" as const },
  { icon: FileCheck, title: "법적 구속력 있는 비밀유지계약(NDA)", description: "비공개 딜 열람 시 전자 서명하는 비밀유지계약(NDA)은 법적 구속력을 가집니다. IP 주소, 타임스탬프가 자동 기록됩니다.", color: "indigo" as const },
  { icon: Scale, title: "분쟁 해결 지원", description: "거래 과정에서 분쟁 발생 시 전문가(변호사, 중재인) 연결과 거래 이력 제공을 통해 해결을 지원합니다.", color: "purple" as const },
];

export function PremiumTrustSecurity() {
  return (
    <section className="relative overflow-hidden border-t border-border/30">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)", filter: "blur(80px)" }} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerStagger}
          className="mb-16 text-center"
        >
          <motion.h2 variants={fadeInUp} className="mb-3 text-2xl font-bold md:text-3xl">
            안전한 거래를 위한 보호 장치
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-sm text-muted-foreground">
            모든 거래 단계에서 보호받으세요
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerStagger}
        >
          {trustItems.map((item, i) => {
            const c = colorMap[item.color];
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const },
                  },
                }}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="group relative rounded-2xl"
              >
                {/* Glass card with animated gradient border */}
                <div className="animated-border glass-card inner-glow relative overflow-hidden rounded-2xl p-7 transition-colors">
                  {/* Hover glow overlay */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" style={{ background: c.orb }} />

                  {/* Icon with gradient glow halo */}
                  <div className="relative mb-5">
                    {/* Glow halo behind icon */}
                    <div className="pointer-events-none absolute -inset-3 rounded-full opacity-40 blur-lg" style={{ background: `radial-gradient(circle, ${c.glow}, transparent 70%)` }} />
                    <motion.div
                      className={`icon-glow relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} ${c.text} ring-1 ${c.ring}`}
                      whileHover={{ scale: [1, 1.15, 1], transition: { duration: 0.4 } }}
                    >
                      <Icon className="h-7 w-7" />
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WHY BLINDDEAL SECTION
   ═══════════════════════════════════════════════════════════ */

const whyItems = [
  { icon: EyeOff, title: "원하는 만큼만 공개", description: "등록된 딜을 비공개로 운영할 수 있습니다. 딜을 전부 공개할지, 검증된 사람에게만 보여줄지 등록자가 직접 결정합니다. 비밀유지계약(NDA) 서명 후에만 상세 정보에 접근 가능합니다.", color: "blue" as const, hoverAnim: "eyeoff" as const },
  { icon: Shield, title: "단계적 인증 체계", description: "4단계 인증 시스템을 통해 매수자의 자격을 검증합니다. 인증 등급이 높을수록 더 큰 규모의 비공개 딜에 접근할 수 있으며, 검증된 사용자만 접근할 수 있습니다.", color: "indigo" as const, hoverAnim: "shield" as const },
  { icon: Users, title: "전문가 네트워크", description: "법무, 회계, 세무, 감정 전문가가 실사(기업·자산 정밀조사)부터 계약까지 지원합니다. 체계적인 프로세스로 거래를 지원합니다.", color: "purple" as const, hoverAnim: "users" as const },
];

const iconHoverVariants: Record<string, import("framer-motion").TargetAndTransition> = {
  eyeoff: { scale: [1, 0.85, 1.1, 1], rotate: [0, -3, 3, 0], transition: { duration: 0.5 } },
  shield: { scale: [1, 1.2, 1], transition: { duration: 0.4, ease: "easeInOut" } },
  users: { y: [0, -4, 0], transition: { duration: 0.4, ease: "easeOut" } },
};

export function PremiumWhyBlindDeal() {
  return (
    <section className="relative overflow-hidden border-t border-border/30">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full opacity-15" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)", filter: "blur(80px)" }} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerStagger}
          className="mb-16 text-center"
        >
          <motion.h2 variants={fadeInUp} className="mb-3 text-2xl font-bold md:text-3xl">
            왜 <span className="gradient-text">BlindDeal</span>인가?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-sm text-muted-foreground">
            차별화된 거래 환경
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerStagger}
        >
          {whyItems.map((item, i) => {
            const c = colorMap[item.color];
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const },
                  },
                }}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="group relative"
              >
                <div className="animated-border glass-card inner-glow relative overflow-hidden rounded-2xl p-7 transition-colors">
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" style={{ background: c.orb }} />

                  <div className="relative mb-5">
                    <div className="pointer-events-none absolute -inset-3 rounded-full opacity-40 blur-lg" style={{ background: `radial-gradient(circle, ${c.glow}, transparent 70%)` }} />
                    <motion.div
                      className={`icon-glow relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} ${c.text} ring-1 ${c.ring}`}
                      whileHover={iconHoverVariants[item.hoverAnim]}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PARTNERS SECTION
   ═══════════════════════════════════════════════════════════ */

const partners = [
  { icon: Scale, label: "법무", color: "blue" as const },
  { icon: Calculator, label: "회계", color: "indigo" as const },
  { icon: FileSearch, label: "감정평가", color: "purple" as const },
  { icon: Building2, label: "신탁", color: "cyan" as const },
];

const partnerColorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  blue: { border: "border-blue-500/20", bg: "bg-blue-500/5", text: "text-blue-400", glow: "rgba(59,130,246,0.2)" },
  indigo: { border: "border-indigo-500/20", bg: "bg-indigo-500/5", text: "text-indigo-400", glow: "rgba(99,102,241,0.2)" },
  purple: { border: "border-purple-500/20", bg: "bg-purple-500/5", text: "text-purple-400", glow: "rgba(168,85,247,0.2)" },
  cyan: { border: "border-cyan-500/20", bg: "bg-cyan-500/5", text: "text-cyan-400", glow: "rgba(34,211,238,0.2)" },
};

export function PremiumPartners() {
  return (
    <section className="relative overflow-hidden border-t border-border/30">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent" />
      {/* Ambient mesh */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)", filter: "blur(80px)" }} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerStagger}
          className="mb-12 text-center"
        >
          <motion.h2 variants={fadeInUp} className="mb-3 text-2xl font-bold md:text-3xl">
            함께할 <span className="gradient-text">전문 기관</span>을 모집합니다
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-sm text-muted-foreground">
            법무법인, 회계법인, 감정평가법인, 신탁회사 파트너를 찾고 있습니다
          </motion.p>
        </motion.div>

        {/* Partner type cards */}
        <motion.div
          className="mb-12 flex flex-wrap items-center justify-center gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerStagger}
        >
          {partners.map((p, i) => {
            const c = partnerColorMap[p.color];
            const Icon = p.icon;
            return (
              <motion.div
                key={p.label}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
                  },
                }}
                whileHover={{ y: -3, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="group relative"
              >
                <div className={`glass-card relative flex items-center gap-3 overflow-hidden rounded-xl ${c.border} px-6 py-4`}>
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(circle at center, ${c.glow}, transparent 70%)` }} />
                  <motion.div whileHover={{ rotate: 5, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Icon className={`relative h-6 w-6 ${c.text}`} />
                  </motion.div>
                  <span className={`relative text-sm font-semibold ${c.text}`}>{p.label}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <a href="mailto:83482@daum.net">
            <motion.button
              className="glow-button group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600/80 to-indigo-600/80 px-10 py-3.5 text-base font-semibold text-white transition-colors duration-300 hover:from-blue-500 hover:to-indigo-500"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59,130,246,0.25)" }}
              whileTap={{ scale: 0.97 }}
            >
              파트너 제휴 문의
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              <span className="hero-shine-sweep pointer-events-none absolute inset-0" />
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   INQUIRY FORM WRAPPER
   ═══════════════════════════════════════════════════════════ */

export function PremiumInquiryWrapper() {
  return (
    <section id="inquiry-section" className="relative overflow-hidden border-t border-border/30">
      {/* Gradient mesh background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] via-indigo-500/[0.02] to-purple-500/[0.04]" />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-60"
        style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.08), transparent 70%)", filter: "blur(80px)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-40 bottom-0 h-[300px] w-[400px] rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%)", filter: "blur(60px)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          {/* Section Header with staggered reveal */}
          <motion.div
            className="mb-10 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerStagger}
          >
            {/* Badge with spring animation */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 10 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 200, damping: 15 },
                },
              }}
              className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-xs font-medium text-muted-foreground backdrop-blur-xl"
            >
              <MessageSquareHeart className="h-3.5 w-3.5 text-indigo-400" />
              <span>회원가입 없이 간편하게</span>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-2xl font-bold md:text-3xl lg:text-4xl">
              딜을 찾거나 등록하고 <span className="gradient-text">싶으신가요?</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
              회원가입 없이 간편하게 문의하세요. 전문 담당자가 직접 연락드립니다.
            </motion.p>
          </motion.div>

          {/* Glass Card Form Container with animated border */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div className="animated-border glass-card inner-glow rounded-2xl p-6 md:p-10">
              <InquiryForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOTTOM CTA SECTION
   ═══════════════════════════════════════════════════════════ */

export function PremiumBottomCTA() {
  const particles = useMemo(
    () => [
      { left: "10%", top: "20%", size: 4, color: "rgba(96,165,250,0.4)", duration: 9, delay: 0 },
      { left: "25%", top: "60%", size: 3, color: "rgba(129,140,248,0.35)", duration: 11, delay: 1.5 },
      { left: "70%", top: "15%", size: 5, color: "rgba(34,211,238,0.3)", duration: 8, delay: 0.8 },
      { left: "85%", top: "55%", size: 3, color: "rgba(168,85,247,0.35)", duration: 10, delay: 2.2 },
      { left: "50%", top: "75%", size: 4, color: "rgba(96,165,250,0.3)", duration: 12, delay: 3 },
      { left: "35%", top: "30%", size: 3, color: "rgba(129,140,248,0.4)", duration: 7, delay: 1 },
    ],
    []
  );

  return (
    <section className="relative overflow-hidden border-t border-border/30">
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/[0.07] via-indigo-500/[0.05] to-purple-500/[0.07]" />

      {/* Animated mesh orbs */}
      <motion.div
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.12), transparent 70%)", filter: "blur(80px)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -top-20 right-0 h-[300px] w-[300px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)", filter: "blur(60px)" }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid pattern */}
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}

      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerStagger}
        >
          {/* Title with word-by-word reveal */}
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-bold md:text-4xl lg:text-5xl"
          >
            {"보이지 않는 딜을 ".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              >
                {char}
              </motion.span>
            ))}
            <span className="gradient-text">
              {"시작하세요".split("").map((char, i) => (
                <motion.span
                  key={`g-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.27 + i * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-4 max-w-lg text-muted-foreground md:text-lg"
          >
            지금 바로 딜을 등록하거나, 조건에 맞는 딜을 찾아보세요.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/deals/new">
              <motion.span
                className="hero-shine glow-button relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors duration-300 hover:from-blue-500 hover:to-indigo-500"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59,130,246,0.3)" }}
                whileTap={{ scale: 0.97 }}
              >
                <Plus className="h-4 w-4" />
                딜 등록하기
                <span className="hero-shine-sweep pointer-events-none absolute inset-0" />
              </motion.span>
            </Link>
            <Link href="/auth/register">
              <motion.span
                className="hero-shine relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-10 py-3.5 text-base font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.97 }}
              >
                무료 가입하기
                <span className="hero-shine-sweep pointer-events-none absolute inset-0" />
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Lock, ArrowRight, Building2, Briefcase, Eye, EyeOff } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatKRW } from "@/lib/utils"
import { TiltCard } from "@/components/effects/tilt-card"

/* ─── Animation Variants ─── */

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

/* ─── Quick Registration Cards ─── */

export function PremiumRegistrationCards() {
  return (
    <section className="relative border-b border-border/30">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] via-indigo-500/[0.03] to-purple-500/[0.03]" />
      <div className="relative mx-auto max-w-7xl px-4 py-12">
        <motion.div
          className="grid gap-5 md:grid-cols-2"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Real Estate Card */}
          <motion.div variants={item}>
            <Link href="/deals/new?category=real_estate">
              <motion.div
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 backdrop-blur-sm transition-colors hover:bg-white/[0.04]"
                whileHover={{
                  y: -8,
                  boxShadow: "0 25px 50px rgba(59,130,246,0.15)",
                  borderColor: "rgba(59,130,246,0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                {/* Animated gradient border shimmer */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, transparent 50%, rgba(99,102,241,0.15) 100%)",
                  }}
                />
                <div className="relative flex items-start gap-5">
                  <motion.div
                    className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400 ring-1 ring-blue-500/20 transition-all group-hover:ring-blue-500/40"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-blue-500/10 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
                    <Building2 className="relative h-7 w-7" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">부동산 딜 등록</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      오피스, 물류센터, 토지, 리테일, 개발 프로젝트 — 3분이면 등록 완료
                    </p>
                  </div>
                  <motion.span
                    className="ml-auto mt-2 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-blue-400"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                  >
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </motion.span>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* M&A Card */}
          <motion.div variants={item}>
            <Link href="/deals/new?category=ma">
              <motion.div
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 backdrop-blur-sm transition-colors hover:bg-white/[0.04]"
                whileHover={{
                  y: -8,
                  boxShadow: "0 25px 50px rgba(147,51,234,0.15)",
                  borderColor: "rgba(147,51,234,0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                {/* Animated gradient border shimmer */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: "linear-gradient(135deg, rgba(147,51,234,0.15) 0%, transparent 50%, rgba(168,85,247,0.15) 100%)",
                  }}
                />
                <div className="relative flex items-start gap-5">
                  <motion.div
                    className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 text-purple-400 ring-1 ring-purple-500/20 transition-all group-hover:ring-purple-500/40"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-purple-500/10 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
                    <Briefcase className="relative h-7 w-7" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">M&A 딜 등록</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      기업 인수, 지분 매각, 사업부 매각, 합병 — 비공개로도 안전하게
                    </p>
                  </div>
                  <motion.span
                    className="ml-auto mt-2 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-purple-400"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                  >
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </motion.span>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Deal Preview Section ─── */

interface DealPreviewSectionProps {
  children: React.ReactNode
}

export function PremiumDealPreviewSection({ children }: DealPreviewSectionProps) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
      {/* Section header with animated gradient underline */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <motion.h2
            className="text-2xl font-bold md:text-3xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            실시간 딜
            <motion.div
              className="mt-2 h-[2px] rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "100%", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.h2>
          <motion.p
            className="mt-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            이런 딜들이 BlindDeal에 등록됩니다
          </motion.p>
        </div>
        <Link
          href="/deals"
          className="group flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          전체 보기
          <motion.span
            className="inline-block"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </motion.span>
        </Link>
      </div>

      {/* Staggered grid */}
      <motion.div
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {children}
      </motion.div>
    </section>
  )
}

/* ─── Deal Preview Card (Premium) ─── */

export function PremiumDealPreviewCard({
  title,
  category,
  categoryColor,
  dealType,
  location,
  amount,
  tags,
}: {
  title: string
  category: string
  categoryColor: "blue" | "purple"
  dealType: string
  location: string
  amount: number | null
  tags: string[]
}) {
  return (
    <motion.div variants={item}>
      <TiltCard maxTilt={3}>
        <Link href="/auth/register" className="block">
          <motion.div
            className="group cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-colors"
            whileHover={{
              borderColor: "rgba(255,255,255,0.15)",
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Inner glow on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                boxShadow: "inset 0 0 30px rgba(59,130,246,0.06)",
              }}
            />
            <div className="p-5">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={
                    categoryColor === "blue"
                      ? "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20"
                      : "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20"
                  }
                >
                  {category}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                >
                  <Eye className="mr-1 h-3 w-3" />
                  공개
                </Badge>
                <span className="ml-auto text-xs text-muted-foreground/60">{dealType}</span>
              </div>
              {/* Verified badge with green glow */}
              <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                <span className="relative inline-block h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 pulse-dot" />
                  <span className="absolute inset-[-2px] rounded-full bg-emerald-400/30 animate-ping" style={{ animationDuration: "2s" }} />
                </span>
                검증완료
              </div>
              <h3 className="mt-1.5 text-base font-semibold leading-tight">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground/70">{location}</p>
              {/* Price with gradient text */}
              <div className="mt-4">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-lg font-bold text-transparent">
                  {formatKRW(amount)}
                </span>
              </div>
              {/* Tags as glass pills */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-muted-foreground/70 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </Link>
      </TiltCard>
    </motion.div>
  )
}

/* ─── Blind Deal Card (Premium) ─── */

export function PremiumBlindDealCard({
  category,
  categoryColor,
  dealType,
  industry,
  requiredLevel,
}: {
  category: string
  categoryColor: "blue" | "purple"
  dealType: string
  industry: string
  requiredLevel: number
}) {
  return (
    <motion.div variants={item}>
      <Card className="group relative overflow-hidden border-red-500/10 bg-white/[0.02] p-0 backdrop-blur-sm transition-all hover:border-amber-500/20">
        {/* Animated red/amber ambient glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              "inset 0 0 30px rgba(239,68,68,0.03), 0 0 40px rgba(239,68,68,0.02)",
              "inset 0 0 40px rgba(245,158,11,0.05), 0 0 60px rgba(245,158,11,0.03)",
              "inset 0 0 30px rgba(239,68,68,0.03), 0 0 40px rgba(239,68,68,0.02)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />

        {/* Animated noise/scanline overlay */}
        <style>{`
          @keyframes scanline-drift {
            0% { background-position-y: 0; }
            100% { background-position-y: 100px; }
          }
        `}</style>
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)",
            backgroundSize: "100% 4px",
            animation: "scanline-drift 10s linear infinite",
          }}
        />

        {/* CLASSIFIED stamp with dramatic entrance */}
        <motion.div
          className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none"
          initial={{ scale: 2, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <div className="border-2 border-red-500/60 rounded px-4 py-1.5">
            <span className="text-red-500/70 font-mono font-bold text-sm tracking-[0.3em] uppercase">
              CLASSIFIED
            </span>
          </div>
          <div className="text-center mt-1">
            <span className="text-red-500/40 font-mono text-[10px] tracking-wider">
              인증 등급 {requiredLevel} 이상
            </span>
          </div>
        </motion.div>

        {/* Top section with badges */}
        <div className="relative z-20 flex items-center gap-2 px-5 pt-5">
          <Badge
            variant="secondary"
            className={
              categoryColor === "blue"
                ? "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20"
                : "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20"
            }
          >
            {category}
          </Badge>
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
          >
            <EyeOff className="mr-1 h-3 w-3" />
            비공개
          </Badge>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
            관리자 검증
          </span>
          <span className="ml-auto text-xs text-muted-foreground/60">{dealType}</span>
        </div>

        {/* Blurred content */}
        <div className="relative mt-3 px-5">
          <div className="relative select-none">
            <p
              className="redacted text-base font-semibold tracking-wider"
              aria-hidden="true"
            >
              <span className="inline-block">██████</span>{" "}
              <span className="inline-block">████</span>{" "}
              <span className="inline-block">████████</span>
            </p>
            <div className="absolute inset-0 backdrop-blur-[2px]" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground/60">{industry}</p>
          <div className="mt-3">
            <div className="relative inline-block select-none">
              <span className="redacted text-lg font-bold">&#8361;██,███,███,███</span>
              <div className="absolute inset-0 backdrop-blur-[3px]" />
            </div>
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Ambient glow */}
        <motion.div
          className="pointer-events-none absolute -bottom-4 left-1/2 h-24 w-48 -translate-x-1/2 rounded-full blur-3xl"
          animate={{
            backgroundColor: [
              "rgba(239,68,68,0.06)",
              "rgba(245,158,11,0.08)",
              "rgba(239,68,68,0.06)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />

        {/* Lock overlay */}
        <div className="relative z-10 mx-5 mb-5 mt-5">
          <div className="glass-card flex flex-col items-center gap-2.5 rounded-xl px-4 py-5">
            {/* Pulsing lock icon */}
            <motion.div
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Lock className="h-4.5 w-4.5 text-white/80" />
            </motion.div>
            <span className="text-xs font-medium text-white/80">비공개 딜</span>
            <span className="text-[10px] text-white/40">
              인증 등급 {requiredLevel} 이상 열람 가능
            </span>
            <Link
              href="/profile/verification"
              className="group/btn relative mt-1 overflow-hidden rounded-full border border-white/10 bg-white/5 px-5 py-1.5 text-[10px] font-medium text-white/60 transition-all hover:border-blue-400/30 hover:text-white"
            >
              <span className="relative z-10">인증하기</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 transition-opacity group-hover/btn:opacity-100" />
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

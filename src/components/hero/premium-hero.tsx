"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ArrowRight, Lock } from "lucide-react";

/* ─── Floating Particle ─── */
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
      style={{
        left,
        top,
        width: size,
        height: size,
        background: color,
        filter: `blur(${size < 4 ? 0 : 1}px)`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        opacity: [0.2, 0.5, 0.2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* ─── Scroll Indicator (mouse icon with bouncing dot) ─── */
function ScrollIndicator() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
    >
      <div className="relative flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1">
        <motion.div
          className="h-2 w-1 rounded-full bg-gradient-to-b from-blue-400 to-indigo-400"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
      </div>
      <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground/30">
        Scroll
      </span>
    </motion.div>
  );
}

/* ─── Main Premium Hero ─── */
export function PremiumHero() {
  const titleWords1 = ["보이지", "않는", "곳에서"];
  const titleWords2 = ["가장", "큰", "거래", "가", "이루어집니다"];

  const particles = useMemo(
    () => [
      { left: "8%", top: "18%", size: 3, color: "rgba(96,165,250,0.5)", duration: 8, delay: 0 },
      { left: "22%", top: "42%", size: 4, color: "rgba(129,140,248,0.4)", duration: 10, delay: 1.2 },
      { left: "72%", top: "12%", size: 3, color: "rgba(34,211,238,0.5)", duration: 7, delay: 0.5 },
      { left: "88%", top: "48%", size: 4, color: "rgba(168,85,247,0.4)", duration: 11, delay: 2 },
      { left: "52%", top: "8%", size: 2, color: "rgba(96,165,250,0.4)", duration: 9, delay: 3 },
      { left: "38%", top: "58%", size: 2, color: "rgba(129,140,248,0.6)", duration: 6, delay: 1.5 },
      { left: "62%", top: "35%", size: 3, color: "rgba(34,211,238,0.4)", duration: 12, delay: 2.5 },
      { left: "15%", top: "62%", size: 2, color: "rgba(168,85,247,0.5)", duration: 8, delay: 0.8 },
    ],
    []
  );

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden border-b border-border/30">
      {/* ─── Background layers ─── */}

      {/* Animated gradient mesh orbs */}
      <motion.div
        className="pointer-events-none absolute h-[700px] w-[700px] rounded-full opacity-30"
        style={{ filter: "blur(120px)", background: "radial-gradient(circle, rgba(59,130,246,0.35), transparent 70%)" }}
        animate={{
          x: ["-10%", "15%", "-5%", "-10%"],
          y: ["-20%", "5%", "-15%", "-20%"],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute h-[600px] w-[600px] rounded-full opacity-25"
        style={{ filter: "blur(100px)", background: "radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)" }}
        animate={{
          x: ["20%", "-10%", "25%", "20%"],
          y: ["10%", "-20%", "15%", "10%"],
          scale: [1.1, 0.9, 1.15, 1.1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute h-[500px] w-[500px] rounded-full opacity-20"
        style={{ filter: "blur(100px)", background: "radial-gradient(circle, rgba(168,85,247,0.3), transparent 70%)" }}
        animate={{
          x: ["-15%", "10%", "-20%", "-15%"],
          y: ["15%", "-10%", "20%", "15%"],
          scale: [0.95, 1.1, 1, 0.95],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dot grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Radial vignette from edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,14,26,0.7) 100%)",
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}

      {/* ─── Content ─── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 md:py-40">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            className="mb-8 inline-flex items-center gap-2.5 overflow-hidden rounded-full text-xs font-medium text-muted-foreground"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero-badge-border relative inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-xl">
              <Lock className="h-3.5 w-3.5 text-blue-400" />
              <span>검증된 딜만, 원하는 만큼만 공개합니다</span>
              <span className="h-1 w-1 rounded-full bg-blue-400 pulse-dot" />
            </span>
          </motion.div>

          {/* Main Heading — staggered word reveal */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block overflow-hidden">
              {titleWords1.map((word, i) => (
                <motion.span
                  key={`w1-${i}`}
                  className="mr-[0.25em] inline-block"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.15,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden">
              {titleWords2.map((word, i) => {
                const isGradient = word === "가장" || word === "큰" || word === "거래";
                return (
                  <motion.span
                    key={`w2-${i}`}
                    className={`inline-block ${i < titleWords2.length - 1 ? "mr-[0.25em]" : ""} ${isGradient ? "gradient-text" : ""}`}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: (titleWords1.length + i) * 0.15,
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            부동산과 M&A(인수합병) 딜을 공개 또는 비공개로 등록하세요.
            <br className="hidden md:block" />
            검증된 상대방과 안전한 프로세스 위에서 거래합니다.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Primary CTA — 딜 등록하기 */}
            <Link href="/deals/new">
              <motion.button
                className="hero-shine group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors duration-300 hover:from-blue-500 hover:to-indigo-500"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(59,130,246,0.3)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Plus className="h-4 w-4" />
                딜 등록하기
                {/* Shine sweep overlay */}
                <span className="hero-shine-sweep pointer-events-none absolute inset-0" />
              </motion.button>
            </Link>

            {/* Secondary CTA — 딜 둘러보기 */}
            <Link href="/deals">
              <motion.button
                className="hero-shine group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-white/[0.12] bg-white/[0.03] px-10 py-3.5 text-base font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.06]"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(255,255,255,0.05)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                딜 둘러보기
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                <span className="hero-shine-sweep pointer-events-none absolute inset-0" />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <ScrollIndicator />
        </motion.div>
      </div>
    </section>
  );
}

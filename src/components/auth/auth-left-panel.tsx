"use client"

import Link from "next/link"
import { Shield, Wallet, Users, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const featureCardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function AuthLeftPanel() {
  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-12 lg:flex">
      {/* Morphing ambient blobs with motion.div */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-[400px] h-[400px] opacity-20"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            filter: "blur(80px)",
          }}
          animate={{
            borderRadius: [
              "40% 60% 70% 30% / 40% 50% 60% 50%",
              "70% 30% 50% 50% / 30% 60% 40% 70%",
              "30% 60% 40% 70% / 50% 30% 70% 40%",
              "50% 40% 60% 30% / 60% 50% 30% 60%",
              "40% 60% 70% 30% / 40% 50% 60% 50%",
            ],
          }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-[350px] h-[350px] opacity-15"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            filter: "blur(80px)",
          }}
          animate={{
            borderRadius: [
              "60% 40% 30% 70% / 50% 60% 40% 50%",
              "30% 60% 40% 70% / 50% 30% 70% 40%",
              "70% 30% 50% 50% / 30% 60% 40% 70%",
              "40% 60% 70% 30% / 40% 50% 60% 50%",
              "60% 40% 30% 70% / 50% 60% 40% 50%",
            ],
          }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 w-[300px] h-[300px] opacity-10"
          style={{
            background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            filter: "blur(80px)",
          }}
          animate={{
            borderRadius: [
              "50% 50% 40% 60% / 60% 40% 50% 50%",
              "40% 60% 70% 30% / 40% 50% 60% 50%",
              "60% 40% 30% 70% / 50% 60% 40% 50%",
              "50% 50% 40% 60% / 60% 40% 50% 50%",
            ],
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
          animate={{ backgroundPosition: ["0px 0px", "30px 30px"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 opacity-50 blur-md" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <span className="text-base font-bold text-white">B</span>
            </div>
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">
            BlindDeal
          </span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/70"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          홈으로 돌아가기
        </Link>
      </motion.div>

      <motion.div
        className="relative z-10 space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-4" variants={fadeUp}>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">
            보이지 않는 곳에서
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              가장 큰 거래가
            </span>
            <br />
            이루어집니다
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-white/50">
            부동산과 M&A 딜 정보를 연결하는 프리미엄 비공개 플랫폼
          </p>
        </motion.div>

        <div className="space-y-5">
          <motion.div className="group flex items-start gap-4" variants={featureCardVariants}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-blue-400 ring-1 ring-white/[0.08] backdrop-blur-sm transition-all duration-300 group-hover:bg-white/[0.08] group-hover:ring-white/[0.15] group-hover:shadow-lg group-hover:shadow-blue-500/10">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">비공개 딜</p>
              <p className="mt-0.5 text-xs text-white/40">검증된 참여자만 접근 가능한 프리미엄 거래</p>
            </div>
          </motion.div>
          <motion.div className="group flex items-start gap-4" variants={featureCardVariants}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-blue-400 ring-1 ring-white/[0.08] backdrop-blur-sm transition-all duration-300 group-hover:bg-white/[0.08] group-hover:ring-white/[0.15] group-hover:shadow-lg group-hover:shadow-blue-500/10">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">안전 거래 파트너 연결</p>
              <p className="mt-0.5 text-xs text-white/40">신뢰할 수 있는 에스크로 파트너 연결</p>
            </div>
          </motion.div>
          <motion.div className="group flex items-start gap-4" variants={featureCardVariants}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-blue-400 ring-1 ring-white/[0.08] backdrop-blur-sm transition-all duration-300 group-hover:bg-white/[0.08] group-hover:ring-white/[0.15] group-hover:shadow-lg group-hover:shadow-blue-500/10">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">전문가 네트워크</p>
              <p className="mt-0.5 text-xs text-white/40">업계 최고의 전문가 그룹과 함께</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <p className="text-xs text-white/30">
          &copy; 2026 BlindDeal. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}

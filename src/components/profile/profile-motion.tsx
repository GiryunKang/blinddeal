"use client"

import { motion } from "framer-motion"

export function MotionProfileHeader({ children }: { children: React.ReactNode }) {
  return (
    <motion.h1
      className="mb-6 text-2xl font-bold text-foreground sm:text-3xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
        {children}
      </span>
    </motion.h1>
  )
}

export function MotionAvatarRing({ children }: { children: React.ReactNode }) {
  return (
    <div className="group/avatar-wrap relative shrink-0">
      <motion.div
        className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-0 blur-[2px] transition-opacity duration-300 group-hover/avatar-wrap:opacity-70"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, ease: "linear", repeat: Infinity }}
      />
      <div className="relative rounded-full bg-background p-[2px] transition-transform duration-300 group-hover/avatar-wrap:scale-105">
        {children}
      </div>
    </div>
  )
}

export function MotionProfileCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function MotionActionButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export function MotionQuickLinkCard({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  )
}

export function MotionVerifiedBadge({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="inline-flex"
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(16, 185, 129, 0.4)",
          "0 0 0 6px rgba(16, 185, 129, 0)",
          "0 0 0 0 rgba(16, 185, 129, 0.4)",
        ],
      }}
      transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
      style={{ borderRadius: "9999px" }}
    >
      {children}
    </motion.div>
  )
}

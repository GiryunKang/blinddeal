"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Eye, Heart, Lock, Building2 } from "lucide-react"
import { formatKRW } from "@/lib/utils"
import { ClassifiedStamp } from "@/components/effects/classified-stamp"

interface DealCardProps {
  deal: {
    id: string
    slug: string
    title: string
    description: string
    deal_category: string
    visibility: string
    asking_price: number | null
    thumbnail_url: string | null
    view_count?: number | null
    interest_count?: number | null
    owner?: {
      display_name?: string | null
      company_name?: string | null
    } | null
  }
  isBlind?: boolean
  index?: number
}

export function DealCard({ deal, isBlind = false, index = 0 }: DealCardProps) {
  const categoryLabel = deal.deal_category === "real_estate" ? "부동산" : "M&A"
  const categoryBadgeClass =
    deal.deal_category === "real_estate"
      ? "bg-blue-500/20 border-blue-500/30 text-blue-300"
      : "bg-purple-500/20 border-purple-500/30 text-purple-300"

  const visibilityLabel = deal.visibility === "public" ? "공개" : "비공개"
  const visibilityBadgeClass =
    deal.visibility === "public"
      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
      : "bg-amber-500/20 border-amber-500/30 text-amber-300"

  // Parallax state for image
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const offsetX = -((e.clientX - centerX) / (rect.width / 2)) * 5
    const offsetY = -((e.clientY - centerY) / (rect.height / 2)) * 5
    setParallax({ x: offsetX, y: offsetY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setParallax({ x: 0, y: 0 })
  }, [])

  return (
    <Link href={isBlind ? "#" : `/deals/${deal.slug}`} className="group block">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative rounded-2xl overflow-hidden bg-card border ${
          isBlind
            ? "watermark-confidential border-red-500/15"
            : "border-border/50"
        }`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: index * 0.06,
          ease: [0.16, 1, 0.3, 1] as const,
        }}
        whileHover={{
          y: -6,
          boxShadow: isBlind
            ? "0 20px 60px -15px rgba(239,68,68,0.12)"
            : "0 20px 60px -15px rgba(59,130,246,0.18)",
          borderColor: isBlind
            ? "rgba(239,68,68,0.4)"
            : "rgba(59,130,246,0.3)",
          transition: { type: "spring", stiffness: 300, damping: 25 },
        }}
      >
        {/* Image Area with hover scale */}
        <motion.div
          className="relative aspect-[16/10] overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

          {/* Category badge - glass effect with backdrop-blur */}
          <div className="absolute top-3 left-3 z-20">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${categoryBadgeClass}`}
            >
              {categoryLabel}
            </span>
          </div>

          {/* Visibility badge */}
          <div className="absolute top-3 right-3 z-20">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium backdrop-blur-md border ${visibilityBadgeClass}`}
            >
              {deal.visibility === "private" && <Lock className="w-2.5 h-2.5" />}
              {visibilityLabel}
            </span>
          </div>

          {/* Price overlay at bottom */}
          <div className="absolute bottom-3 left-4 z-20">
            {!isBlind && (
              <p className="text-lg font-bold text-white drop-shadow-lg">
                {deal.asking_price ? formatKRW(deal.asking_price) : "가격 협의"}
              </p>
            )}
          </div>

          {/* Thumbnail or placeholder with parallax */}
          {deal.thumbnail_url ? (
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{
                transform: `translate(${parallax.x}px, ${parallax.y}px) scale(1.05)`,
              }}
            >
              <Image
                src={deal.thumbnail_url}
                alt={isBlind ? "비공개 딜" : deal.title}
                fill
                className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                  isBlind ? "blur-xl scale-110" : ""
                }`}
              />
            </div>
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br from-card via-muted to-muted/80 flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-105 ${
                isBlind ? "blur-md" : ""
              }`}
              style={{
                transform: `translate(${parallax.x}px, ${parallax.y}px)`,
              }}
            >
              <Building2 className="w-12 h-12 text-muted-foreground/20" />
            </div>
          )}
        </motion.div>

        {/* Blind overlay with dramatic scanline + classified stamp */}
        {isBlind && (
          <>
            {/* Dramatic scanline effect */}
            <div
              className="absolute inset-0 pointer-events-none z-[25]"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.015) 2px, rgba(255,0,0,0.015) 4px)',
                backgroundSize: '100% 4px',
                animation: 'scanline-scroll 6s linear infinite',
              }}
            />
            <style>{`
              @keyframes scanline-scroll {
                0% { background-position-y: 0; }
                100% { background-position-y: 100px; }
              }
            `}</style>
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
              {/* Classified stamp with dramatic entrance */}
              <motion.div
                initial={{ scale: 2.5, opacity: 0, rotate: -20 }}
                whileInView={{ scale: 1, opacity: 1, rotate: -12 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
              >
                <ClassifiedStamp level={3} />
              </motion.div>

              {/* Pulsing lock icon */}
              <motion.div
                className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" as const }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-500/15"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" as const }}
                />
                <Lock className="relative h-6 w-6 text-white/80" />
              </motion.div>
              <p className="mt-3 text-sm font-medium text-white/70">인증 후 열람 가능</p>
              <div className="mt-2 flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 backdrop-blur-md">
                <Lock className="h-3 w-3 text-amber-400" />
                <span className="text-[11px] text-amber-400">열람 권한 필요</span>
              </div>
            </div>
          </>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          {isBlind ? (
            <h3 className="line-clamp-1 select-none text-lg font-semibold">
              <span className="redacted">██████ ████ ██████</span>
            </h3>
          ) : (
            <h3 className="line-clamp-1 text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-blue-400">
              {deal.title}
            </h3>
          )}

          {/* Description */}
          {isBlind ? (
            <p className="line-clamp-2 select-none text-sm mt-1.5">
              <span className="redacted">████████ ██████ ████ ██████████</span>
            </p>
          ) : (
            <p className="line-clamp-2 text-sm text-muted-foreground mt-1.5">
              {deal.description}
            </p>
          )}

          {/* Price with gradient text */}
          {!isBlind && (
            <div className="mt-3 text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {deal.asking_price ? formatKRW(deal.asking_price) : "가격 협의"}
            </div>
          )}
          {isBlind && (
            <div className="mt-3 select-none text-xl font-bold">
              <span className="redacted">&#8361;██,███,███,███</span>
            </div>
          )}

          {/* Stats row */}
          {!isBlind && (
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {(deal.view_count ?? 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {(deal.interest_count ?? 0).toLocaleString()}
              </span>
              <span className="ml-auto max-w-[120px] truncate text-muted-foreground/60">
                {deal.owner?.company_name || deal.owner?.display_name || "익명"}
              </span>
            </div>
          )}

          {/* Tags as glass pills */}
          {!isBlind && (
            <div className="flex gap-1.5 mt-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] text-muted-foreground border border-white/[0.08] backdrop-blur-sm">
                {categoryLabel}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] text-muted-foreground border border-white/[0.08] backdrop-blur-sm">
                {visibilityLabel}
              </span>
            </div>
          )}
        </div>

        {/* "자세히 보기 →" hint on hover with slide-up */}
        {!isBlind && (
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-xs text-blue-400 font-medium">
            자세히 보기 →
          </div>
        )}
      </motion.div>
    </Link>
  )
}

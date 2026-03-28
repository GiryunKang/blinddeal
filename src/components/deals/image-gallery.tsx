"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Building } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  title: string
}

function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const startX = useRef(0)
  const startY = useRef(0)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    startX.current = e.clientX
    startY.current = e.clientY
  }, [])

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const dx = e.clientX - startX.current
      const dy = e.clientY - startY.current
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) onSwipeLeft()
        else onSwipeRight()
      }
    },
    [onSwipeLeft, onSwipeRight]
  )

  return { onPointerDown, onPointerUp }
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const hasImages = images.length > 0

  const goTo = useCallback(
    (index: number) => {
      if (images.length === 0) return
      setActiveIndex((index + images.length) % images.length)
    },
    [images.length]
  )

  const prev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex])
  const next = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex])

  const swipeHandlers = useSwipe(next, prev)

  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false)
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [lightboxOpen, prev, next])

  if (!hasImages) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl border border-border bg-card">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Building className="size-12 opacity-30" />
          <p className="text-sm">등록된 이미지가 없습니다</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main image with swipe */}
        <div
          className="group relative aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-xl border border-border bg-card touch-pan-y"
          onClick={() => setLightboxOpen(true)}
          {...swipeHandlers}
        >
          <Image
            src={images[activeIndex]}
            alt={`${title} - ${activeIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 70vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          {images.length > 1 && (
            <>
              <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                {activeIndex + 1} / {images.length}
              </div>
              {/* Dot indicators for mobile */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails (desktop) */}
        {images.length > 1 && (
          <div className="hidden gap-2 overflow-x-auto pb-1 md:flex">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative size-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
                  i === activeIndex
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} 썸네일 ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox with swipe */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxOpen(false)
          }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          <div className="absolute left-4 top-4 z-10 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-4 z-10 hidden size-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:flex"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          <div
            className="relative h-[80vh] w-[90vw] max-w-5xl touch-pan-y"
            {...swipeHandlers}
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} - ${activeIndex + 1}`}
              fill
              className="object-contain transition-opacity duration-300"
              sizes="90vw"
              priority
            />
          </div>

          {images.length > 1 && (
            <button
              onClick={next}
              className="absolute right-4 z-10 hidden size-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:flex"
            >
              <ChevronRight className="size-6" />
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-lg bg-black/50 p-2 backdrop-blur-sm">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative size-12 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                    i === activeIndex
                      ? "border-white"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`썸네일 ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

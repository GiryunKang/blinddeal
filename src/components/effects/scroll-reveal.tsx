"use client"
import { useRef, useEffect, useState } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "right" | "scale"
}

export function ScrollReveal({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const transforms = {
    up: "translateY(30px)",
    left: "translateX(-30px)",
    right: "translateX(30px)",
    scale: "scale(0.92)",
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[direction],
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

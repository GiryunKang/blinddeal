"use client"
import { useRef, useEffect, useState } from "react"

export function TextReveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100 + delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <div style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
        transition: `transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}>
        {children}
      </div>
    </div>
  )
}

"use client"
import { useRef, useState, useCallback, useEffect } from "react"

export function SpotlightHero({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  if (isTouchDevice) {
    return <div className="relative overflow-hidden">{children}</div>
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden"
      style={{
        background: `radial-gradient(600px circle at ${position.x}% ${position.y}%, rgba(59, 130, 246, 0.08), transparent 40%)`,
      }}
    >
      {/* Subtle moving light dot */}
      <div
        className="pointer-events-none absolute w-[600px] h-[600px] rounded-full opacity-30 blur-[100px] transition-all duration-300 ease-out"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)",
        }}
      />
      {children}
    </div>
  )
}

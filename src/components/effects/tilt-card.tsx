"use client"
import { useRef, useState, useCallback } from "react"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number
  glare?: boolean
}

export function TiltCard({ children, className = "", maxTilt = 3, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState("")
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -maxTilt * 2
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * maxTilt * 2
    setTransform(`perspective(800px) rotateX(${x}deg) rotateY(${y}deg)`)
    setGlarePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [maxTilt])

  const handleLeave = useCallback(() => {
    setTransform("")
    setGlarePos({ x: 50, y: 50 })
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{
        transform: transform || "perspective(800px) rotateX(0) rotateY(0)",
        transition: transform ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
      {glare && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
            transition: transform ? "none" : "background 0.4s ease-out",
            borderRadius: "inherit",
          }}
        />
      )}
    </div>
  )
}

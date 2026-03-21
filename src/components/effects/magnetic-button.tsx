"use client"
import { useRef, useState, useCallback } from "react"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({ children, className = "", strength = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || window.matchMedia("(hover: none)").matches) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setOffset({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    })
  }, [strength])

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      className={className}
      style={{
        display: "inline-block",
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: offset.x === 0 ? "transform 0.4s ease-out" : "transform 0.15s ease-out",
      }}
    >
      {children}
    </div>
  )
}

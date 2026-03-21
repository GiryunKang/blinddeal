"use client"

import { useState, useEffect } from "react"

const PARTICLE_COLORS = ["#ef4444", "#f97316", "#ec4899", "#8b5cf6", "#ef4444", "#f97316"]

export function HeartBurst({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<number[]>([])

  useEffect(() => {
    if (trigger === 0) return
    const ids = Array.from({ length: 6 }, (_, i) => i)
    setParticles(ids)
    const timer = setTimeout(() => setParticles([]), 700)
    return () => clearTimeout(timer)
  }, [trigger])

  if (particles.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map((i) => {
        const angle = i * 60 // 6 particles, 60deg apart
        return (
          <span
            key={`${trigger}-${i}`}
            className="absolute left-1/2 top-1/2"
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: PARTICLE_COLORS[i],
              animationName: "heart-burst-particle",
              animationDuration: "0.6s",
              animationTimingFunction: "ease-out",
              animationFillMode: "forwards",
              ["--burst-angle" as string]: `${angle}deg`,
              transform: `rotate(${angle}deg) translateY(-4px)`,
              marginLeft: -2.5,
              marginTop: -2.5,
            }}
          />
        )
      })}
      <style>{`
        @keyframes heart-burst-particle {
          0% {
            opacity: 1;
            transform: rotate(var(--burst-angle)) translateY(-4px) scale(1);
          }
          100% {
            opacity: 0;
            transform: rotate(var(--burst-angle)) translateY(-22px) scale(0);
          }
        }
      `}</style>
    </div>
  )
}

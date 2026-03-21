"use client"
import { useRef, useEffect, useState } from "react"

interface CountUpProps {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function CountUp({ target, duration = 1500, suffix = "", prefix = "", className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started, target, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  )
}

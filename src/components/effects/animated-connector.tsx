"use client"
import { useRef, useEffect, useState } from "react"

export function AnimatedConnector() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="mx-auto h-full w-[calc(100%-120px)] rounded-full overflow-hidden">
      <div
        className="step-connector h-full opacity-30"
        style={{
          width: visible ? "100%" : "0%",
          transition: "width 1.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </div>
  )
}

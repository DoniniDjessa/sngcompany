"use client"
import { useEffect, useRef, useState } from "react"

/** Counts up to the number inside `value` ("1 500+", "98%", "24/7" stays as is) once it scrolls into view */
export default function Counter({ value, duration = 1600 }: { value: string; duration?: number }) {
  const match = value.match(/^([\d\s ]+)(.*)$/)
  const target = match && !value.includes("/") ? Number(match[1].replace(/\D/g, "")) : null
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (target === null || !ref.current) return
    const el = ref.current
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        setN(Math.round(target * (1 - Math.pow(1 - t, 3))))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, duration])

  if (target === null) return <span>{value}</span>
  return <span ref={ref}>{n.toLocaleString("fr-FR")}{match![2]}</span>
}

'use client'

// 인뷰 시 rAF easeOut 카운트업 (yamok-grandhill 전용 연출)
// SSR 텍스트는 최종값(end) 그대로 → SEO/no-JS 안전. 인뷰 시에만 startFrom→end로 카운트.
import { useEffect, useRef, useState, type CSSProperties } from 'react'

interface Props {
  end: number
  suffix?: string
  prefix?: string
  startFrom?: number
  duration?: number
  className?: string
  style?: CSSProperties
}

export default function CountUp({
  end,
  suffix = '',
  prefix = '',
  startFrom = 0,
  duration = 1600,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  const [val, setVal] = useState(end) // 초기/SSR = 최종값

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true
            obs.disconnect()
            const t0 = performance.now()
            setVal(startFrom)
            const tick = (now: number) => {
              const p = Math.min((now - t0) / duration, 1)
              const eased = 1 - Math.pow(1 - p, 3)
              setVal(Math.round(startFrom + (end - startFrom) * eased))
              if (p < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [end, startFrom, duration])

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  )
}

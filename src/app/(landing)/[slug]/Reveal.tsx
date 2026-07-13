'use client'

// 스크롤 인뷰 리빌 래퍼 (yamok-grandhill 전용 연출)
// 핵심: enabled=false(default)면 wrapper 없이 children 그대로 반환 → 타 슬러그 DOM 100% 불변.
// SSR/no-JS는 항상 visible, 마운트 후 "뷰포트 아래" 요소에만 reveal-hidden → 인뷰 시 reveal-in.
import { useEffect, useRef, useState, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  enabled?: boolean
  /** stagger용 지연(ms) */
  delay?: number
  className?: string
  /** 리빌 방향 variant (default 'up' → 기존 동작 100% 동일) */
  variant?: 'up' | 'left' | 'right' | 'zoom'
}

export default function Reveal({ children, enabled = false, delay = 0, className, variant = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'idle' | 'hidden' | 'in'>('idle')

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return
    // 모션 최소화 사용자 → 리빌 스킵(항상 visible)
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    // 이미 뷰포트 상단/내부면 그대로 visible로 둠 (초기 진입 요소 flash 방지)
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.85) return

    setState('hidden')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setState('in')
            obs.disconnect()
          }
        })
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [enabled])

  if (!enabled) return <>{children}</>

  const revealInClass =
    variant === 'left'
      ? 'reveal-in-left'
      : variant === 'right'
        ? 'reveal-in-right'
        : variant === 'zoom'
          ? 'reveal-in-zoom'
          : 'reveal-in'

  const cls = [
    className,
    state === 'hidden' ? 'reveal-hidden' : '',
    state === 'in' ? revealInClass : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={ref}
      className={cls || undefined}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

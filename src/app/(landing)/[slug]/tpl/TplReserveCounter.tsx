'use client'

// YamokReserveCounter 복제 — 관심고객 등록 소셜프루프 카운터. 표시값 = baseline(config) + 실제 DB 등록수.
import { useEffect, useState } from 'react'
import CountUp from '../CountUp'

interface Props {
  pageId: string
  baseline: number
  /** 밝은 배경=light / 어두운 배경=dark / 반짝이는 골드 숫자=glow */
  variant?: 'light' | 'dark' | 'glow'
  className?: string
}

export default function TplReserveCounter({ pageId, baseline, variant = 'dark', className = '' }: Props) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let alive = true
    fetch(`/api/landing-inquiry/count?page_id=${encodeURIComponent(pageId)}`)
      .then((r) => (r.ok ? r.json() : { count: 0 }))
      .then((d) => {
        if (alive && typeof d?.count === 'number') setCount(d.count)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [pageId])

  const total = baseline + count
  const isGlow = variant === 'glow'
  const numColor = variant === 'light' ? '#B45309' : '#F5D78E'

  return (
    <span className={className}>
      <span className="whitespace-nowrap">
        현재까지 총{' '}
        <CountUp
          key={total}
          end={total}
          startFrom={baseline}
          className={isGlow ? 'call-banner-number font-black text-[17px] align-middle' : 'font-extrabold'}
          style={isGlow ? undefined : { color: numColor }}
        />
        명
      </span>{' '}
      <span aria-hidden>✨</span>{' '}
      <span className="whitespace-nowrap">예약 신청 완료</span>
    </span>
  )
}

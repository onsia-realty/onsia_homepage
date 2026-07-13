'use client'

// 야목역 서희스타힐스 — 관심고객 등록 소셜프루프 카운터
// 표시값 = baseline(마케팅 수치) + 실제 DB 등록수. fetch 실패 시 baseline 폴백.
// "현재까지 총 N명 ✨ 예약신청 완료". (구 YamokReserveFab의 카운터를 재사용 컴포넌트로 분리)
import { useEffect, useState } from 'react'
import CountUp from './CountUp'

// 마케팅 baseline (표시값 = baseline + 실제 inquiries count). 수정은 여기 한 곳.
export const YAMOK_RESERVE_BASELINE = 387

interface Props {
  pageId: string
  baseline?: number
  /** 밝은 배경(흰 버튼)=light / 어두운 배경(네이비 폼)=dark / 반짝이는 골드 숫자=glow */
  variant?: 'light' | 'dark' | 'glow'
  className?: string
}

export default function YamokReserveCounter({
  pageId,
  baseline = YAMOK_RESERVE_BASELINE,
  variant = 'dark',
  className = '',
}: Props) {
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
  const numColor = variant === 'light' ? '#B45309' : '#F5D78E' // 흰 배경=앰버 / 어두운 배경=골드

  return (
    <span className={className}>
      현재까지 총{' '}
      <CountUp
        key={total}
        end={total}
        startFrom={baseline}
        // glow=반짝이는 골드 그라디언트 숫자(call-banner-number), 그 외=단색
        className={isGlow ? 'call-banner-number font-black text-[17px] align-middle' : 'font-extrabold'}
        style={isGlow ? undefined : { color: numColor }}
      />
      명 <span aria-hidden>✨</span> 예약신청 완료
    </span>
  )
}

'use client'

// 야목역 서희스타힐스 그랜드힐 — 플로팅 방문예약 버튼 + 라이브 카운터 (소셜프루프)
// 표시값 = baseline(마케팅 수치) + 실제 DB 등록수. fetch 실패 시 baseline 폴백.
// 클릭 → 폼 앵커 스크롤. FraudGate reportClick 연동(BottomBar 패턴).
import { useEffect, useState } from 'react'
import CountUp from './CountUp'
import { useFraudGate } from './FraudGateContext'

interface Props {
  pageId: string
  baseline: number
  /** 클릭 시 스크롤할 폼 앵커 id */
  targetId: string
  pc?: boolean
}

export default function YamokReserveFab({ pageId, baseline, targetId, pc }: Props) {
  const { reportClick, tier, enabled } = useFraudGate()
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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enabled && tier === 'block') {
      e.preventDefault()
      return
    }
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
    if (enabled) {
      reportClick('cta_click', { targetText: '방문예약', targetUrl: `#${targetId}` }).catch(() => {})
    }
  }

  const posClass = pc
    ? 'fixed left-6 bottom-8 z-40'
    : 'fixed bottom-[64px] left-1/2 -translate-x-1/2 z-40'

  return (
    <button
      onClick={handleClick}
      aria-label="방문 예약하기"
      className={`${posClass} fab-glow rounded-full overflow-hidden active:scale-95 transition-transform`}
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 55%, #4338CA 100%)', border: '1.5px solid #C9A96E' }}
    >
      <span className="relative flex items-center gap-2.5 pl-4 pr-5 py-2.5">
        {/* 발광 스파클 배경 */}
        <span aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
          <span
            className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-40"
            style={{ background: 'radial-gradient(circle, #C9A96E 0%, transparent 70%)' }}
          />
        </span>
        {/* 캘린더 아이콘 */}
        <span className="relative flex-shrink-0 w-9 h-9 rounded-full bg-white/10 ring-1 ring-white/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </span>
        <span className="relative text-left leading-tight">
          <span className="block text-white font-extrabold text-[15px]">방문예약</span>
          <span className="block text-[11px] text-white/80">
            현재까지 총{' '}
            <CountUp key={total} end={total} startFrom={baseline} className="font-extrabold" style={{ color: '#F5D78E' }} />
            명 <span aria-hidden>✨</span> 예약신청 완료
          </span>
        </span>
      </span>
    </button>
  )
}

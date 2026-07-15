'use client'

// 야목역 서희스타힐스 그랜드힐 — 진입 임팩트 "팝업존" (에페트 방식)
// 전체화면 모달이 아니라, 페이지 최상단에 고정되는 가로 카드 띠.
// <a href="#"> 손잡이 탭을 누르면 띠 전체가 위로 접혔다(0fr) 펴진다(1fr).
// PC=완성 카드 5장 한 줄 중앙 정렬 / 모바일=좌우 스와이프(scroll-snap). 자동 슬라이드 없음.
// 카드는 CTA까지 포함된 완성 그래픽이라 카드 전체가 링크. "오늘 하루 안보기"=localStorage(날짜).
import { useCallback, useEffect, useState } from 'react'
import { YAMOK_POPUP_SLIDES, type YamokSlide } from './yamok-popup-slides'

const GOLD = '#C9A96E'

function todayKey() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

interface Props {
  storageKey: string
}

export default function YamokPopupCarousel({ storageKey }: Props) {
  const [mounted, setMounted] = useState(false)
  const [folded, setFolded] = useState(false)
  const slides = YAMOK_POPUP_SLIDES

  // 마운트 시 노출 판단: "오늘 하루 안보기" 유효하면 접힌 상태로 시작
  useEffect(() => {
    setMounted(true)
    try {
      if (localStorage.getItem(`${storageKey}-hide`) === todayKey()) {
        setFolded(true)
      }
    } catch {
      // storage 접근 불가 시 펼친 상태 유지
    }
  }, [storageKey])

  // ESC = 접기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFolded(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggle = useCallback(() => setFolded((f) => !f), [])

  const hideToday = useCallback(() => {
    setFolded(true)
    try {
      localStorage.setItem(`${storageKey}-hide`, todayKey())
    } catch {}
  }, [storageKey])

  return (
    <div className="fixed top-0 inset-x-0 z-[60] flex flex-col items-center pointer-events-none">
      {/* 접이식 래퍼 (grid-rows 0fr↔1fr 로 부드럽게 접힘) */}
      <div
        className="w-full pointer-events-auto grid"
        style={{
          gridTemplateRows: folded ? '0fr' : '1fr',
          transition: mounted ? 'grid-template-rows 0.42s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
        }}
      >
        <div className="overflow-hidden">
          <div
            className="w-full shadow-2xl"
            style={{
              background: 'rgba(9, 12, 24, 0.96)',
              backdropFilter: 'blur(6px)',
              borderBottom: `1.5px solid ${GOLD}`,
            }}
          >
            <div className="mx-auto flex gap-2 lg:gap-3 px-2 lg:px-4 py-3.5 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:justify-center lg:overflow-visible">
              {slides.map((s) => (
                <ZoneCard key={s.key} s={s} onCta={() => setFolded(true)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 손잡이 탭 (항상 노출, <a href="#"> 로 접기/펴기) */}
      <div className="pointer-events-auto flex items-stretch text-[12px] font-bold rounded-b-xl overflow-hidden shadow-lg">
        <button
          onClick={hideToday}
          className="px-3 py-1.5 text-white/65 hover:text-white transition-colors"
          style={{ background: 'rgba(9, 12, 24, 0.96)' }}
        >
          오늘 하루 안보기
        </button>
        <span className="w-px bg-white/15" />
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            toggle()
          }}
          aria-label={folded ? '팝업존 펼치기' : '팝업존 접기'}
          className="flex items-center gap-1.5 px-4 py-1.5 tracking-[0.14em] transition-colors"
          style={{ background: GOLD, color: '#0F172A' }}
        >
          POPUP ZONE
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform duration-300"
            style={{ transform: folded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path d="M18 15l-6-6-6 6" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  )
}

function ZoneCard({ s, onCta }: { s: YamokSlide; onCta: () => void }) {
  const isInternal = s.href.startsWith('/')

  return (
    <a
      href={s.href}
      {...(isInternal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      onClick={onCta}
      aria-label={s.alt}
      className="relative shrink-0 lg:shrink snap-center w-[68vw] max-w-[280px] lg:w-auto lg:max-w-[340px] lg:flex-1 rounded-2xl overflow-hidden shadow-lg active:scale-[0.98] transition-transform"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s.image} alt={s.alt} draggable={false} className="w-full h-auto block select-none" />
    </a>
  )
}

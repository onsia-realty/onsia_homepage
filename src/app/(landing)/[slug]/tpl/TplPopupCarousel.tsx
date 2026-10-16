'use client'

// YamokPopupCarousel 복제 — 진입 임팩트 "팝업존". 페이지 최상단 고정 가로 카드 띠(접이식).
// PC=카드 한 줄 중앙 정렬 / 모바일=좌우 스와이프. 카드는 config.popupSlides. "오늘 하루 안보기"=localStorage(날짜).
// href '#inquiry' 는 뷰포트에 맞는 관심고객 폼(pc-inquiry / inquiry-top)으로 스크롤.
import { useCallback, useEffect, useState } from 'react'
import type { TplSiteConfig } from '@/landing-sites/types'

type Slide = TplSiteConfig['popupSlides'][number]
const GOLD = '#C9A96E'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function scrollToInquiry() {
  const id = window.matchMedia('(min-width: 1024px)').matches ? 'pc-inquiry' : 'inquiry-top'
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

interface Props {
  storageKey: string
  slides: Slide[]
}

export default function TplPopupCarousel({ storageKey, slides }: Props) {
  const [mounted, setMounted] = useState(false)
  const [folded, setFolded] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      if (localStorage.getItem(`${storageKey}-hide`) === todayKey()) setFolded(true)
    } catch {}
  }, [storageKey])

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

  if (!slides.length) return null

  return (
    <div className="fixed top-0 inset-x-0 z-[60] flex flex-col items-center pointer-events-none">
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
            style={{ background: 'rgba(9, 12, 24, 0.96)', backdropFilter: 'blur(6px)', borderBottom: `1.5px solid ${GOLD}` }}
          >
            <div className="mx-auto flex gap-2 lg:gap-3 px-2 lg:px-4 py-3.5 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:justify-center lg:overflow-visible">
              {slides.map((s) => (
                <ZoneCard key={s.key} s={s} onCta={() => setFolded(true)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-auto flex items-stretch text-[12px] font-bold rounded-b-xl overflow-hidden shadow-lg">
        <button onClick={hideToday} className="px-3 py-1.5 text-white/65 hover:text-white transition-colors" style={{ background: 'rgba(9, 12, 24, 0.96)' }}>
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300" style={{ transform: folded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <path d="M18 15l-6-6-6 6" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  )
}

function ZoneCard({ s, onCta }: { s: Slide; onCta: () => void }) {
  const isAnchor = s.href.startsWith('#')
  const isInternal = s.href.startsWith('/')

  return (
    <a
      href={s.href}
      {...(isInternal || isAnchor ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      onClick={(e) => {
        onCta()
        if (isAnchor) {
          e.preventDefault()
          scrollToInquiry()
        }
      }}
      aria-label={s.alt}
      className="relative shrink-0 lg:shrink snap-center w-[68vw] max-w-[280px] lg:w-auto lg:max-w-[260px] lg:flex-1 rounded-2xl overflow-hidden shadow-lg active:scale-[0.98] transition-transform"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s.image} alt={s.alt} draggable={false} className="w-full h-auto block select-none" />
    </a>
  )
}

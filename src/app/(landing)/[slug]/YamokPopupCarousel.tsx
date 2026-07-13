'use client'

// 야목역 서희스타힐스 그랜드힐 — 진입 임팩트 팝업 캐러셀 (CSS 직접 디자인)
// scroll-snap 트랙 + 자동재생 4s(터치 시 일시정지, 루프) + 도트 인디케이터.
// 닫기=sessionStorage / 오늘 하루 안보기=localStorage(날짜). ESC · 백드롭 닫기.
import { useCallback, useEffect, useRef, useState } from 'react'
import { YAMOK_POPUP_SLIDES, type YamokSlide } from './yamok-popup-slides'

const THEME_BG: Record<YamokSlide['theme'], string> = {
  navy: 'linear-gradient(150deg, #0F172A 0%, #1E1B4B 55%, #4338CA 100%)',
  brown: 'linear-gradient(150deg, #2A1E14 0%, #4A3520 100%)',
  gold: 'linear-gradient(150deg, #12100A 0%, #2E2410 60%, #4A3B14 100%)',
}

const GOLD = '#C9A96E'
const GOLD_LIGHT = '#F5D78E'
const INQUIRY = '/yamok-grandhill/inquiry'

function todayKey() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

interface Props {
  storageKey: string
}

export default function YamokPopupCarousel({ storageKey }: Props) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const slides = YAMOK_POPUP_SLIDES

  // 노출 판단
  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey)) return
      if (localStorage.getItem(`${storageKey}-hide`) === todayKey()) return
    } catch {
      // storage 접근 불가 시 그냥 노출
    }
    setOpen(true)
  }, [storageKey])

  // body 스크롤 잠금 + ESC
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // 자동재생
  useEffect(() => {
    if (!open || slides.length <= 1) return
    const timer = setInterval(() => {
      if (pausedRef.current) return
      const el = trackRef.current
      if (!el) return
      const w = el.clientWidth
      const next = (Math.round(el.scrollLeft / w) + 1) % slides.length
      el.scrollTo({ left: next * w, behavior: 'smooth' })
    }, 4000)
    return () => clearInterval(timer)
  }, [open, slides.length])

  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    if (i !== idx) setIdx(i)
  }

  const goTo = (i: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  const close = useCallback(() => {
    setOpen(false)
    try {
      sessionStorage.setItem(storageKey, '1')
    } catch {}
  }, [storageKey])

  const hideToday = () => {
    setOpen(false)
    try {
      localStorage.setItem(`${storageKey}-hide`, todayKey())
      sessionStorage.setItem(storageKey, '1')
    } catch {}
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="야목역 서희스타힐스 그랜드힐 이벤트 안내"
      onClick={close}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ border: `1.5px solid ${GOLD}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={close}
          aria-label="닫기"
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white/90 flex items-center justify-center text-xl leading-none hover:bg-black/60 transition-colors"
        >
          &times;
        </button>

        {/* 슬라이드 트랙 */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          onTouchStart={() => (pausedRef.current = true)}
          onTouchEnd={() => (pausedRef.current = false)}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-contain"
        >
          {slides.map((s) => (
            <Slide key={s.key} s={s} onCta={close} />
          ))}
        </div>

        {/* 도트 인디케이터 */}
        <div className="absolute bottom-[52px] left-0 right-0 z-20 flex items-center justify-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.key}
              aria-label={`${i + 1}번째 슬라이드`}
              onClick={() => goTo(i)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === idx ? 18 : 6,
                background: i === idx ? GOLD_LIGHT : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>

        {/* 하단 컨트롤 */}
        <div className="flex items-stretch bg-black/85 text-[13px]">
          <button
            onClick={hideToday}
            className="flex-1 py-3 text-white/70 hover:text-white transition-colors"
          >
            오늘 하루 안보기
          </button>
          <span className="w-px bg-white/15" />
          <button
            onClick={close}
            className="flex-1 py-3 text-white/70 hover:text-white transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

function Slide({ s, onCta }: { s: YamokSlide; onCta: () => void }) {
  const href = s.href || INQUIRY
  const isInternal = href.startsWith('/')

  return (
    <div
      className="min-w-full snap-center flex flex-col"
      style={{ background: THEME_BG[s.theme] }}
    >
      <div className="relative flex-1 px-7 pt-11 pb-20 flex flex-col items-center justify-center text-center">
        {/* 우상단 발광 */}
        <span
          aria-hidden
          className="absolute top-0 right-0 w-44 h-44 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }}
        />

        {/* 스탬프 배지 */}
        {s.stamp && (
          <span
            className="inline-block -rotate-3 rounded-full px-3 py-0.5 text-[11px] font-extrabold tracking-wide mb-4"
            style={{ border: `1.5px solid ${GOLD}`, color: GOLD_LIGHT }}
          >
            {s.stamp}
          </span>
        )}

        {/* kicker */}
        <p className="text-[11px] font-bold tracking-[0.28em] mb-3" style={{ color: GOLD }}>
          {s.kicker}
        </p>

        {s.image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.image}
              alt={s.title}
              className="w-auto max-w-[240px] max-h-[300px] object-contain rounded-xl shadow-lg mb-4"
            />
            <p className="text-white font-extrabold text-[19px] leading-tight">{s.title}</p>
          </>
        ) : (
          <>
            {/* 초대형 임팩트 타이포 */}
            <p
              className="font-black leading-[0.95] tracking-tight"
              style={{ color: GOLD_LIGHT, fontSize: 52 }}
            >
              {s.impact}
            </p>
            {s.impactSub && (
              <p
                className="font-black leading-none tracking-tight mt-0.5"
                style={{ color: GOLD_LIGHT, fontSize: 40 }}
              >
                {s.impactSub}
              </p>
            )}
            <p className="text-white font-extrabold text-[20px] leading-tight mt-4">{s.title}</p>
          </>
        )}

        {/* 본문 라인 */}
        <div className="mt-3 space-y-0.5">
          {s.lines.map((l, i) => (
            <p key={i} className="text-white/80 text-[14px] leading-relaxed">
              {l}
            </p>
          ))}
        </div>

        {/* CTA */}
        <a
          href={href}
          {...(isInternal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
          onClick={onCta}
          className="mt-6 inline-flex items-center justify-center gap-1.5 px-8 py-3 rounded-full font-extrabold text-[15px] shadow-lg active:scale-95 transition-transform"
          style={{ background: GOLD, color: '#0F172A' }}
        >
          {s.cta} ▸
        </a>
      </div>
    </div>
  )
}

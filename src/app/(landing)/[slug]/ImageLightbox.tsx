'use client'

// 갤러리 라이트박스 (yamok-grandhill 전용, next/dynamic lazy import → 첫 탭 전 번들 0)
// 가로 scroll-snap 스와이프 + 탭 줌 토글 + "{n}/{total}" + ESC/백드롭 닫기 + body 스크롤 잠금.
import { useEffect, useRef, useState } from 'react'

interface Props {
  images: string[]
  startIndex: number
  alt?: (img: string, i: number) => string
  onClose: () => void
}

export default function ImageLightbox({ images, startIndex, alt, onClose }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(startIndex)
  const [zoom, setZoom] = useState(false)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const el = trackRef.current
    if (el) el.scrollLeft = startIndex * el.clientWidth
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [startIndex, onClose])

  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    if (i !== idx) {
      setIdx(i)
      setZoom(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9998] bg-black/95" role="dialog" aria-modal="true" aria-label="이미지 크게 보기">
      {/* 닫기 */}
      <button
        onClick={onClose}
        aria-label="닫기"
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl leading-none hover:bg-white/20 transition-colors"
      >
        &times;
      </button>

      {/* 카운터 */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 text-white/90 text-sm font-semibold tracking-wide">
        {idx + 1} / {images.length}
      </div>

      {/* 스와이프 트랙 */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-contain"
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="min-w-full h-full snap-center flex items-center justify-center px-2"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose()
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={alt ? alt(img, i) : `이미지 ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation()
                setZoom((z) => !z)
              }}
              className="max-w-full max-h-full object-contain transition-transform duration-300"
              style={{
                transform: zoom && i === idx ? 'scale(2)' : 'scale(1)',
                cursor: zoom ? 'zoom-out' : 'zoom-in',
              }}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

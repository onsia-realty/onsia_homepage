'use client'

// YamokMobileGallery 복제 — 모바일 갤러리(섹션화)
// config.gallery 섹션마다 컬러 헤더(스탬프+후킹) → 이미지 세로 스택(좌우 번갈아 리빌) → 첫 섹션 뒤 중간 CTA 1개.
// 이미지 탭 → 전체 라이트박스(가로 스와이프). alt는 config에서 명시(SEO).
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Reveal from '../Reveal'
import type { TplGallerySection } from '@/landing-sites/types'

const ImageLightbox = dynamic(() => import('../ImageLightbox'), { ssr: false })

interface Props {
  sections: TplGallerySection[]
  mode: 'main' | 'agent'
  phone?: string
}

export function SectionTitle({ title, highlight }: { title: string; highlight?: string }) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>
  const [a, b] = title.split(highlight)
  return (
    <>
      {a}
      <b className="text-amber-300">{highlight}</b>
      {b}
    </>
  )
}

function SectionHeader({ s }: { s: TplGallerySection }) {
  return (
    <Reveal enabled>
      <div className="px-5 py-5 sm:py-6 text-center text-white" style={{ background: s.grad }}>
        <span className="inline-block -rotate-3 border-[1.5px] border-white/80 rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-extrabold tracking-wide mb-2">
          {s.stamp}
        </span>
        <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-white/70">{s.kicker}</p>
        <h2 className="mt-1 text-[21px] sm:text-[25px] font-black leading-tight">
          <SectionTitle title={s.title} highlight={s.highlight} />
        </h2>
        <p className="mt-1.5 text-[12px] sm:text-[13px] text-white/80">{s.sub}</p>
      </div>
    </Reveal>
  )
}

function MidCta({ mode, phone }: { mode: 'main' | 'agent'; phone?: string }) {
  const isAgent = mode === 'agent'
  const href = isAgent ? (phone ? `tel:${phone}` : '#') : '#inquiry-top'
  return (
    <div className="px-4 py-6 text-center" style={{ background: 'linear-gradient(180deg,#fff8e1,#fdecb0)', borderTop: '2px solid #e0a800', borderBottom: '2px solid #e0a800' }}>
      <p className="text-[15px] sm:text-[17px] font-extrabold text-[#7a3d00] leading-snug">
        {isAgent ? '지금 바로 전화로 상담받으세요' : (
          <>
            관심고객 등록하면 <span className="text-[#b91c1c]">분양가·잔여 동호</span> 우선 안내
          </>
        )}
      </p>
      <a
        href={href}
        className="fab-glow mt-3 inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-extrabold text-[14px] sm:text-[15px] shadow-lg active:scale-95 transition-transform"
        style={{ background: 'linear-gradient(135deg,#0F172A,#4338CA)', color: '#F5D78E' }}
      >
        {isAgent ? '📞 전화상담' : '관심고객 등록하기 ▸'}
      </a>
    </div>
  )
}

export default function TplMobileGallery({ sections, mode, phone }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  if (!sections.length) return null

  const all = sections.flatMap((s) => s.images)
  let offset = 0

  return (
    <section id="section-gallery" className="bg-white">
      {sections.map((s, si) => {
        const base = offset
        offset += s.images.length
        return (
          <div key={s.id} id={`section-${s.id}`}>
            <SectionHeader s={s} />
            <div className="overflow-hidden" style={{ fontSize: 0, lineHeight: 0 }}>
              {s.images.map((img, i) => (
                <Reveal key={img.src} enabled variant={(base + i) % 2 === 0 ? 'left' : 'right'}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full block cursor-zoom-in"
                    loading="lazy"
                    decoding="async"
                    onClick={() => setLightboxIdx(base + i)}
                  />
                </Reveal>
              ))}
            </div>
            {si === 0 && <MidCta mode={mode} phone={phone} />}
          </div>
        )
      })}

      {lightboxIdx !== null && (
        <ImageLightbox
          images={all.map((i) => i.src)}
          startIndex={lightboxIdx}
          alt={(_, i) => all[i].alt}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </section>
  )
}

'use client'

// 타입별 평면안내 (탭) — 야목 갤러리의 평면 이미지 나열을 공식 홈페이지처럼 탭으로. 네이비+골드 탭.
// SEO: 모든 평면 이미지를 DOM에 렌더(비활성 탭은 hidden)하여 alt 노출 유지.
import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { TplSiteConfig } from '@/landing-sites/types'

const ImageLightbox = dynamic(() => import('../ImageLightbox'), { ssr: false })
const GOLD = '#C9A96E'

interface Props {
  plans: TplSiteConfig['unitPlans']
  pc?: boolean
  id?: string
}

export default function TplUnitPlans({ plans, pc = false, id }: Props) {
  const [cur, setCur] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  if (!plans.length) return null
  const images = plans.flatMap((p) => [p.src, ...(p.interior ? [p.interior] : [])])
  const alts = plans.flatMap((p) => [p.alt, ...(p.interior ? [`${p.alt} 실내 인테리어`] : [])])
  const idxOf = (pi: number, interior: boolean) => plans.slice(0, pi).reduce((n, p) => n + (p.interior ? 2 : 1), 0) + (interior ? 1 : 0)

  return (
    <section id={id} className={pc ? 'py-16 px-8 bg-gray-50' : 'py-8 sm:py-10 px-3 sm:px-4 bg-gray-50'}>
      <div className={pc ? 'max-w-[1100px] mx-auto' : ''}>
        <h2 className="text-center text-[12px] sm:text-[13px] font-bold tracking-[0.25em] mb-1.5" style={{ color: GOLD }}>
          UNIT PLAN
        </h2>
        <p className={`text-center font-extrabold text-gray-900 ${pc ? 'text-3xl mb-8' : 'text-xl sm:text-2xl mb-5'}`}>타입별 평면안내</p>

        <div className={`flex flex-wrap justify-center ${pc ? 'gap-2.5 mb-8' : 'gap-1.5 mb-4'}`} role="tablist">
          {plans.map((p, i) => (
            <button
              key={p.type}
              role="tab"
              aria-selected={i === cur}
              onClick={() => setCur(i)}
              className={`${pc ? 'px-5 py-2.5 text-[15px]' : 'px-3.5 py-2 text-[13px]'} rounded-full font-extrabold transition-all border`}
              style={
                i === cur
                  ? { background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #4338CA 100%)', color: '#F5D78E', borderColor: GOLD }
                  : { background: '#fff', color: '#334155', borderColor: '#e2e8f0' }
              }
            >
              {p.type}
              <span className={`ml-1.5 font-semibold ${i === cur ? 'text-white/70' : 'text-gray-400'} ${pc ? 'text-[12px]' : 'text-[11px]'}`}>{p.units}세대</span>
            </button>
          ))}
        </div>

        {plans.map((p, i) => (
          <div key={p.type} hidden={i !== cur} className={`rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white ${pc ? 'grid grid-cols-2 gap-0' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" className="w-full block cursor-zoom-in" onClick={() => setLightbox(idxOf(i, false))} />
            {p.interior && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.interior} alt={`${p.alt} 실내 인테리어`} loading="lazy" decoding="async" className={`w-full block cursor-zoom-in ${pc ? 'self-center' : 'border-t border-gray-100'}`} onClick={() => setLightbox(idxOf(i, true))} />
            )}
          </div>
        ))}
        <p className="mt-3 text-center text-[11px] sm:text-[12px] text-gray-400">※ 전용면적 {plans[cur].area} · {plans[cur].units}세대 · 이미지를 누르면 크게 볼 수 있습니다</p>
      </div>

      {lightbox !== null && (
        <ImageLightbox images={images} startIndex={lightbox} alt={(_, i) => alts[i]} onClose={() => setLightbox(null)} />
      )}
    </section>
  )
}

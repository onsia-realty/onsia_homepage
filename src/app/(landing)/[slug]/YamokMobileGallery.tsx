'use client'

// 야목역 서희스타힐스 그랜드힐 — 모바일 갤러리(섹션화)
// 기존: 공식 이미지 17장을 간격 0으로 세로 덤프 → "문서"처럼 밋밋
// 변경: 파일명 키워드로 6개 테마 섹션으로 묶고, 각 앞에 컬러 헤더(스탬프+후킹) 삽입
//       이미지/alt 전부 보존(SEO 무손실). 입지 섹션 뒤 중간 CTA 1개.
// 메인/직원 공통. mode로 CTA만 분기(main=관심고객 폼 스크롤 / agent=본인 전화).
// 이미지 탭 → 전체 17장 라이트박스(가로 스와이프). SectionHeader는 스크롤 리빌.
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Reveal from './Reveal'

// 라이트박스는 첫 탭 전까지 번들 미로드 (dynamic + ssr:false)
const ImageLightbox = dynamic(() => import('./ImageLightbox'), { ssr: false })

interface Props {
  gallery: string[]
  mode: 'main' | 'agent'
  phone?: string
}

// 기존 page.tsx getGalleryAlt의 야목 매핑을 그대로 보존 (네이버 이미지검색 SEO)
function yamokAlt(imgUrl: string, idx: number): string {
  const file = imgUrl.split('/').pop()?.toLowerCase() || ''
  if (file.includes('business')) return '야목역 서희스타힐스 그랜드힐 사업개요 — 비봉 신축 아파트'
  if (file.includes('premium')) return '야목역서희 입지 프리미엄 — 야목역세권 GTX-F(예정) 더블역세권'
  if (file.includes('brand')) return '서희스타힐스 브랜드 — 야목역 서희스타힐스 그랜드힐'
  if (file.includes('location')) return '야목역서희스타힐스 위치 — 경기도 화성시 비봉면 구포리'
  if (file.includes('schedule')) return '야목역서희 일반분양 분양일정 안내'
  if (file.includes('info')) return '야목역서희 분양가 공급안내 — 야목역 서희스타힐스 그랜드힐'
  if (file.includes('apply')) return '야목역서희 일반분양 모집공고'
  if (file.includes('ssp_guide')) return '야목역서희 청약안내 — 일반분양 자격 안내'
  if (file.includes('cpx_layout')) return '야목역 서희스타힐스 그랜드힐 단지배치도'
  if (file.includes('no_layout')) return '야목역 서희스타힐스 그랜드힐 동호수배치도'
  if (file.includes('unitplan_59a')) return '야목역서희 59㎡A 평면 — 비봉아파트 신축 분양'
  if (file.includes('unitplan_59b')) return '야목역서희 59㎡B 평면 — 비봉아파트 신축 분양'
  if (file.includes('unitplan_59c')) return '야목역서희 59㎡C 평면 — 비봉아파트 신축 분양'
  if (file.includes('unitplan_84a')) return '야목역서희 84㎡A 평면 — 비봉서희스타힐스'
  if (file.includes('unitplan_84b')) return '야목역서희 84㎡B 평면 — 비봉서희스타힐스'
  if (file.includes('interior')) return '야목역 서희스타힐스 그랜드힐 마감재 리스트'
  if (file.includes('option')) return '야목역 서희스타힐스 그랜드힐 추가선택품목'
  return `야목역 서희스타힐스 그랜드힐 ${idx + 1} — 야목역서희 일반분양`
}

type GroupKey = 'PROJECT' | 'LOCATION' | 'GUIDE' | 'SITEPLAN' | 'UNITPLAN' | 'INTERIOR'

interface GroupMeta {
  key: GroupKey
  grad: string // 헤더 배경 그라디언트
  stamp: string
  kicker: string
  title: React.ReactNode
  sub: string
}

const META: Record<GroupKey, GroupMeta> = {
  PROJECT: {
    key: 'PROJECT',
    grad: 'linear-gradient(135deg, #0c2a5e 0%, #1d4ed8 100%)',
    stamp: '분양중',
    kicker: 'PROJECT',
    title: (
      <>
        비봉지구 <b className="text-amber-300">998세대</b> 신축
      </>
    ),
    sub: '야목역 서희스타힐스 그랜드힐 사업개요',
  },
  LOCATION: {
    key: 'LOCATION',
    grad: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)',
    stamp: '더블역세권',
    kicker: 'LOCATION',
    title: (
      <>
        야목역 <b className="text-amber-300">더블역세권</b> 입지
      </>
    ),
    sub: '수인분당선 + GTX-F(예정)',
  },
  GUIDE: {
    key: 'GUIDE',
    grad: 'linear-gradient(135deg, #b91c1c 0%, #f97316 100%)',
    stamp: '분양·청약',
    kicker: 'GUIDE',
    title: (
      <>
        분양 · <b className="text-amber-200">청약</b> 안내
      </>
    ),
    sub: '공급일정 · 분양가 · 모집공고',
  },
  SITEPLAN: {
    key: 'SITEPLAN',
    grad: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)',
    stamp: '998세대 대단지',
    kicker: 'SITE PLAN',
    title: (
      <>
        <b className="text-amber-200">단지 배치</b> 안내
      </>
    ),
    sub: '단지배치도 · 동호수배치도',
  },
  UNITPLAN: {
    key: 'UNITPLAN',
    grad: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
    stamp: '실수요 추천',
    kicker: 'UNIT PLAN',
    title: (
      <>
        <b className="text-amber-300">59㎡ · 84㎡</b> 평면
      </>
    ),
    sub: '실수요 맞춤 평면 구성',
  },
  INTERIOR: {
    key: 'INTERIOR',
    grad: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)',
    stamp: '마감 사양',
    kicker: 'INTERIOR',
    title: (
      <>
        <b className="text-amber-100">마감재</b> · 선택품목
      </>
    ),
    sub: '고급 마감 사양 안내',
  },
}

function groupOf(imgUrl: string): GroupKey {
  const f = imgUrl.split('/').pop()?.toLowerCase() || ''
  if (f.includes('location')) return 'LOCATION'
  if (f.includes('schedule') || f.includes('info') || f.includes('apply') || f.includes('ssp_guide')) return 'GUIDE'
  if (f.includes('cpx_layout') || f.includes('no_layout')) return 'SITEPLAN'
  if (f.includes('unitplan')) return 'UNITPLAN'
  if (f.includes('interior') || f.includes('option')) return 'INTERIOR'
  return 'PROJECT' // business / premium / brand / 기타
}

function SectionHeader({ m }: { m: GroupMeta }) {
  return (
    <Reveal enabled>
      <div className="px-5 py-5 sm:py-6 text-center text-white" style={{ background: m.grad }}>
        <span className="inline-block -rotate-3 border-[1.5px] border-white/80 rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-extrabold tracking-wide mb-2">
          {m.stamp}
        </span>
        <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-white/70">{m.kicker}</p>
        <h2 className="mt-1 text-[21px] sm:text-[25px] font-black leading-tight">{m.title}</h2>
        <p className="mt-1.5 text-[12px] sm:text-[13px] text-white/80">{m.sub}</p>
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
            관심고객 등록하면 <span className="text-[#b91c1c]">분양가·공급조건</span> 우선 안내
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

export default function YamokMobileGallery({ gallery, mode, phone }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  if (!gallery || gallery.length === 0) return null

  // 연속 그룹으로 블록화 (갤러리 순서가 이미 카테고리별 정렬되어 있음)
  const blocks: { key: GroupKey; items: { url: string; idx: number }[] }[] = []
  gallery.forEach((url, idx) => {
    const key = groupOf(url)
    const last = blocks[blocks.length - 1]
    if (last && last.key === key) last.items.push({ url, idx })
    else blocks.push({ key, items: [{ url, idx }] })
  })

  // 중간 CTA 위치: 존재하는 블록 기준으로 안전하게 1회 (입지 → 분양안내 → 사업개요 우선순위)
  const ctaAfter = (() => {
    for (const k of ['LOCATION', 'GUIDE', 'PROJECT'] as GroupKey[]) {
      const i = blocks.findIndex((b) => b.key === k)
      if (i >= 0) return i
    }
    return 0
  })()

  return (
    <section id="section-gallery" className="bg-white">
      {blocks.map((b, bi) => (
        <div key={`${b.key}-${bi}`}>
          <SectionHeader m={META[b.key]} />
          <div className="overflow-hidden" style={{ fontSize: 0, lineHeight: 0 }}>
            {b.items.map(({ url, idx }) => (
              // 이미지별 스크롤 리빌: 좌우 번갈아 슬라이드 (overflow-hidden으로 가로 스크롤 방지)
              <Reveal key={idx} enabled variant={idx % 2 === 0 ? 'left' : 'right'}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={yamokAlt(url, idx)}
                  className="w-full block cursor-zoom-in"
                  loading="lazy"
                  decoding="async"
                  onClick={() => setLightboxIdx(idx)}
                />
              </Reveal>
            ))}
          </div>
          {bi === ctaAfter && <MidCta mode={mode} phone={phone} />}
        </div>
      ))}

      {lightboxIdx !== null && (
        <ImageLightbox
          images={gallery}
          startIndex={lightboxIdx}
          alt={yamokAlt}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </section>
  )
}

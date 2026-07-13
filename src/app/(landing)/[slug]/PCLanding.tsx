'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import InquiryForm from './InquiryForm'
import LocationSection from './LocationSection'
import YamokAgentVrCta from './YamokAgentVrCta'
import UrbanhomesKeyVisual from './UrbanhomesKeyVisual'
import YamokReserveCounter from './YamokReserveCounter'
import YamokStatsBand from './YamokStatsBand'
import YamokInquiryGift from './YamokInquiryGift'
import Reveal from './Reveal'
import type { BusinessInfo as FullBusinessInfo } from '@/lib/supabase-landing'

// 라이트박스는 첫 탭 전까지 번들 미로드 (yamok-grandhill 전용)
const ImageLightbox = dynamic(() => import('./ImageLightbox'), { ssr: false })

// 야목역 갤러리 alt 키워드 매핑 (네이버 이미지 검색용)
function getGalleryAlt(slug: string, projectName: string, imgUrl: string, idx: number): string {
  if (slug !== 'yamok-grandhill') return `${projectName} ${idx + 1}`
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

interface Agent {
  name: string
  phone?: string
  kakao_url?: string | null
}

interface Section {
  id?: string
  title?: string
  content?: string
  images?: string[]
}

interface BusinessInfo {
  company_name?: string
  disclaimer?: string
  location_image?: string
  modelhouse_address?: string
  modelhouse_naver_url?: string
  modelhouse_kakao_url?: string
  site_address?: string
  site_naver_url?: string
  site_kakao_url?: string
}

interface NavSubLink {
  label: string
  href?: string
  id?: string
}

interface NavLink {
  label: string
  href?: string   // external URL
  id?: string     // internal scroll target
  children?: NavSubLink[]
}

interface VRLink {
  label: string
  href: string
}

interface Props {
  page: {
    id: string
    project_name: string
    subtitle?: string | null
    hero_image?: string | null
    logo_image?: string | null
    youtube_id?: string | null
    phone_number?: string | null
    sections?: Section[]
    gallery?: string[]
    business_info?: BusinessInfo | null
  }
  agent: Agent | null
  effectivePhone?: string
  effectiveKakao?: string
  primaryColor: string
  accentColor: string
  slug: string
  agentCode?: string
  navLinks?: NavLink[]
  vrLinks?: VRLink[]
}

// agent 페이지 영상 토글 (어반홈스 등 슬러그 — page.tsx와 동일 플래그)
const SHOW_AGENT_VIDEOS = true

const DEFAULT_NAV_ITEMS: NavLink[] = [
  { label: '사업안내', id: 'pc-section-info' },
  { label: '프리미엄', id: 'pc-section-premium' },
  { label: '갤러리', id: 'pc-gallery' },
  { label: '관심고객 등록', id: 'pc-inquiry' },
]

export default function PCLanding({
  page, agent, effectivePhone, effectiveKakao,
  primaryColor, accentColor, slug, agentCode,
  navLinks, vrLinks,
}: Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const isAgent = !!agent
  const navItems = navLinks && navLinks.length > 0 ? navLinks : DEFAULT_NAV_ITEMS
  const isYamok = slug === 'yamok-grandhill'
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white">
      {/* ===== FIXED HEADER ===== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm border-b border-gray-200/60`}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between gap-4 h-[90px]">
          {/* Left: Logo */}
          <div className="flex items-center gap-3 cursor-pointer flex-shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {page.logo_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={page.logo_image}
                alt={page.project_name}
                className="h-14"
              />
            ) : (
              <span className="text-2xl xl:text-3xl font-bold tracking-tight whitespace-nowrap" style={{ color: primaryColor }}>
                {page.project_name}
              </span>
            )}
          </div>

          {/* Center: Navigation */}
          <nav className="flex items-center gap-0 flex-shrink-0">
            {navItems.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* 1차 메뉴 */}
                {item.href ? (
                  <a
                    href={item.href}
                    className="block px-5 py-3 text-[18px] xl:text-[20px] font-semibold text-gray-800 hover:text-black transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    onClick={() => item.id && scrollTo(item.id)}
                    className="block px-5 py-3 text-[18px] xl:text-[20px] font-semibold text-gray-800 hover:text-black transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </button>
                )}

                {/* 2차 드롭다운 */}
                {item.children && item.children.length > 0 && (
                  <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <ul className="bg-white rounded-md shadow-xl border border-gray-100 py-2 min-w-[180px]">
                      {item.children.map((sub, si) => (
                        <li key={si}>
                          <a
                            href={sub.href}
                            className="block px-6 py-3 text-[16px] text-gray-600 hover:text-black hover:bg-gray-50 transition-colors whitespace-nowrap"
                          >
                            {sub.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right: Phone */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {effectivePhone && (
              <a
                href={`tel:${effectivePhone}`}
                className="flex items-center gap-2 text-[22px] xl:text-[24px] font-extrabold tracking-tight text-gray-900 whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                {effectivePhone}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ===== HERO (Full Viewport) ===== */}
      <section className="relative overflow-hidden" style={{ height: '100vh' }}>
        {page.hero_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={page.hero_image}
            alt={page.project_name}
            className={`absolute inset-0 w-full h-full object-cover ${isYamok ? 'yamok-kenburns' : ''}`}
          />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }} />
        )}
        {/* No text overlay - the hero image contains its own marketing text */}
      </section>

      {/* ===== CALL BANNER ===== */}
      {effectivePhone && (
        <a href={`tel:${effectivePhone}`} className="call-banner block w-full">
          <div className="py-8 text-center">
            {isAgent ? (
              <>
                <span className="call-banner-number font-black text-8xl leading-none tracking-tight block">
                  {effectivePhone}
                </span>
              </>
            ) : (
              <>
                <span className="text-white font-extrabold text-4xl tracking-wide block mb-2">
                  대표번호
                </span>
                <span className="call-banner-number font-black text-8xl leading-none tracking-tight block">
                  {effectivePhone}
                </span>
              </>
            )}
          </div>
          <div className="call-sparkles" aria-hidden="true">
            <span className="sparkle sparkle-1" />
            <span className="sparkle sparkle-2" />
            <span className="sparkle sparkle-3" />
            <span className="sparkle sparkle-4" />
            <span className="sparkle sparkle-5" />
          </div>
        </a>
      )}

      {/* 야목 핵심 스탯 밴드 (PC 메인 임팩트) */}
      {isYamok && !isAgent && (
        <Reveal enabled variant="up">
          <YamokStatsBand />
        </Reveal>
      )}

      {/* ===== 어반홈스 키비주 밴드 (실입주금 6천만원대 / 월세보다 저렴하게 내집마련) ===== */}
      {slug === 'urbanhomes' && <UrbanhomesKeyVisual />}

      {/* ===== E-모델하우스 VR CTA (yamok-grandhill 한정 — PC 본문 노출) — agent에서는 YamokAgentVrCta가 따로 노출되므로 메인 한정 ===== */}
      {slug === 'yamok-grandhill' && !isAgent && (
        <Reveal enabled>
        <section className="py-10 px-8 bg-white">
          <div className="max-w-[1100px] mx-auto">
            <a
              href="/yamok-grandhill/vr"
              className="block rounded-3xl overflow-hidden shadow-2xl active:opacity-95 hover:shadow-[0_25px_60px_rgba(67,56,202,0.35)] transition-all duration-300 relative group"
              style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #4338CA 100%)',
              }}
            >
              {/* 우상단 발광 효과 */}
              <span
                aria-hidden
                className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #C9A96E 0%, transparent 70%)' }}
              />
              <div className="relative px-12 py-10 flex items-center gap-10">
                {/* 좌측: 큰 360° 아이콘 */}
                <div className="flex-shrink-0 w-28 h-28 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
                    <ellipse cx="12" cy="12" rx="9" ry="3" />
                    <path d="M3 12v5c0 1.66 4.03 3 9 3s9-1.34 9-3v-5" />
                  </svg>
                </div>
                {/* 가운데: 텍스트 */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold tracking-[0.28em] mb-2" style={{ color: '#C9A96E' }}>
                    360° E-MODEL HOUSE
                  </p>
                  <p className="text-white font-extrabold text-4xl leading-tight mb-2">
                    E-모델하우스 보러가기
                  </p>
                  <p className="text-white/75 text-lg">
                    59㎡A · 84㎡B 두 가지 타입을 360° VR로 미리 체험해보세요
                  </p>
                </div>
                {/* 우측: 입장 버튼 + 화살표 */}
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-[16px] transition-all group-hover:translate-x-1"
                    style={{ backgroundColor: '#C9A96E', color: '#0F172A' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    VR 입장하기
                  </span>
                  <span className="text-white/50 text-[12px] tracking-wide">VIEW NOW</span>
                </div>
              </div>
            </a>
          </div>
        </section>
        </Reveal>
      )}

      {/* ===== YOUTUBE ===== */}
      {page.youtube_id && (
        <section className="bg-black py-12">
          <div className="max-w-[1100px] mx-auto px-8">
            <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${page.youtube_id}?rel=0`}
                title="홍보 영상"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* ===== 직원 영상 (yamok-grandhill 메인 한정 — VR CTA 밑) ===== */}
      {slug === 'yamok-grandhill' && !isAgent && (
        <section className="bg-black">
          <div className="max-w-[1100px] mx-auto">
            <video
              src="https://uwddeseqwdsryvuoulsm.supabase.co/storage/v1/object/public/landing/videos/yamok-grandhill-staff.mp4#t=1"
              poster="https://uwddeseqwdsryvuoulsm.supabase.co/storage/v1/object/public/landing/videos/yamok-grandhill-staff-poster.jpg"
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full block min-h-[30vh] object-contain"
            />
          </div>
        </section>
      )}

      {/* ===== TOP: Inquiry Form (main) or Video (agent) — yamok=VR CTA + 영상, 그 외=영상만 ===== */}
      {isAgent ? (
        slug === 'yamok-grandhill' ? (
          <>
            <YamokAgentVrCta variant="hero" pc />
            {SHOW_AGENT_VIDEOS && (
              <section className="bg-black">
                <div className="max-w-[1100px] mx-auto">
                  <video
                    src="https://uwddeseqwdsryvuoulsm.supabase.co/storage/v1/object/public/landing/videos/yamok-grandhill-staff.mp4#t=1"
                    poster="https://uwddeseqwdsryvuoulsm.supabase.co/storage/v1/object/public/landing/videos/yamok-grandhill-staff-poster.jpg"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full block min-h-[30vh] object-contain"
                  />
                </div>
              </section>
            )}
          </>
        ) : SHOW_AGENT_VIDEOS ? (
          <section className="bg-black">
            <div className="max-w-[1100px] mx-auto">
              <video
                src="https://uwddeseqwdsryvuoulsm.supabase.co/storage/v1/object/public/landing/videos/wangsimni-jeongwono-seongdong.mp4"
                controls
                playsInline
                preload="metadata"
                className="w-full block min-h-[30vh] object-contain"
              />
            </div>
          </section>
        ) : null
      ) : (
        <section id="pc-inquiry" className="py-16 px-8" style={{ backgroundColor: primaryColor }}>
          <div className="max-w-[700px] mx-auto">
            {isYamok && <YamokInquiryGift />}
            <h2 className="text-3xl font-bold text-center text-white mb-8">관심고객 등록</h2>
            <InquiryForm pageId={page.id} slug={slug} accentColor={accentColor} agentCode={agentCode} agentName={agent?.name} />
          </div>
        </section>
      )}

      {/* ===== CUSTOM SECTIONS ===== */}
      {page.sections && page.sections.length > 0 && page.sections.map((section, i) => (
        <Reveal enabled={isYamok} key={section.id || i}>
        <section
          id={i === 0 ? 'pc-section-info' : i === 1 ? 'pc-section-premium' : undefined}
          className={`py-20 px-8 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className="max-w-[1200px] mx-auto">
            {section.title && (
              <h2 className="text-4xl font-bold text-center mb-10" style={{ color: primaryColor }}>
                {section.title}
              </h2>
            )}
            {section.content && (
              <div
                className="prose prose-lg max-w-none text-gray-700 text-center mb-8"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            )}
            {section.images && section.images.length > 0 && (
              <div className="space-y-6">
                {section.images.map((img, j) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={j}
                    src={img}
                    alt={`${section.title || page.project_name} ${j + 1}`}
                    className="w-full max-w-[1100px] mx-auto block rounded-lg"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        </Reveal>
      ))}

      {/* ===== GALLERY ===== */}
      {page.gallery && page.gallery.length > 0 && (() => {
        // 프리미엄 이미지 감지 (URL에 "프리미엄" 포함)
        const isPremiumImg = (url: string) => url.includes('%ED%94%84%EB%A6%AC%EB%AF%B8%EC%97%84') || url.includes('프리미엄')

        // 이미지를 그룹으로 분류: 연속된 프리미엄 이미지는 grid, 나머지는 full-width
        const groups: { type: 'full' | 'grid'; images: { src: string; idx: number }[] }[] = []
        page.gallery.forEach((img, i) => {
          const premium = isPremiumImg(img)
          const last = groups[groups.length - 1]
          if (premium) {
            if (last?.type === 'grid') {
              last.images.push({ src: img, idx: i })
            } else {
              groups.push({ type: 'grid', images: [{ src: img, idx: i }] })
            }
          } else {
            groups.push({ type: 'full', images: [{ src: img, idx: i }] })
          }
        })

        return (
          <section id="pc-gallery" className="py-16 px-8 bg-gray-100">
            <div className="max-w-[1200px] mx-auto space-y-5">
              {groups.map((group, gi) =>
                group.type === 'grid' ? (
                  <div key={gi} className={`grid gap-4 ${group.images.length === 4 ? 'grid-cols-4' : group.images.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {group.images.map(({ src, idx }, ci) => (
                      <Reveal key={idx} enabled={isYamok} variant="zoom" delay={ci * 90}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={getGalleryAlt(slug, page.project_name, src, idx)}
                          className={`w-full block rounded-lg shadow-sm ${isYamok ? 'cursor-zoom-in' : ''}`}
                          loading="lazy"
                          onClick={isYamok ? () => setLightboxIdx(idx) : undefined}
                        />
                      </Reveal>
                    ))}
                  </div>
                ) : (
                  group.images.map(({ src, idx }) => (
                    <Reveal key={idx} enabled={isYamok} variant={idx % 2 === 0 ? 'left' : 'right'}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`${page.project_name} ${idx + 1}`}
                        className={`w-full block rounded-lg shadow-sm ${isYamok ? 'cursor-zoom-in' : ''}`}
                        loading="lazy"
                        onClick={isYamok ? () => setLightboxIdx(idx) : undefined}
                      />
                    </Reveal>
                  ))
                )
              )}
            </div>
          </section>
        )
      })()}

      {/* ===== 갤러리 라이트박스 (yamok-grandhill 전용) ===== */}
      {isYamok && lightboxIdx !== null && page.gallery && (
        <ImageLightbox
          images={page.gallery}
          startIndex={lightboxIdx}
          alt={(img, i) => getGalleryAlt(slug, page.project_name, img, i)}
          onClose={() => setLightboxIdx(null)}
        />
      )}

      {/* ===== LOCATION (오시는길 - business_info에 location 데이터 있을 때) ===== */}
      <Reveal enabled={isYamok}>
        <LocationSection
          businessInfo={page.business_info as FullBusinessInfo | null}
          primaryColor={primaryColor}
          accentColor={accentColor}
          id="pc-location"
        />
      </Reveal>

      {/* ===== BOTTOM: Inquiry Form (main) or Video 2 (agent) — yamok agent는 상단 hero CTA만, 하단 중복 제거 ===== */}
      {isAgent ? (
        slug === 'yamok-grandhill' ? null
        : SHOW_AGENT_VIDEOS ? (
        <section className="bg-black">
          <div className="max-w-[1100px] mx-auto">
            <video
              src="https://uwddeseqwdsryvuoulsm.supabase.co/storage/v1/object/public/landing/videos/jeongwono-seoul.mp4"
              controls
              playsInline
              preload="metadata"
              className="w-full block min-h-[30vh] object-contain"
            />
          </div>
        </section>
        ) : null
      ) : (
        <section className="py-16 px-8" style={{ backgroundColor: primaryColor }}>
          <div className="max-w-[700px] mx-auto">
            {isYamok && <YamokInquiryGift />}
            <h2 className="text-3xl font-bold text-center text-white mb-8">관심고객 등록</h2>
            <InquiryForm pageId={page.id} slug={slug} accentColor={accentColor} agentCode={agentCode} agentName={agent?.name} />
          </div>
        </section>
      )}

      {/* ===== FOOTER (urbanhomes style) ===== */}
      <footer className="bg-[#f5f5f5] py-14 px-8">
        <div className="max-w-[1000px] mx-auto text-center">
          {/* Logo */}
          {page.logo_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={page.logo_image} alt={page.project_name} className="h-10 mx-auto mb-6" />
          ) : (
            <p className="text-xl font-bold mb-6" style={{ color: primaryColor }}>{page.project_name}</p>
          )}

          {/* Disclaimer - agent 페이지는 통째 숨김 (직원 명함 OG 깔끔) */}
          {!isAgent && (
            <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
              {page.business_info?.disclaimer ||
                '※ 본 사이트의 이미지는 소비자의 이해를 돕기 위해 제작된 것으로 실제 시공 시 다를 수 있습니다.'}
            </p>
          )}

          {/* Company Info - agent는 숨김 */}
          {!isAgent && page.business_info?.company_name && (
            <p className="text-[13px] text-gray-400 leading-loose">
              {page.business_info.company_name}
            </p>
          )}

          {/* Links */}
          <div className="mt-6 flex items-center justify-center gap-6 text-[12px] text-gray-400">
            <a
              href="https://www.applyhome.co.kr/ai/aia/selectOtherLttotPblancListView.do"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              청약홈 바로가기
            </a>
          </div>

          {/* Copyright */}
          <p className="mt-6 text-[12px] text-gray-400">
            Copyright &copy; {new Date().getFullYear()} {page.project_name}. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* ===== FLOATING SIDEBAR (urbanhomes style - always visible) ===== */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-4">
        {/* 관심고객 등록 - 메인만 */}
        {!isAgent && (isYamok ? (
          /* 야목: 네이비+골드 프리미엄 CTA (반짝이 입자 + 골드 글로우 + 반짝이는 카운터) */
          <button
            onClick={() => scrollTo('pc-inquiry')}
            aria-label="관심고객 등록하기"
            className="fab-glow relative w-[176px] py-5 px-3 rounded-2xl shadow-xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 55%, #4338CA 100%)', border: '1.5px solid #C9A96E' }}
          >
            {/* 반짝이 입자 */}
            <span aria-hidden className="call-sparkles">
              <span className="sparkle sparkle-1" />
              <span className="sparkle sparkle-2" />
              <span className="sparkle sparkle-3" />
              <span className="sparkle sparkle-4" />
              <span className="sparkle sparkle-5" />
            </span>
            {/* 우상단 골드 발광 */}
            <span
              aria-hidden
              className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-40 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #C9A96E 0%, transparent 70%)' }}
            />
            <span className="relative flex flex-col items-center">
              <span className="w-12 h-12 rounded-full bg-white/10 ring-1 ring-white/25 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#F5D78E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </span>
              <span className="text-white font-extrabold text-[17px] leading-tight text-center tracking-tight">
                관심고객<br />등록하기
              </span>
              <span className="mt-2.5 pt-2.5 border-t border-white/20 w-full text-center text-[11.5px] leading-snug text-white/85">
                <YamokReserveCounter pageId={page.id} variant="glow" />
              </span>
            </span>
          </button>
        ) : (
          <button
            onClick={() => scrollTo('pc-inquiry')}
            className="flex flex-col items-center justify-center w-[130px] py-6 bg-white/90 backdrop-blur-sm text-gray-800 rounded-xl shadow-lg border border-gray-200 transition-all hover:bg-white hover:shadow-xl cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-2 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            <span className="text-[15px] font-bold leading-tight text-center">관심고객<br />등록하기</span>
          </button>
        ))}

        {/* VR Links - 메인 + agent 모두 */}
        {vrLinks && vrLinks.map((vr, idx) => (
          <a
            key={idx}
            href={vr.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-[130px] py-5 bg-[#2c3e50] text-white text-[17px] font-bold rounded-xl shadow-lg border border-[#2c3e50] transition-all hover:bg-[#34495e] hover:shadow-xl"
          >
            {vr.label}
          </a>
        ))}

        {/* 분양문의 - 메인 + agent 모두 */}
        {effectivePhone && (
          <a
            href={`tel:${effectivePhone}`}
            className="flex flex-col items-center justify-center w-[130px] py-5 bg-[#2c3e50] text-white rounded-xl shadow-lg border border-[#2c3e50] transition-all hover:bg-[#34495e] hover:shadow-xl"
          >
            <span className="text-[13px] font-medium mb-0.5">분양문의</span>
            <span className="text-[17px] font-extrabold tracking-tight text-center">{effectivePhone}</span>
          </a>
        )}
      </div>

      {/* ===== SCROLL TO TOP ===== */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed right-5 bottom-8 z-40 w-12 h-12 rounded-full bg-[#333] text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-[#555] ${
          scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  )
}

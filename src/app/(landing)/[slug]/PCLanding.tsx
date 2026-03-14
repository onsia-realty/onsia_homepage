'use client'

import { useState, useEffect } from 'react'
import InquiryForm from './InquiryForm'

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
}

interface NavSubLink {
  label: string
  href: string
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

  return (
    <div className="min-h-screen bg-white">
      {/* ===== FIXED HEADER ===== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm border-b border-gray-200/60`}
      >
        <div className="max-w-[1400px] mx-auto px-10 flex items-center justify-between h-[90px]">
          {/* Left: Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {page.logo_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={page.logo_image}
                alt={page.project_name}
                className="h-14"
              />
            ) : (
              <span className="text-3xl font-bold tracking-tight" style={{ color: primaryColor }}>
                {page.project_name}
              </span>
            )}
          </div>

          {/* Center: Navigation */}
          <nav className="flex items-center gap-0">
            {navItems.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* 1차 메뉴 */}
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-8 py-3 text-[20px] font-semibold text-gray-800 hover:text-black transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    onClick={() => item.id && scrollTo(item.id)}
                    className="block px-8 py-3 text-[20px] font-semibold text-gray-800 hover:text-black transition-colors"
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
                            target="_blank"
                            rel="noopener noreferrer"
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
          <div className="flex items-center gap-4">
            {effectivePhone && (
              <a
                href={`tel:${effectivePhone}`}
                className="flex items-center gap-2 text-[24px] font-extrabold tracking-tight text-gray-900"
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
            className="absolute inset-0 w-full h-full object-cover"
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

      {/* ===== TOP: Inquiry Form (main) or Video (agent) ===== */}
      {isAgent ? (
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
      ) : (
        <section id="pc-inquiry" className="py-16 px-8" style={{ backgroundColor: primaryColor }}>
          <div className="max-w-[700px] mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-8">관심고객 등록</h2>
            <InquiryForm pageId={page.id} slug={slug} accentColor={accentColor} agentCode={agentCode} agentName={agent?.name} />
          </div>
        </section>
      )}

      {/* ===== CUSTOM SECTIONS ===== */}
      {page.sections && page.sections.length > 0 && page.sections.map((section, i) => (
        <section
          key={section.id || i}
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
                    {group.images.map(({ src, idx }) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={idx}
                        src={src}
                        alt={`${page.project_name} ${idx + 1}`}
                        className="w-full block rounded-lg shadow-sm"
                        loading="lazy"
                      />
                    ))}
                  </div>
                ) : (
                  group.images.map(({ src, idx }) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={idx}
                      src={src}
                      alt={`${page.project_name} ${idx + 1}`}
                      className="w-full block rounded-lg shadow-sm"
                      loading="lazy"
                    />
                  ))
                )
              )}
            </div>
          </section>
        )
      })()}

      {/* ===== BOTTOM: Inquiry Form (main) or Video 2 (agent) ===== */}
      {isAgent ? (
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
      ) : (
        <section className="py-16 px-8" style={{ backgroundColor: primaryColor }}>
          <div className="max-w-[700px] mx-auto">
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

          {/* Disclaimer - agent는 분양대행사 정보 숨김 */}
          <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
            {isAgent
              ? (page.business_info?.disclaimer || '※ 본 사이트의 이미지는 소비자의 이해를 돕기 위해 제작된 것으로 실제 시공 시 다를 수 있습니다.')
                .replace(/분양대행사\s*[:：].*?((?=시행)|$)/gs, '')
                .trim()
              : (page.business_info?.disclaimer ||
                '※ 본 사이트의 이미지는 소비자의 이해를 돕기 위해 제작된 것으로 실제 시공 시 다를 수 있습니다.')}
          </p>

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
        {!isAgent && (
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
        )}

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

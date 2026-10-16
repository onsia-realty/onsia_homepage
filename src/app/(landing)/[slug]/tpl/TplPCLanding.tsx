'use client'

// PCLanding의 yamok 분기(isYamok && !isAgent 등)를 그대로 옮긴 PC 레이아웃. 모든 야목 고정값은 config로 치환.
// 구성: 고정 헤더 → 풀뷰포트 히어로(켄번즈+카피) → 콜배너 → 스탯밴드 → 상담+실시간접수 → 혜택/프리미엄 →
//       관심고객(상단) → 섹션 갤러리(리빌+라이트박스) → 평면 탭 → FAQ → 오시는길 → 관심고객(하단) → 푸터 → 플로팅 사이드바
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import InquiryForm from '../InquiryForm'
import Reveal from '../Reveal'
import TplStatsBand from './TplStatsBand'
import TplConsultSection from './TplConsultSection'
import TplBenefits from './TplBenefits'
import TplUnitPlans from './TplUnitPlans'
import TplFaq from './TplFaq'
import TplLocation from './TplLocation'
import TplInquiryGift from './TplInquiryGift'
import TplReserveCounter from './TplReserveCounter'
import { SectionTitle } from './TplMobileGallery'
import type { TplSiteConfig } from '@/landing-sites/types'
import type { AgentFooterInfo } from '../agent-footer'

const ImageLightbox = dynamic(() => import('../ImageLightbox'), { ssr: false })
const GOLD = '#C9A96E'

interface Props {
  config: TplSiteConfig
  pageId: string
  agent: { name: string } | null
  agentCode?: string
  agentFooter?: AgentFooterInfo
  effectivePhone?: string
}

export default function TplPCLanding({ config: c, pageId, agent, agentCode, agentFooter, effectivePhone }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const isAgent = !!agent
  const { primary: primaryColor, accent: accentColor } = c.colors

  const navItems = [
    ...c.gallery.map((s) => ({ label: s.navLabel, id: `pc-${s.id}` })),
    { label: '세대안내', id: 'pc-unitplan' },
    { label: '관심고객 등록', id: 'pc-inquiry' },
  ]
  const allImages = c.gallery.flatMap((s) => s.images)

  return (
    <div className="min-h-screen bg-white">
      {/* ===== FIXED HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm border-b border-gray-200/60">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between gap-4 h-[90px]">
          <div className="flex items-center gap-3 cursor-pointer flex-shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-2xl xl:text-3xl font-bold tracking-tight whitespace-nowrap" style={{ color: primaryColor }}>
              {c.name}
            </span>
          </div>
          <nav className="flex items-center gap-0 flex-shrink-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="block px-5 py-3 text-[18px] xl:text-[20px] font-semibold text-gray-800 hover:text-black transition-colors whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-4 flex-shrink-0">
            {effectivePhone && (
              <a href={`tel:${effectivePhone}`} className="flex items-center gap-2 text-[22px] xl:text-[24px] font-extrabold tracking-tight text-gray-900 whitespace-nowrap">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                {effectivePhone}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ===== HERO (Full Viewport, 켄번즈 + 카피 오버레이) ===== */}
      <section className="relative overflow-hidden" style={{ height: '100vh' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.hero.image} alt={c.hero.alt} className="absolute inset-0 w-full h-full object-cover yamok-kenburns" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 pb-20 px-8">
          <div className="max-w-[1200px] mx-auto text-white yamok-hero-seq">
            <p className="text-[14px] font-bold tracking-[0.32em] mb-4" style={{ color: GOLD }}>{c.hero.kicker}</p>
            <h1 className="text-6xl xl:text-7xl font-black leading-tight drop-shadow-lg mb-4">{c.hero.title}</h1>
            <p className="text-2xl xl:text-3xl font-semibold drop-shadow-md text-white/95 mb-6">{c.hero.subtitle}</p>
            <div className="flex flex-wrap gap-2.5">
              {c.hero.chips.map((chip) => (
                <span key={chip} className="px-4 py-1.5 rounded-full text-[15px] font-bold backdrop-blur-sm" style={{ background: 'rgba(15,23,42,0.6)', border: `1px solid ${GOLD}`, color: '#F5D78E' }}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CALL BANNER ===== */}
      {effectivePhone && (
        <a href={`tel:${effectivePhone}`} className="call-banner block w-full">
          <div className="py-8 text-center">
            {!isAgent && <span className="text-white font-extrabold text-4xl tracking-wide block mb-2">대표번호</span>}
            <span className="call-banner-number font-black text-8xl leading-none tracking-tight block">{effectivePhone}</span>
          </div>
          <div className="call-sparkles" aria-hidden="true">
            <span className="sparkle sparkle-1" /><span className="sparkle sparkle-2" /><span className="sparkle sparkle-3" /><span className="sparkle sparkle-4" /><span className="sparkle sparkle-5" />
          </div>
        </a>
      )}

      {/* 핵심 스탯 밴드 (메인) */}
      {!isAgent && (
        <Reveal enabled variant="up">
          <TplStatsBand kicker={c.nameEn} stats={c.stats} />
        </Reveal>
      )}

      {/* 상담 신청 + 실시간 접수 (메인) */}
      {!isAgent && (
        <Reveal enabled variant="up">
          <section className="py-12 px-8 bg-gray-50">
            <TplConsultSection pageId={pageId} slug={c.slug} agentCode={agentCode} liveRequests={c.flags.liveRequests} />
          </section>
        </Reveal>
      )}

      {/* 혜택 + 프리미엄 */}
      <TplBenefits benefits={c.benefits} premium={c.premium} pc id="pc-benefit" />

      {/* ===== TOP: Inquiry Form (메인만) ===== */}
      {!isAgent && (
        <section id="pc-inquiry" className="py-16 px-8" style={{ backgroundColor: primaryColor }}>
          <div className="max-w-[700px] mx-auto">
            {c.inquiryGift && <TplInquiryGift gift={c.inquiryGift} />}
            <h2 className="text-3xl font-bold text-center text-white mb-8">관심고객 등록</h2>
            <InquiryForm pageId={pageId} slug={c.slug} accentColor={accentColor} agentCode={agentCode} />
          </div>
        </section>
      )}

      {/* ===== GALLERY (섹션별 헤더 + 리빌 + 라이트박스) ===== */}
      <div id="pc-gallery" className="bg-gray-100">
        {c.gallery.map((s) => {
          const base = allImages.findIndex((i) => i === s.images[0])
          return (
            <section key={s.id} id={`pc-${s.id}`} className="pb-16">
              <Reveal enabled>
                <div className="px-8 py-10 text-center text-white" style={{ background: s.grad }}>
                  <span className="inline-block -rotate-3 border-[1.5px] border-white/80 rounded-full px-3 py-0.5 text-[12px] font-extrabold tracking-wide mb-3">{s.stamp}</span>
                  <p className="text-[12px] font-bold tracking-[0.3em] text-white/70">{s.kicker}</p>
                  <h2 className="mt-1.5 text-4xl font-black leading-tight">
                    <SectionTitle title={s.title} highlight={s.highlight} />
                  </h2>
                  <p className="mt-2 text-[15px] text-white/80">{s.sub}</p>
                </div>
              </Reveal>
              <div className="max-w-[1200px] mx-auto px-8 pt-8 space-y-5">
                {s.images.map((img, i) => (
                  <Reveal key={img.src} enabled variant={(base + i) % 2 === 0 ? 'left' : 'right'}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={img.alt} className="w-full block rounded-lg shadow-sm cursor-zoom-in" loading="lazy" onClick={() => setLightboxIdx(base + i)} />
                  </Reveal>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {lightboxIdx !== null && (
        <ImageLightbox images={allImages.map((i) => i.src)} startIndex={lightboxIdx} alt={(_, i) => allImages[i].alt} onClose={() => setLightboxIdx(null)} />
      )}

      {/* ===== 평면 탭 / FAQ / 오시는길 ===== */}
      <TplUnitPlans plans={c.unitPlans} pc id="pc-unitplan" />
      <TplFaq faq={c.faq} pc id="pc-faq" />
      <TplLocation location={c.location} primaryColor={primaryColor} pc id="pc-location" />

      {/* ===== BOTTOM: Inquiry Form (메인만) ===== */}
      {!isAgent && (
        <section className="py-16 px-8" style={{ backgroundColor: primaryColor }}>
          <div className="max-w-[700px] mx-auto">
            {c.inquiryGift && <TplInquiryGift gift={c.inquiryGift} />}
            <h2 className="text-3xl font-bold text-center text-white mb-8">관심고객 등록</h2>
            <InquiryForm pageId={pageId} slug={c.slug} accentColor={accentColor} agentCode={agentCode} />
          </div>
        </section>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#f5f5f5] py-14 px-8">
        <div className="max-w-[1000px] mx-auto text-center">
          <p className="text-xl font-bold mb-6" style={{ color: primaryColor }}>{c.name}</p>
          <p className="text-[13px] text-gray-400 leading-loose">{c.footer.companyName}</p>
          {(agentFooter?.lines ?? c.footer.lines).map((line) => (
            <p key={line} className="text-[12px] text-gray-400 leading-loose">{line}</p>
          ))}
          <p className="mt-5 text-[13px] text-gray-500 leading-relaxed whitespace-pre-line">{agentFooter?.disclaimer || c.footer.disclaimer}</p>
          <div className="mt-6 flex items-center justify-center gap-6 text-[12px] text-gray-400">
            <a href="https://www.applyhome.co.kr/ai/aia/selectOtherLttotPblancListView.do" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
              청약홈 바로가기
            </a>
          </div>
          <p className="mt-6 text-[12px] text-gray-400">Copyright &copy; {new Date().getFullYear()} {c.name}. All Rights Reserved.</p>
        </div>
      </footer>

      {/* ===== FLOATING SIDEBAR (야목 네이비+골드 프리미엄 CTA) ===== */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-4">
        {!isAgent && (
          <button
            onClick={() => scrollTo('pc-inquiry')}
            aria-label="관심고객 등록하기"
            className="fab-glow relative w-[176px] py-5 px-3 rounded-2xl shadow-xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 55%, #4338CA 100%)', border: `1.5px solid ${GOLD}` }}
          >
            <span aria-hidden className="call-sparkles">
              <span className="sparkle sparkle-1" /><span className="sparkle sparkle-2" /><span className="sparkle sparkle-3" /><span className="sparkle sparkle-4" /><span className="sparkle sparkle-5" />
            </span>
            <span aria-hidden className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-40 pointer-events-none" style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }} />
            <span className="relative flex flex-col items-center">
              <span className="w-12 h-12 rounded-full bg-white/10 ring-1 ring-white/25 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#F5D78E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </span>
              <span className="text-white font-extrabold text-[17px] leading-tight text-center tracking-tight">관심고객<br />등록하기</span>
              {c.flags.reserveCounter && (
                <span className="mt-2.5 pt-2.5 border-t border-white/20 w-full text-center text-[11.5px] leading-snug text-white/85">
                  <TplReserveCounter pageId={pageId} baseline={c.reserveBaseline} variant="glow" />
                </span>
              )}
            </span>
          </button>
        )}
        {effectivePhone && (
          <a href={`tel:${effectivePhone}`} className="flex flex-col items-center justify-center w-[130px] py-5 bg-[#2c3e50] text-white rounded-xl shadow-lg border border-[#2c3e50] transition-all hover:bg-[#34495e] hover:shadow-xl">
            <span className="text-[13px] font-medium mb-0.5">분양문의</span>
            <span className="text-[17px] font-extrabold tracking-tight text-center">{effectivePhone}</span>
          </a>
        )}
      </div>

      {/* ===== SCROLL TO TOP ===== */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed right-5 bottom-8 z-40 w-12 h-12 rounded-full bg-[#333] text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-[#555] ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  )
}

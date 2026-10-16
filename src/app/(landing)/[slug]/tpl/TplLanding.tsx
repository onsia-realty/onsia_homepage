// 야목 기반 랜딩 템플릿 — page.tsx의 yamok-grandhill 모바일 분기 + PCLanding yamok 분기를 config 기반으로 재구성.
// page.tsx 에서 getTplConfig(slug) 가 있으면 이 컴포넌트로 조기 반환(기존 현장 코드 경로 불변).
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import InquiryForm from '../InquiryForm'
import BottomBar from '../BottomBar'
import CallBanner from '../CallBanner'
import Reveal from '../Reveal'
import { getAgentFooter } from '../agent-footer'
import TplPCLanding from './TplPCLanding'
import TplStructuredData from './TplStructuredData'
import TplFactStrip from './TplFactStrip'
import TplConsultSection from './TplConsultSection'
import TplBenefits from './TplBenefits'
import TplInquiryGift from './TplInquiryGift'
import TplReserveCounter from './TplReserveCounter'
import TplMobileGallery from './TplMobileGallery'
import TplUnitPlans from './TplUnitPlans'
import TplFaq from './TplFaq'
import TplLocation from './TplLocation'
import TplPopupCarousel from './TplPopupCarousel'
import TplEventPopup from './TplEventPopup'
import type { TplSiteConfig } from '@/landing-sites/types'

const FraudGate = dynamic(() => import('../FraudGate'))
const GOLD = '#C9A96E'

interface Agent {
  name: string
  phone?: string | null
  kakao_url?: string | null
}

interface Props {
  config: TplSiteConfig
  pageId: string
  agent: Agent | null
  agentCode?: string
  isPreview: boolean
  baseUrl: string
  effectivePhone?: string
  effectiveKakao?: string
}

/** generateMetadata 용 — tpl.seo 기반 (agent/preview 분기는 page.tsx 와 동일 규칙) */
export function buildTplMetadata(c: TplSiteConfig, opts: { agent: Agent | null; agentCode?: string; baseUrl: string }): Metadata {
  const { agent, agentCode, baseUrl } = opts
  const ogTitle = agent ? `${c.name} ${agent.name}` : c.seo.title
  const ogImage = c.seo.ogImage.startsWith('http') ? c.seo.ogImage : `https://www.onsia.co.kr${c.seo.ogImage}`
  const pageUrl = `${baseUrl}${agentCode ? `?a=${agentCode}` : ''}`
  return {
    title: agent ? `${c.name} - ${agent.name}` : c.seo.title,
    description: c.seo.description,
    keywords: c.seo.keywords.join(', '),
    robots: agentCode ? { index: false, follow: true } : { index: true, follow: true },
    alternates: { canonical: baseUrl },
    openGraph: {
      title: ogTitle,
      description: c.seo.description,
      url: pageUrl,
      siteName: '온시아(ONSIA)',
      type: 'website',
      locale: 'ko_KR',
      images: [{ url: ogImage, width: 1200, height: 630, alt: c.name }],
    },
    twitter: { card: 'summary_large_image', title: ogTitle, description: c.seo.description, images: [ogImage] },
  }
}

export default function TplLanding({ config: c, pageId, agent, agentCode, isPreview, baseUrl, effectivePhone, effectiveKakao }: Props) {
  const { primary: primaryColor, accent: accentColor } = c.colors
  const agentFooter = agent ? getAgentFooter(c.slug, agentCode) : undefined

  const inquirySection = (id: string, withCounter: boolean) => (
    <Reveal enabled>
      <section id={id} className="py-8 sm:py-10 px-4" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-lg mx-auto">
          {c.inquiryGift && <TplInquiryGift gift={c.inquiryGift} />}
          <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-4 sm:mb-6">관심고객 등록</h2>
          {withCounter && c.flags.reserveCounter && (
            <p className="text-center text-[13px] text-white/85 mb-4 -mt-1">
              <TplReserveCounter pageId={pageId} baseline={c.reserveBaseline} variant="dark" />
            </p>
          )}
          <InquiryForm pageId={pageId} slug={c.slug} accentColor={accentColor} agentCode={agentCode} agentName={agent?.name} />
        </div>
      </section>
    </Reveal>
  )

  const body = (
    <>
      {isPreview && (
        <div className="fixed top-2 left-2 z-[9999] px-2.5 py-1 rounded bg-red-600 text-white text-xs font-bold shadow pointer-events-none">
          미리보기 (비공개)
        </div>
      )}
      <TplStructuredData config={c} baseUrl={baseUrl} />

      {/* ===== PC 전용 (lg+) ===== */}
      <div className="hidden lg:block">
        <TplPCLanding config={c} pageId={pageId} agent={agent} agentCode={agentCode} agentFooter={agentFooter} effectivePhone={effectivePhone} />
        <TplPopupCarousel storageKey={`${c.slug}-popup-carousel`} slides={c.popupSlides} />
      </div>

      {/* ===== 모바일 전용 (<lg) ===== */}
      <div className="lg:hidden min-h-screen bg-white pb-14" style={{ '--primary': primaryColor, '--accent': accentColor } as React.CSSProperties}>
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.hero.image} alt={c.hero.alt} className="w-full block yamok-kenburns h-[115vw] max-h-[640px] object-cover object-center" fetchPriority="high" decoding="async" />
          <div className="absolute inset-0 flex items-end justify-center pb-6 sm:pb-8 md:pb-12 bg-gradient-to-t from-black/75 via-black/25 to-transparent">
            <div className="text-center text-white px-4 yamok-hero-seq">
              <p className="text-[10px] sm:text-[12px] font-bold tracking-[0.28em] mb-1.5" style={{ color: GOLD }}>{c.hero.kicker}</p>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black mb-1 md:mb-2 drop-shadow-lg">{c.hero.title}</h1>
              <p className="text-[13px] sm:text-lg md:text-2xl font-medium drop-shadow-md opacity-90">{c.hero.subtitle}</p>
            </div>
          </div>
        </section>

        {effectivePhone && <CallBanner phone={effectivePhone} agentName={agent?.name} />}

        <TplFactStrip name={c.name} facts={c.facts} />

        <Reveal enabled>
          <section className="py-8 px-4 bg-gray-50">
            <TplConsultSection pageId={pageId} slug={c.slug} agentCode={agentCode} agentName={agent?.name} liveRequests={c.flags.liveRequests} />
          </section>
        </Reveal>

        <TplBenefits benefits={c.benefits} premium={c.premium} id="section-benefit" />

        {!agent && inquirySection('inquiry-top', true)}

        <TplMobileGallery sections={c.gallery} mode={agent ? 'agent' : 'main'} phone={effectivePhone} />

        <TplUnitPlans plans={c.unitPlans} id="section-unitplan" />
        <TplFaq faq={c.faq} id="section-faq" />
        <TplLocation location={c.location} primaryColor={primaryColor} id="section-location" />

        {!agent && inquirySection('inquiry-bottom', false)}

        {/* Footer */}
        <footer className="py-6 sm:py-8 px-4 bg-gray-900 text-gray-400 text-center text-xs sm:text-sm leading-relaxed">
          <div className="mb-3 sm:mb-4">
            <p className="font-medium text-gray-300">{c.footer.companyName}</p>
            {(agentFooter?.lines ?? c.footer.lines).map((line) => (
              <p key={line} className="mt-1 text-gray-500 text-[11px] sm:text-xs">{line}</p>
            ))}
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto text-xs sm:text-sm whitespace-pre-line">{agentFooter?.disclaimer || c.footer.disclaimer}</p>
          <a href="https://www.applyhome.co.kr/ai/aia/selectOtherLttotPblancListView.do" target="_blank" rel="noopener noreferrer" className="mt-2 sm:mt-3 inline-block text-gray-500 hover:text-gray-300 underline text-xs sm:text-sm">
            청약홈 바로가기
          </a>
          <p className="mt-2 sm:mt-3 text-gray-600 text-xs">&copy; {new Date().getFullYear()} ONSIA. All rights reserved.</p>
        </footer>

        <BottomBar phoneNumber={effectivePhone || null} kakaoUrl={effectiveKakao || null} isAgent={!!agent} />
        <TplPopupCarousel storageKey={`${c.slug}-popup-carousel-m`} slides={c.popupSlides} />
      </div>

      {c.flags.eventPopup && c.eventPopup && !agent && (
        <TplEventPopup pageId={pageId} slug={c.slug} storageKey={`${c.slug}-event-popup`} name={c.name} event={c.eventPopup} />
      )}
    </>
  )

  if (c.flags.fraudGate) {
    return (
      <FraudGate siteId={c.slug} agentCode={agentCode}>
        {body}
      </FraudGate>
    )
  }
  return body
}

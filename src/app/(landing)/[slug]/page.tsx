import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLandingPageBySlug, getLandingPages, getAgentByCode, type LandingPage as LandingPageType } from '@/lib/supabase-landing'
import InquiryForm from './InquiryForm'
import BottomBar from './BottomBar'
import CallBanner from './CallBanner'
import PopupModal from './PopupModal'
import PCLanding from './PCLanding'
import LocationSection from './LocationSection'
import YamokStructuredData, { type YamokFaqItem } from './YamokStructuredData'
import YamokAgentVrCta from './YamokAgentVrCta'

const YAMOK_FAQ: YamokFaqItem[] = [
  {
    q: '야목역 서희스타힐스 그랜드힐 위치는 어디인가요?',
    a: '경기도 화성시 비봉면 구포리 614-18번지 일원에 위치합니다. 수인분당선 야목역과 도보권이며, GTX-F(예정) 더블역세권 단지입니다.',
  },
  {
    q: '견본주택은 어디에 있나요?',
    a: '경기도 안산시 단원구 광덕4로 178에 위치합니다. 자세한 방문 안내는 분양상담 1668-5257로 문의해 주세요.',
  },
  {
    q: '공급 평형(타입)은 어떻게 구성되나요?',
    a: '전용면적 59㎡A·B·C 타입과 84㎡A·B 타입 총 5개 타입으로 구성됩니다. 평면 상세는 평면안내 페이지에서 확인하실 수 있습니다.',
  },
  {
    q: '교통은 어떻게 되나요?',
    a: '수인분당선 야목역 도보권이며, GTX-F 노선이 예정되어 있어 더블역세권으로 미래 가치가 기대됩니다.',
  },
  {
    q: '분양일정과 분양가는 어떻게 확인하나요?',
    a: '분양일정·공급안내·모집공고는 본 홈페이지 분양안내에서 확인 가능하며, 정확한 분양가는 모집공고문을 기준으로 확정 안내됩니다. 관심고객 등록 시 분양일정을 우선 안내해 드립니다.',
  },
  {
    q: 'E-모델하우스(VR) 둘러보기가 가능한가요?',
    a: '네, 59㎡A 타입과 84㎡B 타입 두 가지를 360° VR로 체험하실 수 있습니다. E-모델하우스 메뉴 또는 메인 페이지의 VR 둘러보기 버튼을 클릭해 주세요.',
  },
  {
    q: '관심고객 등록은 어떻게 하나요?',
    a: '본 홈페이지 상단·하단의 관심고객 등록 폼에서 이름과 연락처를 남겨주시면, 분양일정·공급안내·모집공고 등 주요 일정을 우선 안내해 드립니다.',
  },
]

const YAMOK_INTRO = `야목역 서희스타힐스 그랜드힐은 경기도 화성시 비봉면 구포리 614-18번지 일원에 들어서는 서희스타힐스 브랜드 신축 분양 단지입니다. 수인분당선 야목역과 도보권이며, 향후 GTX-F(예정) 노선 호재가 기대되는 더블역세권 입지입니다. 야목역세권 브랜드타운의 첫자리로, 전용면적 59㎡A·B·C 타입과 84㎡A·B 타입 총 5개 타입으로 공급됩니다. 견본주택은 경기도 안산시 단원구 광덕4로 178에 위치하며, 분양상담은 1668-5257로 가능합니다.`

// agent 페이지 영상 토글 (어반홈스 등 슬러그 — 야목은 별도 VR CTA로 분기되어 영향 없음)
const SHOW_AGENT_VIDEOS = true

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  const { a: agentCode } = await searchParams
  const page = await getLandingPageBySlug(slug)

  if (!page) return { title: '페이지를 찾을 수 없습니다' }

  // Agent별 OG 타이틀: "{프로젝트명} {직원명}" — 모든 슬러그 동일 패턴
  const agentCodeStr = typeof agentCode === 'string' ? agentCode : undefined
  const agent = agentCodeStr ? await getAgentByCode(page.id, agentCodeStr) : null

  const baseOgTitle = page.seo_title || page.project_name
  const ogTitle = agent
    ? `${page.project_name} ${agent.name}`
    : baseOgTitle

  const ogImage = page.og_image || page.hero_image || undefined
  const pageUrl = `https://www.onsia.city/${slug}${agentCodeStr ? `?a=${agentCodeStr}` : ''}`
  const ogDescription = page.seo_description || `${page.project_name} 분양 안내`

  return {
    title: agent ? `${page.project_name} - ${agent.name}` : (page.seo_title || `${page.project_name} - 분양 안내`),
    description: page.seo_description || `${page.project_name} ${page.location || ''} 분양 정보`,
    keywords: page.seo_keywords || undefined,
    alternates: {
      canonical: `https://www.onsia.city/${slug}`,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: pageUrl,
      siteName: '온시아(ONSIA)',
      type: 'website',
      locale: 'ko_KR',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: page.project_name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export async function generateStaticParams() {
  const pages = await getLandingPages()
  return pages.map((page) => ({ slug: page.slug }))
}

export const revalidate = 3600

export default async function LandingPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { a: agentCode } = await searchParams
  const page = await getLandingPageBySlug(slug)

  if (!page) notFound()

  // Agent 조회 (URL ?a=xxx)
  const agentCodeStr = typeof agentCode === 'string' ? agentCode : undefined
  const agent = agentCodeStr ? await getAgentByCode(page.id, agentCodeStr) : null

  // 유효 전화번호/카톡 결정 (agent 우선, 없으면 대표)
  const effectivePhone = agent?.phone || page.phone_number
  const effectiveKakao = agent?.kakao_url || page.kakao_chat_url

  const primaryColor = page.primary_color || '#1E3A5F'
  const accentColor = page.accent_color || '#C9A96E'

  // 현장별 PC 네비게이션 & VR 링크
  // 세부 카테고리는 우리 사이트 내 서브페이지로 이동
  const siteConfig: Record<string, {
    navLinks?: { label: string; href?: string; id?: string; children?: { label: string; href: string }[] }[]
    vrLinks?: { label: string; href: string }[]
  }> = {
    urbanhomes: {
      navLinks: [
        {
          label: '사업안내',
          href: '/urbanhomes/business',
          children: [
            { label: '사업개요', href: '/urbanhomes/business' },
            { label: '오시는길', href: '/urbanhomes/location' },
          ],
        },
        {
          label: '단지안내',
          href: '/urbanhomes/community',
          children: [
            { label: '커뮤니티', href: '/urbanhomes/community' },
            { label: '동호수배치도', href: '/urbanhomes/layout' },
          ],
        },
        {
          label: '프리미엄',
          href: '/urbanhomes/premium',
          children: [
            { label: '프리미엄', href: '/urbanhomes/premium' },
            { label: '입지환경', href: '/urbanhomes/environment' },
            { label: '스마트싱스', href: '/urbanhomes/smart' },
          ],
        },
        {
          label: '세대안내',
          href: '/urbanhomes/unit',
          children: [
            { label: 'UNIT', href: '/urbanhomes/unit' },
          ],
        },
        {
          label: '홍보센터',
          href: '/urbanhomes/inquiry',
          children: [
            { label: '관심고객등록', href: '/urbanhomes/inquiry' },
          ],
        },
      ],
      vrLinks: [
        { label: 'SKY VR', href: 'https://urbanhomes.co.kr/vr3/index.html' },
        { label: 'UNIT VR', href: 'https://urbanhomes.co.kr/wangsimni_urban_homes/index.html' },
      ],
    },
    'yamok-grandhill': {
      navLinks: [
        {
          label: '사업안내',
          href: '/yamok-grandhill/business',
          children: [
            { label: '사업개요', href: '/yamok-grandhill/business' },
            { label: '입지프리미엄', href: '/yamok-grandhill/premium' },
            { label: '브랜드소개', href: '/yamok-grandhill/brand' },
            { label: '오시는길', href: '/yamok-grandhill/location' },
          ],
        },
        {
          label: '분양안내',
          href: '/yamok-grandhill/schedule',
          children: [
            { label: '분양일정', href: '/yamok-grandhill/schedule' },
            { label: '공급안내', href: '/yamok-grandhill/supply' },
            { label: '모집공고', href: '/yamok-grandhill/apply' },
          ],
        },
        {
          label: '청약안내',
          href: '/yamok-grandhill/subscription',
          children: [
            { label: '청약안내', href: '/yamok-grandhill/subscription' },
            { label: '특별공급', href: '/yamok-grandhill/subscription' },
            { label: '일반공급', href: '/yamok-grandhill/subscription' },
          ],
        },
        {
          label: '단지안내',
          href: '/yamok-grandhill/layout',
          children: [
            { label: '단지배치도', href: '/yamok-grandhill/layout' },
            { label: '동호수배치도', href: '/yamok-grandhill/units' },
          ],
        },
        {
          label: '세대안내',
          href: '/yamok-grandhill/floorplan',
          children: [
            { label: '평면안내', href: '/yamok-grandhill/floorplan' },
            { label: 'E-모델하우스', href: '/yamok-grandhill/vr' },
            { label: '마감재리스트', href: '/yamok-grandhill/interior' },
            { label: '추가선택품목', href: '/yamok-grandhill/option' },
          ],
        },
        {
          label: '고객센터',
          href: '/yamok-grandhill/inquiry',
          children: [
            { label: '관심고객등록', href: '/yamok-grandhill/inquiry' },
          ],
        },
      ],
      vrLinks: [
        { label: 'VR 59A', href: '/vr/yamok/S59A.html' },
        { label: 'VR 84B', href: '/vr/yamok/S84B.html' },
      ],
    },
  }
  const currentSiteConfig = siteConfig[slug]

  // SEO 섹션 (yamok 한정, PC와 모바일 양쪽 footer 위에 사용)
  const seoSection = slug === 'yamok-grandhill' ? (
    <section
      aria-label="야목역 서희스타힐스 그랜드힐 분양 안내"
      className="bg-white border-t border-gray-100"
    >
      <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
        <h2 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">
          야목역 서희스타힐스 그랜드힐 분양 안내
        </h2>
        <p className="text-[13px] lg:text-[14px] text-gray-600 leading-relaxed mb-6 lg:mb-8">
          {YAMOK_INTRO}
        </p>
        <h2 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">
          자주 묻는 질문 (FAQ)
        </h2>
        <ul className="space-y-3 lg:space-y-4">
          {YAMOK_FAQ.map((f, i) => (
            <li key={i} className="border-b border-gray-100 pb-3 lg:pb-4 last:border-0">
              <p className="text-[13px] lg:text-[14px] font-bold text-gray-900 mb-1">
                Q. {f.q}
              </p>
              <p className="text-[13px] lg:text-[14px] text-gray-600 leading-relaxed">
                A. {f.a}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  ) : null

  return (
    <>
      {/* ===== SEO 구조화 데이터 (JSON-LD, yamok-grandhill 한정, 메타데이터로만 사용) ===== */}
      {slug === 'yamok-grandhill' && (
        <YamokStructuredData faq={YAMOK_FAQ} ogImage={page.og_image || undefined} />
      )}

      {/* ===== PC 전용 (lg+) ===== */}
      <div className="hidden lg:block">
        <PCLanding
          page={page}
          agent={agent}
          effectivePhone={effectivePhone || undefined}
          effectiveKakao={effectiveKakao || undefined}
          primaryColor={primaryColor}
          accentColor={accentColor}
          slug={slug}
          agentCode={agentCodeStr}
          navLinks={currentSiteConfig?.navLinks}
          vrLinks={currentSiteConfig?.vrLinks}
          seoSection={seoSection}
        />
        {slug === 'urbanhomes' && (
          <PopupModal
            imageUrl="https://static.wixstatic.com/media/a5ff46_031e0795c8dc484ebfb8e3b4a1ee9541~mv2.jpg/v1/fill/w_460,h_624,al_c,lg_1,q_80,enc_avif,quality_auto/1_%ED%8C%9D%EC%97%85%EC%B0%BD.jpg"
            linkUrl="https://www.applyhome.co.kr/ai/aia/selectOtherLttotPblancListView.do"
            alt="청약홈 안내"
            storageKey="popup-dismissed-1"
          />
        )}
        {slug === 'yamok-grandhill' && (
          <PopupModal
            imageUrl="/uploads/landing/yamok/popup-grand-open.png"
            alt="GRAND OPEN"
            storageKey="yamok-popup-grandopen"
          />
        )}
      </div>

      {/* ===== 모바일 전용 (<lg) ===== */}
      <div
        className={`lg:hidden min-h-screen bg-white ${page.show_bottom_bar ? 'pb-14' : ''}`}
        style={{ '--primary': primaryColor, '--accent': accentColor } as React.CSSProperties}
      >
        {/* Hero Section */}
        {page.hero_image ? (
          <section className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.hero_image}
              alt={page.project_name}
              className="w-full block"
            />
            {page.subtitle && (
              <div className="absolute inset-0 flex items-end justify-center pb-6 sm:pb-8 md:pb-12 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="text-center text-white px-4">
                  <h1 className="text-xl sm:text-3xl md:text-5xl font-bold mb-1 md:mb-2 drop-shadow-lg">{page.project_name}</h1>
                  <p className="text-sm sm:text-lg md:text-2xl font-medium drop-shadow-md opacity-90">{page.subtitle}</p>
                </div>
              </div>
            )}
          </section>
        ) : (
          <section
            className="py-12 sm:py-16 md:py-20 px-4 text-center text-white"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}
          >
            {page.logo_image && (
              <div className="mb-4 md:mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={page.logo_image} alt="로고" className="mx-auto h-10 md:h-16" />
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 md:mb-3">{page.project_name}</h1>
            {page.subtitle && <p className="text-base sm:text-xl md:text-2xl opacity-90">{page.subtitle}</p>}
          </section>
        )}

        {/* Call Banner */}
        {effectivePhone && (
          <CallBanner
            phone={effectivePhone}
            agentName={agent?.name}
          />
        )}

        {/* E-모델하우스 VR CTA (yamok-grandhill 한정 — 최상단 노출, 풀 폭 다크 그라디언트) */}
        {slug === 'yamok-grandhill' && (
          <section className="py-5 sm:py-6 px-3 sm:px-4 bg-white">
            <a
              href="/yamok-grandhill/vr"
              className="block rounded-2xl overflow-hidden shadow-2xl active:opacity-95 transition-all relative"
              style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #4338CA 100%)',
              }}
            >
              {/* 장식 - 오른쪽 발광 효과 */}
              <span
                aria-hidden
                className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #C9A96E 0%, transparent 70%)' }}
              />
              <div className="relative px-5 sm:px-6 py-6 sm:py-7 flex items-center gap-4 sm:gap-5">
                <div className="flex-shrink-0 w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
                    <ellipse cx="12" cy="12" rx="9" ry="3" />
                    <path d="M3 12v5c0 1.66 4.03 3 9 3s9-1.34 9-3v-5" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] sm:text-[13px] font-bold tracking-[0.22em] mb-1.5" style={{ color: '#C9A96E' }}>
                    360° E-MODEL HOUSE
                  </p>
                  <p className="text-white font-extrabold text-2xl sm:text-[26px] leading-tight">
                    E-모델하우스 보러가기
                  </p>
                  <p className="text-white/75 text-[14px] sm:text-[15px] mt-1.5">
                    59㎡A · 84㎡B 두 타입 둘러보기
                  </p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </a>
          </section>
        )}

        {/* YouTube Video */}
        {page.youtube_id && (
          <section className="bg-black">
            <div className="max-w-4xl mx-auto">
              <div className="relative pb-[56.25%] h-0">
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

        {/* Top: Inquiry Form (main) or Video 1 (agent) — yamok agent는 VR CTA, 영상은 SHOW_AGENT_VIDEOS 토글 */}
        {agent ? (
          slug === 'yamok-grandhill' ? (
            <YamokAgentVrCta variant="hero" />
          ) : SHOW_AGENT_VIDEOS ? (
            <section className="bg-black">
              <video
                src="https://uwddeseqwdsryvuoulsm.supabase.co/storage/v1/object/public/landing/videos/wangsimni-jeongwono-seongdong.mp4"
                controls
                playsInline
                preload="metadata"
                className="w-full block min-h-[30vh] object-contain"
              />
            </section>
          ) : null
        ) : (
          <section id="inquiry-top" className="py-8 sm:py-10 px-4" style={{ backgroundColor: primaryColor }}>
            <div className="max-w-lg mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-4 sm:mb-6">관심고객 등록</h2>
              <InquiryForm pageId={page.id} slug={slug} accentColor={accentColor} agentCode={agentCodeStr} agentName={agent?.name} />
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {page.sections && page.sections.length > 0 && page.sections.map((section, i) => (
          <section
            key={section.id || i}
            id={i === 0 ? 'section-info' : i === 1 ? 'section-premium' : undefined}
            className={`py-8 sm:py-12 px-4 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="max-w-4xl mx-auto">
              {section.title && (
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6" style={{ color: primaryColor }}>
                  {section.title}
                </h2>
              )}
              {section.content && (
                <div
                  className="prose prose-sm sm:prose-lg max-w-none text-gray-700 text-center"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}
              {section.images && section.images.length > 0 && (
                <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                  {section.images.map((img, j) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={j}
                      src={img}
                      alt={`${section.title || page.project_name} ${j + 1}`}
                      className="w-full block rounded-lg"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}

        {/* Gallery (seamless vertical stack) */}
        {page.gallery && page.gallery.length > 0 && (
          <section id="section-gallery" style={{ backgroundColor: primaryColor, fontSize: 0, lineHeight: 0 }}>
            {page.gallery.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={img}
                alt={`${page.project_name} ${i + 1}`}
                className="w-full block"
                loading="lazy"
              />
            ))}
          </section>
        )}

        {/* 카테고리 바로가기 그리드 (yamok-grandhill 한정 — 풀 폭 다크 그라디언트, E-모델하우스 CTA와 통일) */}
        {slug === 'yamok-grandhill' && (
          <section className="py-8 sm:py-10 px-3 sm:px-4 bg-white">
            <h2 className="text-center text-[12px] sm:text-[13px] font-bold tracking-[0.25em] mb-1.5" style={{ color: '#C9A96E' }}>
              MORE INFO
            </h2>
            <p className="text-center text-xl sm:text-2xl font-extrabold mb-6 sm:mb-7 text-gray-900">
              상세 정보 더 보기
            </p>
            <div className="space-y-3 sm:space-y-3.5">
              {[
                { href: '/yamok-grandhill/business', label: '사업개요', sub: 'BUSINESS', desc: '사업 규모 · 단지 정보', d: 'M3 21h18M5 21V7l8-4 8 4v14M9 9h.01M9 13h.01M9 17h.01M14 9h.01M14 13h.01M14 17h.01' },
                { href: '/yamok-grandhill/premium', label: '입지 프리미엄', sub: 'PREMIUM', desc: '야목역 · GTX-F(예정)', d: 'M12 2l2.39 4.84L20 8l-4 3.9.94 5.5L12 14.77 7.06 17.4 8 11.9 4 8l5.61-1.16L12 2z' },
                { href: '/yamok-grandhill/layout', label: '단지배치도', sub: 'LAYOUT', desc: '동·세대 배치 한눈에', d: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
                { href: '/yamok-grandhill/floorplan', label: '평면안내', sub: 'UNIT PLAN', desc: '59㎡A·B·C / 84㎡A·B', d: 'M3 3h18v18H3zM3 12h18M12 3v18M3 7h6v5H3z' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl overflow-hidden shadow-xl active:opacity-95 transition-all relative"
                  style={{
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #4338CA 100%)',
                  }}
                >
                  <div className="relative px-5 sm:px-6 py-5 sm:py-6 flex items-center gap-4 sm:gap-5">
                    <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.d} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] sm:text-[12px] font-bold tracking-[0.22em] mb-1" style={{ color: '#C9A96E' }}>
                        {item.sub}
                      </p>
                      <p className="text-white font-extrabold text-xl sm:text-[22px] leading-tight">
                        {item.label}
                      </p>
                      <p className="text-white/70 text-[13px] sm:text-[14px] mt-1">
                        {item.desc}
                      </p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 오시는길 (business_info에 location 데이터 있을 때만 표시) */}
        <LocationSection
          businessInfo={page.business_info}
          primaryColor={primaryColor}
          accentColor={accentColor}
          id="section-location"
          compact
        />

        {/* Bottom: Inquiry Form (main) or Video 2 (agent) — yamok agent는 VR 카드, 영상은 SHOW_AGENT_VIDEOS 토글 */}
        {agent ? (
          slug === 'yamok-grandhill' ? (
            <YamokAgentVrCta variant="cards" />
          ) : SHOW_AGENT_VIDEOS ? (
            <section className="bg-black">
              <video
                src="https://uwddeseqwdsryvuoulsm.supabase.co/storage/v1/object/public/landing/videos/jeongwono-seoul.mp4"
                controls
                playsInline
                preload="metadata"
                className="w-full block min-h-[30vh] object-contain"
              />
            </section>
          ) : null
        ) : (
          <section id="inquiry-bottom" className="py-8 sm:py-10 px-4" style={{ backgroundColor: primaryColor }}>
            <div className="max-w-lg mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-4 sm:mb-6">관심고객 등록</h2>
              <InquiryForm pageId={page.id} slug={slug} accentColor={accentColor} agentCode={agentCodeStr} agentName={agent?.name} />
            </div>
          </section>
        )}

        {/* SEO 본문 (검색봇 readable, yamok 한정 — Footer 직전) */}
        {seoSection}

        {/* Footer */}
        <footer className="py-6 sm:py-8 px-4 bg-gray-900 text-gray-400 text-center text-xs sm:text-sm leading-relaxed">
          {!agent && page.business_info && (
            <div className="mb-3 sm:mb-4">
              {page.business_info.company_name && (
                <p className="font-medium text-gray-300">{page.business_info.company_name}</p>
              )}
            </div>
          )}
          <p className="text-gray-500 max-w-2xl mx-auto text-xs sm:text-sm whitespace-pre-line">
            {agent
              ? (page.business_info?.disclaimer || '본 홍보물의 내용은 소비자의 이해를 돕기 위해 제작된 것으로, 개발·분양사의 사정에 따라 변경될 수 있으며 법적 효력이 없습니다.')
                .replace(/분양대행사\s*[:：].*?((?=시행)|$)/gs, '')
                .trim()
              : (page.business_info?.disclaimer ||
                '본 홍보물의 내용은 소비자의 이해를 돕기 위해 제작된 것으로, 개발·분양사의 사정에 따라 변경될 수 있으며 법적 효력이 없습니다. 계약 시에는 반드시 모집공고문과 계약서를 기준으로 확인하시기 바랍니다.')}
          </p>
          <a
            href="https://www.applyhome.co.kr/ai/aia/selectOtherLttotPblancListView.do"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 sm:mt-3 inline-block text-gray-500 hover:text-gray-300 underline text-xs sm:text-sm"
          >
            청약홈 바로가기
          </a>
          <p className="mt-2 sm:mt-3 text-gray-600 text-xs">&copy; {new Date().getFullYear()} ONSIA. All rights reserved.</p>
        </footer>

        {/* Fixed Bottom Bar (mobile only) */}
        {page.show_bottom_bar && (
          <BottomBar phoneNumber={effectivePhone || null} kakaoUrl={effectiveKakao || null} isAgent={!!agent} />
        )}

        {/* Popup Modal 1 - 청약홈 */}
        {slug === 'urbanhomes' && (
          <PopupModal
            imageUrl="https://static.wixstatic.com/media/a5ff46_031e0795c8dc484ebfb8e3b4a1ee9541~mv2.jpg/v1/fill/w_460,h_624,al_c,lg_1,q_80,enc_avif,quality_auto/1_%ED%8C%9D%EC%97%85%EC%B0%BD.jpg"
            linkUrl="https://www.applyhome.co.kr/ai/aia/selectOtherLttotPblancListView.do"
            alt="청약홈 안내"
            storageKey="popup-dismissed-1"
          />
        )}
        {/* Popup Modal 2 - UNIT VR (1번 닫은 후 표시) */}
        {slug === 'urbanhomes' && (
          <PopupModal
            imageUrl="/images/unit-vr-thumb.jpeg"
            linkUrl="https://urbanhomes.co.kr/wangsimni_urban_homes/index.html"
            alt="UNIT VR 모델하우스"
            storageKey="popup-dismissed-2"
            waitForKey="popup-dismissed-1"
          />
        )}
        {/* yamok-grandhill: GRAND OPEN 팝업 (모바일) */}
        {slug === 'yamok-grandhill' && (
          <PopupModal
            imageUrl="/uploads/landing/yamok/popup-grand-open.png"
            alt="GRAND OPEN"
            storageKey="yamok-popup-grandopen-m"
          />
        )}
      </div>
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import InquiryForm from '../InquiryForm'
import BottomBar from '../BottomBar'
import YamokCoffeeEventBanner from '../YamokCoffeeEventBanner'
import { YAMOK_FAQ } from '../yamok-faq'

interface Page {
  id: string
  project_name: string
  logo_image?: string | null
  phone_number?: string | null
  kakao_chat_url?: string | null
  show_bottom_bar?: boolean | null
  business_info?: { company_name?: string; disclaimer?: string } | null
}

interface Props {
  page: Page
  slug: string
  category: string
  categoryTitle: string
  categorySubtitle?: string
  primaryColor: string
  accentColor: string
}

// 네비게이션 구조 (slug별 분기)
type NavLink = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

const NAV_LINKS_BY_SLUG: Record<string, NavLink[]> = {
  urbanhomes: [
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
      href: '/urbanhomes/layout',
      children: [
        { label: '동호수배치도', href: '/urbanhomes/layout' },
      ],
    },
    {
      label: '프리미엄',
      href: '/urbanhomes/premium',
      children: [
        { label: '프리미엄', href: '/urbanhomes/premium' },
        { label: '입지환경', href: '/urbanhomes/environment' },
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
  // 야목역 - 모든 메뉴 항목이 실제 sub-page로 연결됨
  'yamok-grandhill': [
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
}

export default function CategoryPage({
  page, slug, category, categoryTitle, categorySubtitle, primaryColor, accentColor,
}: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSection, setOpenSection] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 모바일 메뉴 열렸을 때 body 스크롤 잠금
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const phone = page.phone_number || '1668-5257'
  const navLinks = NAV_LINKS_BY_SLUG[slug] || NAV_LINKS_BY_SLUG.urbanhomes
  const showBottomBar = page.show_bottom_bar !== false

  return (
    <div className={`min-h-screen bg-white ${showBottomBar ? 'pb-14 lg:pb-0' : ''}`}>
      {/* ===== PC HEADER (lg+) ===== */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/60">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between gap-4 h-[90px]">
          {/* Logo → 메인으로 */}
          <a href={`/${slug}`} className="flex items-center gap-3 flex-shrink-0">
            {page.logo_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={page.logo_image} alt={page.project_name} className="h-14" />
            ) : (
              <span className="text-2xl xl:text-3xl font-bold tracking-tight whitespace-nowrap" style={{ color: primaryColor }}>
                {page.project_name}
              </span>
            )}
          </a>

          {/* Navigation */}
          <nav className="flex items-center gap-0 flex-shrink-0">
            {navLinks.map((item, idx) => (
              <div key={idx} className="relative group">
                <a
                  href={item.href}
                  className="block px-5 py-3 text-[18px] xl:text-[20px] font-semibold text-gray-800 hover:text-black transition-colors whitespace-nowrap"
                >
                  {item.label}
                </a>
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

          {/* Phone */}
          <a href={`tel:${phone}`} className="flex items-center gap-2 text-[22px] xl:text-[24px] font-extrabold tracking-tight text-gray-900 whitespace-nowrap flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            {phone}
          </a>
        </div>
      </header>

      {/* ===== MOBILE HEADER (<lg) ===== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/60">
        <div className="flex items-center justify-between px-4 h-14">
          <a href={`/${slug}`} className="flex items-center gap-2 min-w-0">
            {page.logo_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={page.logo_image} alt={page.project_name} className="h-8 max-w-[180px] object-contain" />
            ) : (
              <span className="text-base font-bold truncate" style={{ color: primaryColor }}>
                {page.project_name}
              </span>
            )}
          </a>
          <div className="flex items-center gap-1">
            <a
              href={`tel:${phone}`}
              className="p-2 text-gray-800"
              aria-label="전화 걸기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </a>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-800"
              aria-label="메뉴 열기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ===== MOBILE DRAWER MENU ===== */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[360px] bg-white shadow-2xl overflow-y-auto">
            <div
              className="flex items-center justify-between px-4 h-14 border-b border-gray-200"
              style={{ backgroundColor: primaryColor }}
            >
              <span className="text-white font-bold">MENU</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white"
                aria-label="메뉴 닫기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="py-2">
              <a
                href={`/${slug}`}
                className="block px-5 py-4 text-[15px] font-semibold text-gray-900 border-b border-gray-100 hover:bg-gray-50"
              >
                HOME
              </a>
              {navLinks.map((item, idx) => {
                const expanded = openSection === idx
                return (
                  <div key={idx} className="border-b border-gray-100">
                    <button
                      onClick={() =>
                        setOpenSection(expanded ? null : idx)
                      }
                      className="w-full flex items-center justify-between px-5 py-4 text-[15px] font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      <span>{item.label}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {expanded && item.children && item.children.length > 0 && (
                      <ul className="bg-gray-50">
                        {item.children.map((sub, si) => (
                          <li key={si}>
                            <a
                              href={sub.href}
                              className="block px-8 py-3 text-[14px] text-gray-700 hover:text-black hover:bg-gray-100"
                            >
                              {sub.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </nav>
            <a
              href={`tel:${phone}`}
              className="m-4 flex items-center justify-center gap-2 h-12 rounded-md text-white font-bold text-base"
              style={{ backgroundColor: primaryColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              {phone}
            </a>
          </div>
        </div>
      )}

      {/* ===== PAGE TITLE BANNER ===== */}
      <section className="pt-14 lg:pt-[90px]">
        <div className="py-10 lg:py-20 text-center" style={{ backgroundColor: primaryColor }}>
          <h1 className="text-2xl lg:text-5xl font-bold text-white mb-1 lg:mb-2 px-4">{categoryTitle}</h1>
          {categorySubtitle && (
            <p className="text-white/60 text-xs lg:text-lg tracking-widest mt-2 lg:mt-3 px-4">{categorySubtitle}</p>
          )}
        </div>
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-3 lg:py-4 flex items-center gap-2 text-xs lg:text-sm text-gray-500">
            <a href={`/${slug}`} className="hover:text-gray-800">HOME</a>
            <span>&gt;</span>
            <span className="text-gray-800 font-medium truncate">{categoryTitle}</span>
          </div>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="py-10 lg:py-20 px-4 lg:px-8">
        <div className="max-w-[1100px] mx-auto">
          {/* 어반홈스 */}
          {slug === 'urbanhomes' && (
            <>
              {category === 'business' && <BusinessContent />}
              {category === 'location' && <LocationContent />}
              {category === 'layout' && <LayoutContent />}
              {category === 'premium' && <PremiumContent />}
              {category === 'environment' && <EnvironmentContent />}
              {category === 'unit' && <UnitContent />}
              {category === 'inquiry' && (
                <div className="max-w-[700px] mx-auto">
                  <InquiryForm pageId={page.id} slug={slug} accentColor={accentColor} />
                </div>
              )}
            </>
          )}

          {/* 야목역 서희스타힐스 그랜드힐 */}
          {slug === 'yamok-grandhill' && (
            <>
              {category === 'business' && <YamokBusinessContent />}
              {category === 'premium' && <YamokPremiumContent />}
              {category === 'brand' && <YamokBrandContent />}
              {category === 'location' && <YamokLocationContent primaryColor={primaryColor} />}
              {category === 'schedule' && <YamokScheduleContent />}
              {category === 'supply' && <YamokSupplyContent />}
              {category === 'apply' && <YamokApplyContent />}
              {category === 'subscription' && <YamokSubscriptionContent />}
              {category === 'layout' && <YamokLayoutContent />}
              {category === 'units' && <YamokUnitsContent />}
              {category === 'floorplan' && <YamokFloorplanContent />}
              {category === 'vr' && <YamokVRContent primaryColor={primaryColor} />}
              {category === 'interior' && <YamokInteriorContent />}
              {category === 'option' && <YamokOptionContent />}
              {category === 'faq' && <YamokFaqContent />}
              {category === 'inquiry' && (
                <div className="max-w-[700px] mx-auto">
                  <YamokCoffeeEventBanner />
                  <div id="inquiry-form" className="rounded-2xl border border-gray-200 shadow-sm">
                    <InquiryForm pageId={page.id} slug={slug} accentColor={accentColor} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#f5f5f5] py-10 lg:py-14 px-4 lg:px-8">
        <div className="max-w-[1000px] mx-auto text-center">
          {page.logo_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={page.logo_image} alt={page.project_name} className="h-8 lg:h-10 mx-auto mb-4 lg:mb-6" />
          ) : (
            <p className="text-base lg:text-xl font-bold mb-4 lg:mb-6" style={{ color: primaryColor }}>{page.project_name}</p>
          )}
          <p className="text-[12px] lg:text-[13px] text-gray-500 leading-relaxed mb-4 lg:mb-5 whitespace-pre-line">
            {page.business_info?.disclaimer ||
              '※ 본 사이트의 이미지는 소비자의 이해를 돕기 위해 제작된 것으로 실제 시공 시 다를 수 있습니다.'}
          </p>
          {page.business_info?.company_name && (
            <p className="text-[12px] lg:text-[13px] text-gray-400 leading-loose">{page.business_info.company_name}</p>
          )}
          <p className="mt-5 lg:mt-6 text-[11px] lg:text-[12px] text-gray-400">
            Copyright &copy; {new Date().getFullYear()} {page.project_name}. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* ===== MOBILE BOTTOM BAR ===== */}
      {showBottomBar && (
        <BottomBar
          phoneNumber={page.phone_number || phone}
          kakaoUrl={page.kakao_chat_url || null}
          inquiryHref={`/${slug}/inquiry`}
        />
      )}

      {/* ===== SCROLL TO TOP ===== */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed right-4 lg:right-5 z-40 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#333] text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-[#555] ${showBottomBar ? 'bottom-20 lg:bottom-8' : 'bottom-6 lg:bottom-8'} ${
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

/* ===== 카테고리별 콘텐츠 컴포넌트 ===== */

function BusinessContent() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/uploads/landing/urbanhomes/business01.jpg" alt="사업개요" className="w-full block rounded-lg mb-12" loading="lazy" />
      <div className="grid grid-cols-2 gap-8">
        <InfoTable
          title="왕십리역 어반홈스 A동"
          rows={[
            ['대지위치', '서울특별시 성동구 도선동 114, 115번지'],
            ['대지면적', '325.60㎡(98.494평)'],
            ['연면적', '2,715.11㎡(821.321평)'],
            ['지역지구', '일반상업지역, 지구단위계획구역(왕십리광역중심)'],
            ['공급규모', '지하3층~지상13층, 1개동, 오피스텔42실, 근린생활시설3실'],
            ['주차대수', '37대 [기계식주차 35대, 자주식주차2대(장애인주차포함)]'],
            ['용적율 / 건폐율', '701.05% / 59.98%'],
          ]}
        />
        <InfoTable
          title="왕십리역 어반홈스 B동"
          rows={[
            ['대지위치', '서울특별시 성동구 도선동 116, 117번지'],
            ['대지면적', '309.10㎡(93.503평)'],
            ['연면적', '2,544.29㎡(769.648평)'],
            ['지역지구', '일반상업지역, 지구단위계획구역(왕십리광역중심)'],
            ['공급규모', '지하3층~지상13층, 1개동, 오피스텔42실, 근린생활시설3실'],
            ['주차대수', '36대 [기계식주차 35대, 자주식주차1대(장애인주차포함)]'],
            ['용적율 / 건폐율', '700.05% / 59.91%'],
          ]}
        />
      </div>
    </>
  )
}

function InfoTable({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-900 text-white text-center py-3 text-lg font-bold">{title}</div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-gray-100">
              <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700 w-[140px]">{label}</th>
              <td className="px-4 py-3 text-gray-600">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function LocationContent() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=99928cf1f21dbccb73c00344b2bd66d3&autoload=false`
    script.onload = () => {
      const kakao = (window as unknown as Record<string, unknown>).kakao as {
        maps: {
          load: (cb: () => void) => void
          LatLng: new (lat: number, lng: number) => unknown
          Map: new (el: HTMLElement, opts: Record<string, unknown>) => unknown
          Marker: new (opts: Record<string, unknown>) => void
          InfoWindow: new (opts: Record<string, unknown>) => { open: (map: unknown, marker: unknown) => void }
        }
      }
      kakao.maps.load(() => {
        const container = document.getElementById('kakao-map')
        if (!container) return
        const position = new kakao.maps.LatLng(37.5656, 127.0365)
        const map = new kakao.maps.Map(container, {
          center: position,
          level: 3,
        })
        const marker = new kakao.maps.Marker({ map, position })
        const infoWindow = new kakao.maps.InfoWindow({
          content: '<div style="padding:8px 12px;font-size:14px;font-weight:bold;white-space:nowrap;">왕십리역 어반홈스</div>',
        })
        infoWindow.open(map, marker)
      })
    }
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  return (
    <>
      <p className="text-center text-gray-500 mb-10 text-lg">서울특별시 성동구 도선동 114 외 3필지</p>
      <div id="kakao-map" className="rounded-lg overflow-hidden shadow-lg" style={{ width: '100%', height: 500 }} />
      <div className="mt-6 text-center">
        <a
          href="https://map.kakao.com/link/map/왕십리역 어반홈스,37.5656,127.0365"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          카카오맵에서 크게 보기 &rarr;
        </a>
      </div>
    </>
  )
}

function LayoutContent() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/uploads/landing/urbanhomes/layout.jpg" alt="동호수배치도" className="w-full block rounded-lg" loading="lazy" />
  )
}

function PremiumContent() {
  const base = '/uploads/landing/urbanhomes'
  return (
    <div className="space-y-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${base}/premium-main.jpg`} alt="프리미엄" className="w-full block rounded-lg" loading="lazy" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {['premium-card1', 'premium-card2', 'premium-card3', 'premium-card4'].map((name) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={name} src={`${base}/${name}.png`} alt={`프리미엄 옵션`} className="w-full block rounded-lg" loading="lazy" />
        ))}
      </div>
      {['premium-graph.webp', 'premium-flex.webp', 'premium-extra1.png', 'premium-extra2.png'].map((name) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={name} src={`${base}/${name}`} alt="프리미엄" className="w-full block rounded-lg" loading="lazy" />
      ))}
    </div>
  )
}

function EnvironmentContent() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/uploads/landing/urbanhomes/environment01.png" alt="입지환경" className="w-full block rounded-lg" loading="lazy" />
  )
}

function UnitContent() {
  return (
    <>
      {/* A동 */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">A동</h3>
        <div className="grid grid-cols-2 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`a-${n}`} src={`/uploads/landing/urbanhomes/unit0${n}.jpg`} alt={`A동 UNIT ${n}`} className="w-full block rounded-lg" loading="lazy" />
          ))}
        </div>
      </div>
      {/* B동 */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">B동</h3>
        <div className="grid grid-cols-2 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`b-${n}`} src={`/uploads/landing/urbanhomes/B_unit0${n}.jpg`} alt={`B동 UNIT ${n}`} className="w-full block rounded-lg" loading="lazy" />
          ))}
        </div>
      </div>
    </>
  )
}

/* ===== 야목역 서희스타힐스 그랜드힐 카테고리 컴포넌트 ===== */

// 사업개요 - 참조 사이트 business.php 그대로
function YamokBusinessContent() {
  const notices = [
    '본 홈페이지에서 사용된 사진, CG 및 그림은 소비자의 이해를 돕기 위해 제작된 것으로 실제와 차이가 있으니 유의하시기 바랍니다.',
    '본 홈페이지의 내용은 향후 개발 계획 및 인·허가에 따라 변경될 수 있습니다.',
    '본 홈페이지는 제작과정상 오류가 있을 수 있으니 자세한 사항은 문의해 주시기 바랍니다.',
    '본 홈페이지는 민·형사상 소송의 자료로 사용할 수 없습니다.',
  ]
  return (
    <>
      {/* 단지 CG + 사업 정보 표 (한 이미지에 통합) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/uploads/landing/yamok/business.png"
        alt="야목역 서희스타힐스 그랜드힐 사업개요"
        className="w-full block rounded-lg shadow-sm mb-12"
        loading="lazy"
      />

      {/* SEO 본문 — 야목역 서희스타힐스 그랜드힐 사업개요 텍스트 */}
      <article className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed mb-10">
        <p>
          <strong>야목역 서희스타힐스 그랜드힐</strong>은 경기도 화성시 비봉면 구포리 614-18번지 일원 비봉택지지구에 들어서는
          {' '}<strong>998세대 규모의 신축 아파트</strong>입니다. 수인분당선 야목역 도보권에 위치하며,
          GTX-F 노선(예정) 호재로 더블역세권의 미래가치를 갖춘 단지입니다.
        </p>
        <ul>
          <li><strong>단지 위치:</strong> 경기도 화성시 비봉면 구포리 614-18번지 일원 (비봉택지지구)</li>
          <li><strong>총 세대수:</strong> 998세대</li>
          <li><strong>주택 형태:</strong> 전용면적 59㎡A·B·C, 84㎡A·B 두 가지 평형 (총 5개 타입)</li>
          <li><strong>입주 예정:</strong> 2028년</li>
          <li><strong>분양 형식:</strong> 일반분양 + 관심고객 등록 운영</li>
        </ul>
        <p>
          야목역 서희스타힐스 그랜드힐은 비봉택지지구의 신규 개발 호재와 야목역세권 브랜드타운으로서의 입지 프리미엄을 동시에 갖춘
          단지입니다. 견본주택은 방문예약제로 상시 운영 중이며, 360° E-모델하우스 VR을 통해 59㎡A·84㎡B 두 타입을
          사전에 미리 체험할 수 있습니다.
        </p>
      </article>

      {/* 주의사항 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-8 flex gap-3 md:gap-5 items-start">
        <div className="flex-shrink-0 w-9 h-9 md:w-12 md:h-12 rounded-full bg-gray-300 text-white text-lg md:text-2xl font-bold flex items-center justify-center">
          !
        </div>
        <ul className="space-y-2 text-[13px] md:text-[15px] text-gray-700 leading-relaxed">
          {notices.map((n, i) => (
            <li key={i} className="flex gap-2">
              <span className="flex-shrink-0">※</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

// 입지 프리미엄
function YamokPremiumContent() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/uploads/landing/yamok/premium.png"
        alt="야목역 서희스타힐스 그랜드힐 입지 프리미엄"
        className="w-full block rounded-lg shadow-sm mb-10"
        loading="lazy"
      />

      {/* SEO 본문 — 입지환경 텍스트 */}
      <article className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed">
        <p>
          <strong>야목역 서희스타힐스 그랜드힐 입지</strong>는 수인분당선 야목역을 중심으로 한 더블역세권 호재가 핵심입니다.
          화성 비봉택지지구 내 신규 개발 단지로 광역교통망과 자연환경을 동시에 갖추고 있습니다.
        </p>
        <h3>교통 인프라</h3>
        <ul>
          <li><strong>수인분당선 야목역</strong> 도보권 단지 (역세권 입지)</li>
          <li><strong>GTX-F 야목역</strong> 정차 예정 — 강남·여의도 직결 호재</li>
          <li>봉담 IC·매송 IC 광역도로망 인접</li>
          <li>수원·안산·서울 도심 접근성 우수</li>
        </ul>
        <h3>주변 환경</h3>
        <ul>
          <li>비봉택지지구 신규 개발로 인근 인프라 동반 성장</li>
          <li>화성 비봉면·매송면 자연환경, 학세권 형성 진행 중</li>
          <li>야목역 일대 상업·생활편의시설 확충 계획</li>
        </ul>
        <p>
          야목역 서희스타힐스 그랜드힐은 단순한 신축 아파트가 아닌, 야목역세권 브랜드타운의 첫 자리로 미래 가치가 기대됩니다.
          비봉서희스타힐스로도 불리는 본 단지는 화성 비봉 일대의 대표 신축 아파트 분양으로 자리매김하고 있습니다.
        </p>
      </article>
    </>
  )
}

// 브랜드 소개
function YamokBrandContent() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/uploads/landing/yamok/brand.jpg"
      alt="서희스타힐스 브랜드 소개"
      className="w-full block rounded-lg shadow-sm"
      loading="lazy"
    />
  )
}

// 오시는길
function YamokLocationContent({ primaryColor }: { primaryColor: string }) {
  const modelhouse = '경기도 안산시 단원구 광덕4로 178'
  const site = '경기도 화성시 비봉면 구포리 614-18번지 일원'
  const naverUrl = (q: string) => `https://map.naver.com/p/search/${encodeURIComponent(q)}`
  const kakaoUrl = (q: string) => `https://map.kakao.com/?q=${encodeURIComponent(q)}`

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/uploads/landing/yamok/location.png"
        alt="야목역 서희스타힐스 그랜드힐 오시는길"
        className="w-full block rounded-lg shadow-sm mb-10"
        loading="lazy"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: primaryColor }}>
            견본주택
          </h3>
          <p className="text-[15px] text-gray-700 leading-relaxed mb-5">{modelhouse}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={naverUrl(modelhouse)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-md bg-gray-900 text-white text-[14px] font-semibold hover:bg-gray-800 transition-colors"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-[#03C75A] text-white text-[12px] font-extrabold">N</span>
              네이버 지도
            </a>
            <a
              href={kakaoUrl(modelhouse)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-md bg-[#FEE500] text-gray-900 text-[14px] font-semibold hover:brightness-95 transition-all"
            >
              카카오 지도
            </a>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: primaryColor }}>
            현장
          </h3>
          <p className="text-[15px] text-gray-700 leading-relaxed mb-5">{site}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={naverUrl(site)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-md bg-gray-900 text-white text-[14px] font-semibold hover:bg-gray-800 transition-colors"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-[#03C75A] text-white text-[12px] font-extrabold">N</span>
              네이버 지도
            </a>
            <a
              href={kakaoUrl(site)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-md bg-[#FEE500] text-gray-900 text-[14px] font-semibold hover:brightness-95 transition-all"
            >
              카카오 지도
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

// 분양일정
function YamokScheduleContent() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/uploads/landing/yamok/schedule.png" alt="야목역 서희스타힐스 그랜드힐 분양일정" className="w-full block rounded-lg shadow-sm mb-10" loading="lazy" />

      {/* SEO 본문 — 분양정보 텍스트 */}
      <article className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed">
        <p>
          <strong>야목역 서희스타힐스 그랜드힐 분양</strong>은 998세대 규모 일반분양으로 진행되며,
          견본주택 방문 전 사전예약과 360° VR 체험을 통해 충분한 정보 확인이 가능합니다.
        </p>
        <h3>분양 안내</h3>
        <ul>
          <li><strong>분양 문의:</strong> 1668-5257 (방문예약 / 분양 상담)</li>
          <li><strong>모델하우스:</strong> 방문예약제 상시 운영 (경기도 안산시 단원구 광덕4로 178)</li>
          <li><strong>E-모델하우스 VR:</strong> 59㎡A · 84㎡B 360° 사전 체험 가능</li>
          <li><strong>관심고객 등록:</strong> 분양일정·로얄층 우선 안내</li>
        </ul>
        <p>
          야목역 서희스타힐스 그랜드힐의 정확한 입주자모집공고일, 청약 자격, 당첨자발표일, 계약일 등 핵심 일정은
          모집공고 페이지와 공급안내 페이지에서 확인 가능하며, 관심고객 등록 시 일정이 확정되는 즉시 우선 안내해 드립니다.
        </p>
      </article>
    </>
  )
}

// 공급안내
function YamokSupplyContent() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/uploads/landing/yamok/info03.png" alt="야목역 서희스타힐스 그랜드힐 공급안내 (59㎡A·B·C / 84㎡A·B 타입)" className="w-full block rounded-lg shadow-sm" loading="lazy" />
  )
}

// 모집공고
function YamokApplyContent() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/uploads/landing/yamok/apply.png" alt="야목역 서희스타힐스 그랜드힐 모집공고 - 화성 비봉 분양" className="w-full block rounded-lg shadow-sm" loading="lazy" />
  )
}

// 청약안내
function YamokSubscriptionContent() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/uploads/landing/yamok/ssp_guide.png" alt="야목역 서희스타힐스 그랜드힐 청약안내 (특별공급·일반공급)" className="w-full block rounded-lg shadow-sm" loading="lazy" />
  )
}

// 단지배치도
function YamokLayoutContent() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/uploads/landing/yamok/cpx_layout.png" alt="야목역 서희스타힐스 그랜드힐 단지배치도" className="w-full block rounded-lg shadow-sm" loading="lazy" />
  )
}

// 동호수배치도
function YamokUnitsContent() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/uploads/landing/yamok/no_layout.png" alt="야목역 서희스타힐스 그랜드힐 동호수배치도" className="w-full block rounded-lg shadow-sm" loading="lazy" />
  )
}

// 평면안내 (5개 타입)
function YamokFloorplanContent() {
  const types = [
    { src: '/uploads/landing/yamok/unitplan_59a.png', label: '59A' },
    { src: '/uploads/landing/yamok/unitplan_59b.png', label: '59B' },
    { src: '/uploads/landing/yamok/unitplan_59c.png', label: '59C' },
    { src: '/uploads/landing/yamok/unitplan_84a.png', label: '84A' },
    { src: '/uploads/landing/yamok/unitplan_84b.png', label: '84B' },
  ]
  return (
    <div className="space-y-10 md:space-y-14">
      {types.map((t) => (
        <div key={t.label}>
          <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-4 md:mb-5 text-center">
            <span className="inline-block px-3 md:px-4 py-0.5 md:py-1 rounded-full bg-gray-900 text-white text-xs md:text-base mr-2 md:mr-3 align-middle">TYPE</span>
            {t.label}
          </h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.src} alt={`야목역 서희스타힐스 그랜드힐 ${t.label} 타입 평면도 (전용 ${t.label.startsWith('59') ? '59㎡' : '84㎡'})`} className="w-full block rounded-lg shadow-sm" loading="lazy" />
        </div>
      ))}
    </div>
  )
}

// E-모델하우스 (VR)
function YamokVRContent({ primaryColor }: { primaryColor: string }) {
  const vrs = [
    {
      label: '59A',
      area: '전용 59㎡A타입',
      thumb: '/uploads/landing/yamok/unitplan_59a.png',
      href: '/vr/yamok/S59A.html',
    },
    {
      label: '84B',
      area: '전용 84㎡B타입',
      thumb: '/uploads/landing/yamok/unitplan_84b.png',
      href: '/vr/yamok/S84B.html',
    },
  ]
  return (
    <>
      <p className="text-center text-gray-600 text-[14px] md:text-[16px] leading-relaxed mb-8 md:mb-12">
        야목역 서희스타힐스 그랜드힐 세대를 360° VR로 미리 체험해보세요.
        <br className="hidden md:block" />
        <span className="text-gray-500">실제 시공 시 일부 사양 및 마감재가 변경될 수 있습니다.</span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {vrs.map((v) => (
          <a
            key={v.label}
            href={v.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Thumbnail */}
            <div className="relative bg-gray-50 aspect-[4/3] overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.thumb}
                alt={`야목역 서희스타힐스 그랜드힐 ${v.label} 타입 360° VR 모델하우스 평면도`}
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* 360 / VR badge */}
              <span
                className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] md:text-[12px] font-bold text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
                  <ellipse cx="12" cy="12" rx="9" ry="3" />
                </svg>
                360° VR
              </span>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-5 py-2.5 rounded-full bg-white text-gray-900 text-[13px] md:text-[14px] font-bold shadow-lg">
                  VR 둘러보기 →
                </span>
              </div>
            </div>
            {/* Body */}
            <div className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  <span className="inline-block px-3 py-0.5 rounded-md text-white text-sm md:text-base mr-2 align-middle" style={{ backgroundColor: primaryColor }}>
                    TYPE
                  </span>
                  {v.label}
                </h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </div>
              <p className="text-[13px] md:text-[14px] text-gray-500">{v.area}</p>
              <button
                type="button"
                className="mt-4 md:mt-5 w-full inline-flex items-center justify-center gap-2 h-11 md:h-12 rounded-lg text-white text-[14px] md:text-[15px] font-bold transition-all"
                style={{ backgroundColor: primaryColor }}
                tabIndex={-1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                VR 입장하기
              </button>
            </div>
          </a>
        ))}
      </div>
      <p className="mt-8 md:mt-10 text-center text-[12px] md:text-[13px] text-gray-400 leading-relaxed">
        ※ VR 콘텐츠는 새 탭에서 열립니다. 모바일 데이터 사용량이 많을 수 있으니 Wi-Fi 환경을 권장합니다.
      </p>
    </>
  )
}

// 마감재 리스트
function YamokInteriorContent() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/uploads/landing/yamok/interior.png" alt="야목역 서희스타힐스 그랜드힐 마감재 리스트" className="w-full block rounded-lg shadow-sm" loading="lazy" />
  )
}

// 추가선택품목
function YamokOptionContent() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/uploads/landing/yamok/option.png" alt="야목역 서희스타힐스 그랜드힐 추가선택품목" className="w-full block rounded-lg shadow-sm" loading="lazy" />
  )
}

// FAQ — 자주 묻는 질문 (SEO 자연검색 노출용)
function YamokFaqContent() {
  return (
    <div className="max-w-3xl mx-auto">
      <p className="text-gray-600 text-[14px] md:text-[16px] leading-relaxed mb-6 md:mb-8">
        야목역 서희스타힐스 그랜드힐과 관련해 가장 많이 문의하시는 내용을 모았습니다.
        추가 문의는 분양상담 <strong className="text-gray-900">1668-5257</strong>로 연락 주세요.
      </p>
      <div className="space-y-3">
        {YAMOK_FAQ.map((f, i) => (
          <details
            key={i}
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden"
            open={i === 0}
          >
            <summary className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5 cursor-pointer list-none hover:bg-gray-50">
              <h2 className="text-[15px] md:text-[17px] font-semibold text-gray-900 pr-3">
                Q. {f.q}
              </h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0 w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="px-4 md:px-6 pb-5 md:pb-6 text-[14px] md:text-[15.5px] text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
              {f.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

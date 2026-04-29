'use client'

import { useState, useEffect } from 'react'
import InquiryForm from '../InquiryForm'

interface Page {
  id: string
  project_name: string
  logo_image?: string | null
  phone_number?: string | null
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
  // 야목역 - 참조 사이트 메뉴 그대로. 아직 sub-page 없는 카테고리는 메인 페이지 anchor로
  'yamok-grandhill': [
    {
      label: '사업안내',
      href: '/yamok-grandhill/business',
      children: [
        { label: '사업개요', href: '/yamok-grandhill/business' },
        { label: '입지프리미엄', href: '/yamok-grandhill#pc-gallery' },
        { label: '브랜드소개', href: '/yamok-grandhill#pc-gallery' },
        { label: '오시는길', href: '/yamok-grandhill#pc-location' },
      ],
    },
    {
      label: '분양안내',
      href: '/yamok-grandhill#pc-gallery',
      children: [
        { label: '분양일정', href: '/yamok-grandhill#pc-gallery' },
        { label: '공급안내', href: '/yamok-grandhill#pc-gallery' },
        { label: '모집공고', href: '/yamok-grandhill#pc-gallery' },
      ],
    },
    {
      label: '청약안내',
      href: '/yamok-grandhill#pc-gallery',
      children: [
        { label: '청약안내', href: '/yamok-grandhill#pc-gallery' },
        { label: '특별공급', href: '/yamok-grandhill#pc-gallery' },
        { label: '일반공급', href: '/yamok-grandhill#pc-gallery' },
      ],
    },
    {
      label: '단지안내',
      href: '/yamok-grandhill#pc-gallery',
      children: [
        { label: '단지배치도', href: '/yamok-grandhill#pc-gallery' },
        { label: '동호수배치도', href: '/yamok-grandhill#pc-gallery' },
      ],
    },
    {
      label: '세대안내',
      href: '/yamok-grandhill#pc-gallery',
      children: [
        { label: '평면안내', href: '/yamok-grandhill#pc-gallery' },
        { label: '마감재리스트', href: '/yamok-grandhill#pc-gallery' },
        { label: '추가선택품목', href: '/yamok-grandhill#pc-gallery' },
      ],
    },
    {
      label: '고객센터',
      href: '/yamok-grandhill#pc-inquiry',
      children: [
        { label: '관심고객등록', href: '/yamok-grandhill#pc-inquiry' },
      ],
    },
  ],
}

export default function CategoryPage({
  page, slug, category, categoryTitle, categorySubtitle, primaryColor, accentColor,
}: Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const phone = page.phone_number || '1668-5257'
  const navLinks = NAV_LINKS_BY_SLUG[slug] || NAV_LINKS_BY_SLUG.urbanhomes

  return (
    <div className="min-h-screen bg-white">
      {/* ===== FIXED HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/60">
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

      {/* ===== PAGE TITLE BANNER ===== */}
      <section className="pt-[90px]">
        <div className="py-20 text-center" style={{ backgroundColor: primaryColor }}>
          <h1 className="text-5xl font-bold text-white mb-2">{categoryTitle}</h1>
          {categorySubtitle && (
            <p className="text-white/60 text-lg tracking-widest mt-3">{categorySubtitle}</p>
          )}
        </div>
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-[1100px] mx-auto px-8 py-4 flex items-center gap-2 text-sm text-gray-500">
            <a href={`/${slug}`} className="hover:text-gray-800">HOME</a>
            <span>&gt;</span>
            <span className="text-gray-800 font-medium">{categoryTitle}</span>
          </div>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="py-20 px-8">
        <div className="max-w-[1100px] mx-auto">
          {/* 어반홈스 */}
          {slug === 'urbanhomes' && (
            <>
              {category === 'business' && <BusinessContent />}
              {category === 'location' && <LocationContent />}
              {category === 'community' && <CommunityContent />}
              {category === 'layout' && <LayoutContent />}
              {category === 'premium' && <PremiumContent />}
              {category === 'environment' && <EnvironmentContent />}
              {category === 'smart' && <SmartContent />}
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
              {/* 다른 카테고리는 차례로 추가 예정 */}
            </>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#f5f5f5] py-14 px-8">
        <div className="max-w-[1000px] mx-auto text-center">
          {page.logo_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={page.logo_image} alt={page.project_name} className="h-10 mx-auto mb-6" />
          ) : (
            <p className="text-xl font-bold mb-6" style={{ color: primaryColor }}>{page.project_name}</p>
          )}
          <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
            {page.business_info?.disclaimer ||
              '※ 본 사이트의 이미지는 소비자의 이해를 돕기 위해 제작된 것으로 실제 시공 시 다를 수 있습니다.'}
          </p>
          {page.business_info?.company_name && (
            <p className="text-[13px] text-gray-400 leading-loose">{page.business_info.company_name}</p>
          )}
          <p className="mt-6 text-[12px] text-gray-400">
            Copyright &copy; {new Date().getFullYear()} {page.project_name}. All Rights Reserved.
          </p>
        </div>
      </footer>

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

/* ===== 카테고리별 콘텐츠 컴포넌트 ===== */

function BusinessContent() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://urbanhomes.co.kr/images/page/business01.jpg" alt="사업개요" className="w-full block rounded-lg mb-12" loading="lazy" />
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

function CommunityContent() {
  const items = [
    {
      img: 'https://urbanhomes.co.kr/images/page/community01.jpg',
      title: '공유 오피스',
      features: [
        '1인 기업, 스타트업, 소규모 기업 증가',
        '깔끔한 인테리어, 편안한 업무 환경 제공',
        '회의실, 미팅룸 등 다양한 크기의 사무 공간 제공',
        '부수적인 업무 공간 제공',
        '무인 운영 가능 인건비 부담이 크지 않음',
      ],
    },
    {
      img: 'https://urbanhomes.co.kr/images/page/community02.jpg',
      title: '휘트니스 센터',
      features: [
        "차별화 된 이미지 구축 '프리미엄 라이프 스타일'",
        '웰니스(Wellness) 트렌드에 맞춰 수요층에게 부합, 분양률이나 임대 수익을 상승',
        '임대·파트너십을 통해 안정적인 수익원 확보',
        '대단지 아파트에서 누릴 수 있는 건강한 삶',
      ],
    },
    {
      img: 'https://urbanhomes.co.kr/images/page/community03.jpg',
      title: '코인 세탁실',
      features: [
        '입주자 뿐만 아니라 인근 지역 이용객도 확보 가능',
        '대형세탁 서비스를 통해 입주 만족도 상승',
        '다양한 서비스, 시설로 추가 수익 창출',
        '무인 운영 가능 인건비 부담이 크지 않음',
      ],
    },
  ]

  return (
    <>
      <div className="space-y-16">
        {items.map((item) => (
          <div key={item.title} className="flex gap-10 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.img} alt={item.title} className="w-[500px] rounded-lg flex-shrink-0" loading="lazy" />
            <div className="pt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{item.title}</h3>
              <ul className="space-y-3">
                {item.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">&#10003;</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-10 text-center">
        ※ 일부 시설은 유료로 전환, 다른 업종으로 변경 사용될 수 있습니다.<br />
        ※ 상기 이미지는 소비자의 이해를 돕기 위한 것으로 실제와 다소 차이가 있을 수 있습니다.
      </p>
    </>
  )
}

function LayoutContent() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="https://urbanhomes.co.kr/images/page/layout.jpg" alt="동호수배치도" className="w-full block rounded-lg" loading="lazy" />
  )
}

function PremiumContent() {
  return (
    <div className="space-y-6">
      {['premium01', 'premium02', 'premium03', 'premium04', 'premium05', 'premium06'].map((name) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={name} src={`https://urbanhomes.co.kr/images/page/${name}.jpg`} alt={`프리미엄 ${name}`} className="w-full block rounded-lg" loading="lazy" />
      ))}
    </div>
  )
}

function EnvironmentContent() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="https://urbanhomes.co.kr/images/page/environment.jpg" alt="입지환경" className="w-full block rounded-lg" loading="lazy" />
  )
}

function SmartContent() {
  return (
    <div className="space-y-6">
      {['smart01', 'smart02', 'smart03'].map((name) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={name} src={`https://urbanhomes.co.kr/images/page/${name}.jpg`} alt={`스마트싱스 ${name}`} className="w-full block rounded-lg" loading="lazy" />
      ))}
    </div>
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
            <img key={`a-${n}`} src={`https://urbanhomes.co.kr/images/page/unit/unit0${n}.jpg`} alt={`A동 UNIT ${n}`} className="w-full block rounded-lg" loading="lazy" />
          ))}
        </div>
      </div>
      {/* B동 */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">B동</h3>
        <div className="grid grid-cols-2 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`b-${n}`} src={`https://urbanhomes.co.kr/images/page/unit/B_unit0${n}.jpg`} alt={`B동 UNIT ${n}`} className="w-full block rounded-lg" loading="lazy" />
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

      {/* 주의사항 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8 flex gap-5 items-start">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-300 text-white text-2xl font-bold flex items-center justify-center">
          !
        </div>
        <ul className="space-y-2 text-[14px] md:text-[15px] text-gray-700 leading-relaxed">
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

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLandingPageBySlug } from '@/lib/supabase-landing'
import { toKoreanSlug } from '@/lib/landing-slugs'
import CategoryPage from './CategoryPage'

// 카테고리 정의 (sitemap.ts에서도 import해서 sub-page 동적 등록)
export const CATEGORIES: Record<string, Record<string, { title: string; subtitle?: string }>> = {
  urbanhomes: {
    business: { title: '사업개요' },
    location: { title: '오시는길' },
    community: { title: '커뮤니티', subtitle: 'SPECIAL COMMUNITY' },
    layout: { title: '동호수배치도' },
    premium: { title: '프리미엄' },
    environment: { title: '입지환경' },
    smart: { title: '스마트싱스', subtitle: 'SMART THINGS' },
    unit: { title: '세대안내 (UNIT)' },
    inquiry: { title: '관심고객 등록' },
  },
  'yamok-grandhill': {
    // 사업안내
    business: { title: '사업개요', subtitle: 'BUSINESS' },
    premium: { title: '입지 프리미엄', subtitle: 'PREMIUM' },
    brand: { title: '브랜드 소개', subtitle: 'BRAND' },
    location: { title: '오시는길', subtitle: 'LOCATION' },
    // 분양안내
    schedule: { title: '분양일정', subtitle: 'SCHEDULE' },
    supply: { title: '공급안내', subtitle: 'SUPPLY' },
    apply: { title: '모집공고', subtitle: 'APPLY' },
    // 청약안내
    subscription: { title: '청약안내', subtitle: 'SUBSCRIPTION GUIDE' },
    // 단지안내
    layout: { title: '단지배치도', subtitle: 'COMPLEX LAYOUT' },
    units: { title: '동호수배치도', subtitle: 'UNIT LAYOUT' },
    // 세대안내
    floorplan: { title: '평면안내', subtitle: 'UNIT PLAN' },
    vr: { title: 'E-모델하우스', subtitle: 'E-MODEL HOUSE VR' },
    interior: { title: '마감재 리스트', subtitle: 'INTERIOR' },
    option: { title: '추가선택품목', subtitle: 'OPTION' },
    // 고객센터
    faq: { title: '자주 묻는 질문', subtitle: 'FAQ' },
    inquiry: { title: '관심고객 등록', subtitle: 'INQUIRY' },
  },
}

interface Props {
  params: Promise<{ slug: string; category: string }>
}

// yamok-grandhill 카테고리별 키워드 매핑 (네이버 검색어 18종 sub-page 매칭)
const YAMOK_CATEGORY_SEO: Record<string, { title: string; description: string; keywords: string }> = {
  business: {
    title: '사업개요 | 야목역 서희스타힐스 그랜드힐 | 비봉 신축 아파트',
    description:
      '야목역 서희스타힐스 그랜드힐 사업개요. 경기도 화성시 비봉면 구포리 야목역세권 브랜드타운, 비봉 신축 아파트 단지 규모·세대수·일정 안내.',
    keywords:
      '야목역서희스타힐스그랜드힐, 야목역서희스타힐스, 비봉서희스타힐스, 비봉아파트, 비봉신축아파트, 경기도화성시아파트분양',
  },
  premium: {
    title: '입지 프리미엄 | 야목역 서희스타힐스 그랜드힐 위치',
    description:
      '야목역서희스타힐스 위치 — 수인분당선 야목역 도보권, GTX-F(예정) 더블역세권. 화성 비봉 입지 프리미엄과 주변 인프라(남양·봉담 생활권) 안내.',
    keywords:
      '야목역서희스타힐스위치, 야목역서희, 야목역서희아파트, 비봉아파트, 남양아파트분양, 남양읍아파트, 봉담민간임대아파트',
  },
  brand: {
    title: '브랜드 소개 | 서희스타힐스 그랜드힐 (야목역서희스타)',
    description:
      '서희스타힐스 브랜드 — 야목역서희스타 그랜드힐, 비봉 서희스타힐스 브랜드타운. 서희건설 시공 신뢰와 그랜드힐의 프리미엄 라인업.',
    keywords:
      '야목역서희스타, 야목역서희스타힐스, 서희스타힐스, 비봉서희스타힐스',
  },
  location: {
    title: '오시는길 | 야목역 서희스타힐스 그랜드힐 모델하우스 위치',
    description:
      '야목역 서희스타힐스 그랜드힐 모델하우스 위치 — 안산시 단원구 광덕4로 178. 현장 위치 화성시 비봉면 구포리. 야목역서희스타힐스 모델하우스·현장 안내.',
    keywords:
      '야목역서희스타힐스모델하우스, 야목역서희스타힐스위치, 야목역서희, 비봉아파트',
  },
  schedule: {
    title: '분양일정 | 야목역 서희스타힐스 그랜드힐 일반분양',
    description:
      '야목역서희 일반분양 분양일정. 비봉 서희스타힐스 청약·입주자모집공고일·당첨자발표일·계약일 등 핵심 일정 안내.',
    keywords:
      '야목역서희일반분양, 야목역서희, 야목역서희아파트, 비봉아파트분양, 경기도화성시아파트분양',
  },
  supply: {
    title: '공급안내 | 야목역 서희스타힐스 그랜드힐 분양가',
    description:
      '야목역서희 분양가 안내. 야목역 서희스타힐스 그랜드힐 평형별 공급가·세대수·타입별 면적(59㎡A·B·C / 84㎡A·B) 정보.',
    keywords:
      '야목역서희분양가, 야목역서희스타힐스아파트, 야목역서희아파트, 비봉아파트분양',
  },
  apply: {
    title: '모집공고 | 야목역 서희스타힐스 그랜드힐 일반분양',
    description:
      '야목역서희 일반분양 모집공고. 입주자모집공고문, 청약 자격, 신청 방법 안내. 비봉 신축 아파트 분양.',
    keywords:
      '야목역서희일반분양, 야목역서희분양가, 비봉신축아파트, 비봉아파트분양',
  },
  subscription: {
    title: '청약안내 | 야목역 서희스타힐스 그랜드힐 일반분양',
    description:
      '야목역서희 일반분양 청약안내. 특별공급·일반공급 자격, 청약 가점, 신청 방법 — 야목역 서희스타힐스 그랜드힐.',
    keywords:
      '야목역서희일반분양, 야목역서희, 야목역서희아파트, 비봉아파트',
  },
  layout: {
    title: '단지배치도 | 야목역 서희스타힐스 그랜드힐',
    description:
      '야목역 서희스타힐스 그랜드힐 단지배치도. 동·세대 배치, 단지 내 커뮤니티 시설 한눈에 보기.',
    keywords:
      '야목역서희스타힐스, 야목역서희아파트, 비봉서희스타힐스, 비봉아파트',
  },
  units: {
    title: '동호수배치도 | 야목역 서희스타힐스 그랜드힐',
    description:
      '야목역 서희스타힐스 그랜드힐 동호수배치도. 동별·층별 호수 배치 및 향(向) 안내.',
    keywords:
      '야목역서희스타힐스아파트, 야목역서희아파트, 비봉서희스타힐스',
  },
  floorplan: {
    title: '평면안내 | 야목역 서희스타힐스 그랜드힐 (59㎡·84㎡)',
    description:
      '야목역서희 평면 안내. 59㎡A·B·C 타입과 84㎡A·B 타입 평면도, 공간 구성, 수납·서비스 면적 상세.',
    keywords:
      '야목역서희아파트, 야목역서희스타힐스아파트, 비봉아파트, 비봉신축아파트',
  },
  vr: {
    title: 'E-모델하우스 (VR) | 야목역 서희스타힐스 그랜드힐 모델하우스',
    description:
      '야목역서희스타힐스 모델하우스를 360° VR로 둘러보기. 59㎡A 타입과 84㎡B 타입 가상 모델하우스 — 견본주택 방문 전 미리 체험.',
    keywords:
      '야목역서희스타힐스모델하우스, 야목역서희스타힐스위치, 야목역서희, 비봉서희스타힐스',
  },
  interior: {
    title: '마감재 리스트 | 야목역 서희스타힐스 그랜드힐',
    description:
      '야목역 서희스타힐스 그랜드힐 마감재 리스트. 주방·욕실·바닥재·도어 등 기본 마감 사양 안내.',
    keywords:
      '야목역서희스타힐스, 야목역서희아파트, 비봉신축아파트',
  },
  option: {
    title: '추가선택품목 | 야목역 서희스타힐스 그랜드힐',
    description:
      '야목역 서희스타힐스 그랜드힐 추가선택품목 안내. 컬러·발코니 확장·가전·붙박이 옵션 정보.',
    keywords:
      '야목역서희스타힐스, 야목역서희아파트, 비봉아파트',
  },
  faq: {
    title: '자주 묻는 질문 (FAQ) | 야목역 서희스타힐스 그랜드힐',
    description:
      '야목역 서희스타힐스 그랜드힐 자주 묻는 질문 — 위치, 견본주택, 평형 타입, 교통, 분양일정, E-모델하우스 VR, 관심고객 등록 안내.',
    keywords:
      '야목역서희스타힐스, 야목역서희, 야목역서희분양가, 야목역서희스타힐스모델하우스, 야목역서희스타힐스위치, 야목역서희일반분양',
  },
  inquiry: {
    title: '관심고객 등록 | 야목역 서희스타힐스 그랜드힐',
    description:
      '야목역서희 분양 상담·관심고객 등록. 분양일정, 분양가, 모델하우스 위치 우선 안내. 1668-5257.',
    keywords:
      '야목역서희, 야목역서희분양가, 야목역서희일반분양, 비봉아파트분양',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, category } = await params
  const page = await getLandingPageBySlug(slug)
  const cat = CATEGORIES[slug]?.[category]

  if (!page || !cat) return { title: '페이지를 찾을 수 없습니다' }

  // yamok-grandhill 전용 SEO 메타 (18개 네이버 키워드 매칭)
  const yamokSeo = slug === 'yamok-grandhill' ? YAMOK_CATEGORY_SEO[category] : undefined

  const title = yamokSeo?.title || `${cat.title} | ${page.project_name}`
  const description =
    yamokSeo?.description || `${page.project_name} ${cat.title} - 분양 안내`

  const publicSlug = toKoreanSlug(slug)
  return {
    title,
    description,
    keywords: yamokSeo?.keywords,
    alternates: {
      canonical: `https://www.onsia.city/${publicSlug}/${category}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.onsia.city/${publicSlug}/${category}`,
      siteName: '온시아(ONSIA)',
      type: 'website',
      locale: 'ko_KR',
      images: page.og_image ? [page.og_image] : page.hero_image ? [page.hero_image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: page.og_image ? [page.og_image] : page.hero_image ? [page.hero_image] : [],
    },
  }
}

export default async function LandingCategoryPage({ params }: Props) {
  const { slug, category } = await params
  const page = await getLandingPageBySlug(slug)
  const cat = CATEGORIES[slug]?.[category]

  if (!page || !cat) notFound()

  const primaryColor = page.primary_color || '#1E3A5F'
  const accentColor = page.accent_color || '#C9A96E'

  return (
    <CategoryPage
      page={page}
      slug={slug}
      category={category}
      categoryTitle={cat.title}
      categorySubtitle={cat.subtitle}
      primaryColor={primaryColor}
      accentColor={accentColor}
    />
  )
}

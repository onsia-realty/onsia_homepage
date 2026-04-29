import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLandingPageBySlug } from '@/lib/supabase-landing'
import CategoryPage from './CategoryPage'

// 카테고리 정의
const CATEGORIES: Record<string, Record<string, { title: string; subtitle?: string }>> = {
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
    interior: { title: '마감재 리스트', subtitle: 'INTERIOR' },
    option: { title: '추가선택품목', subtitle: 'OPTION' },
    // 고객센터
    inquiry: { title: '관심고객 등록', subtitle: 'INQUIRY' },
  },
}

interface Props {
  params: Promise<{ slug: string; category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, category } = await params
  const page = await getLandingPageBySlug(slug)
  const cat = CATEGORIES[slug]?.[category]

  if (!page || !cat) return { title: '페이지를 찾을 수 없습니다' }

  return {
    title: `${cat.title} | ${page.project_name}`,
    description: `${page.project_name} ${cat.title} - 분양 안내`,
    openGraph: {
      title: `${cat.title} | ${page.project_name}`,
      description: `${page.project_name} ${cat.title}`,
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

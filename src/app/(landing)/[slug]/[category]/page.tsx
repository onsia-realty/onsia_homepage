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
    // 다른 카테고리는 차례로 추가 예정
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

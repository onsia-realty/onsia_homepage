// 야목 기반 랜딩 템플릿(tpl) 사이트 설정 타입
// 템플릿 컴포넌트(src/app/(landing)/[slug]/tpl/*)의 모든 하드코딩 문구·이미지·숫자를 이 설정으로 대체한다.

export interface TplImage {
  src: string
  /** SEO alt (네이버 이미지 검색 대응 — 단지명+키워드) */
  alt: string
}

export interface TplGallerySection {
  /** 앵커 id (모바일 `section-${id}`, PC `pc-${id}`) */
  id: string
  /** PC 상단 네비 라벨 */
  navLabel: string
  kicker: string
  stamp: string
  /** 섹션 제목. `highlight`가 포함된 부분은 골드로 강조 */
  title: string
  highlight?: string
  sub: string
  /** 헤더 배경 그라디언트 */
  grad: string
  images: TplImage[]
}

export type TplFactIcon = 'subway' | 'train' | 'building' | 'medal' | 'shield' | 'lake' | 'parking'

export interface TplSiteConfig {
  slug: string
  name: string
  /** 스탯 밴드 상단 영문 키커 (예: HWASEO LAKE PARK · HONORSVILLE) */
  nameEn: string
  subtitle: string
  phone: string
  colors: { primary: string; accent: string }
  hero: {
    image: string
    alt: string
    kicker: string
    title: string
    subtitle: string
    chips: string[]
  }
  /** PC 핵심 스탯 밴드 (4개 권장) */
  stats: { value: number | string; unit: string; label: string; suffix?: string }[]
  /** 모바일 팩트 스트립 (4개 권장) */
  facts: { icon: TplFactIcon; n: string; l: string; countTo?: number; suffix?: string }[]
  /** 분양 조건·혜택 체크리스트 */
  benefits: { kicker: string; title: string; items: string[] }
  /** 프리미엄 카드 (다크 그라디언트 카드 그리드) */
  premium: { kicker: string; title: string; items: { title: string; desc: string }[] }
  /** 진입 팝업존 카드 (완성 그래픽) */
  popupSlides: { key: string; image: string; alt: string; href: string }[]
  /** 관심고객 폼 상단 이벤트 카드 */
  inquiryGift?: { badge: string; image?: string; imageAlt?: string; line: string; highlight: string }
  /** 진입 이벤트 팝업(폼 포함) */
  eventPopup?: {
    eyebrow: string
    title: string
    prize: string
    prizeSub: string
    stamp: string
    note: string
    defaultMessage: string
  }
  gallery: TplGallerySection[]
  unitPlans: { type: string; area: string; units: number; src: string; alt: string; interior?: string }[]
  faq: { q: string; a: string }[]
  location: {
    image?: string
    imageAlt?: string
    siteAddress: string
    siteNaverUrl?: string
    siteKakaoUrl?: string
    modelhouseAddress: string
    modelhouseNaverUrl?: string
    modelhouseKakaoUrl?: string
  }
  footer: { companyName: string; lines: string[]; disclaimer: string }
  seo: { title: string; description: string; keywords: string[]; ogImage: string }
  structured: {
    alternateNames: string[]
    description: string
    units: number
    address: { street: string; locality: string; region: string }
    modelhouse: { street: string; locality: string; region: string }
    floorPlans: { name: string; area: number; rooms: number }[]
    features: string[]
  }
  /** 관심고객 카운터 마케팅 baseline (표시값 = baseline + 실제 등록수) */
  reserveBaseline: number
  flags: { fraudGate: boolean; liveRequests: boolean; eventPopup: boolean; reserveCounter: boolean }
}

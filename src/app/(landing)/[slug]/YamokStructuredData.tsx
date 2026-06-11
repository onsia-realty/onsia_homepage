// 야목역 서희스타힐스 그랜드힐 SEO 구조화 데이터 (Schema.org JSON-LD)
// - ApartmentComplex: 단지 정보 (네이버/구글 검색 풍부한 결과)
// - RealEstateAgent: 분양대행사 (지역 기반 검색)
// - FAQPage: 자주 묻는 질문 (검색 결과 직접 노출)

export interface YamokFaqItem {
  q: string
  a: string
}

interface Props {
  faq: YamokFaqItem[]
  ogImage?: string
  /** 페이지 기준 URL — onsia.city 한글 URL 또는 독립 도메인(야목역서희스타힐스.xyz) 루트 */
  baseUrl?: string
}

export default function YamokStructuredData({ faq, ogImage, baseUrl = 'https://www.onsia.city/야목역서희스타힐스' }: Props) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ApartmentComplex',
        '@id': `${baseUrl}#apartmentcomplex`,
        name: '야목역 서희스타힐스 그랜드힐',
        alternateName: [
          '야목역서희스타힐스그랜드힐',
          '야목역서희스타힐스',
          '야목역서희',
          '야목역서희아파트',
          '야목역서희스타',
          '야목역서희스타힐스아파트',
          '비봉서희스타힐스',
          '비봉아파트',
          '비봉신축아파트',
          '야목역 그랜드힐',
          '야목 서희스타힐스',
        ],
        keywords:
          '야목역서희스타힐스그랜드힐, 야목역서희스타힐스, 야목역서희, 야목역서희아파트, 야목역서희스타, 야목역서희스타힐스모델하우스, 야목역서희스타힐스위치, 야목역서희분양가, 야목역서희일반분양, 비봉서희스타힐스, 비봉아파트, 비봉아파트분양, 비봉신축아파트, 경기도화성시아파트분양, 남양아파트분양, 남양읍아파트, 봉담민간임대아파트',
        description:
          '야목역 서희스타힐스 그랜드힐 — 수인분당선 야목역 도보권, GTX-F(예정) 더블역세권 화성 비봉 신축 아파트. 야목역서희 모델하우스 위치·분양가·일반분양 안내. 비봉아파트 분양 / 경기도 화성시 아파트 분양.',
        url: baseUrl,
        image: ogImage || 'https://www.onsia.city/images/yamok-og.jpg',
        numberOfAccommodationUnits: 586,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '비봉면 구포리 614-18번지 일원',
          addressLocality: '화성시',
          addressRegion: '경기도',
          addressCountry: 'KR',
        },
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: '수인분당선 야목역 역세권' },
          { '@type': 'LocationFeatureSpecification', name: 'GTX-F(예정) 호재' },
          { '@type': 'LocationFeatureSpecification', name: '서희스타힐스 브랜드' },
        ],
        accommodationFloorPlan: [
          {
            '@type': 'FloorPlan',
            name: '59㎡A 타입',
            numberOfRooms: 3,
            floorSize: { '@type': 'QuantitativeValue', value: 59, unitCode: 'MTK' },
          },
          {
            '@type': 'FloorPlan',
            name: '59㎡B 타입',
            numberOfRooms: 3,
            floorSize: { '@type': 'QuantitativeValue', value: 59, unitCode: 'MTK' },
          },
          {
            '@type': 'FloorPlan',
            name: '59㎡C 타입',
            numberOfRooms: 3,
            floorSize: { '@type': 'QuantitativeValue', value: 59, unitCode: 'MTK' },
          },
          {
            '@type': 'FloorPlan',
            name: '84㎡A 타입',
            numberOfRooms: 3,
            floorSize: { '@type': 'QuantitativeValue', value: 84, unitCode: 'MTK' },
          },
          {
            '@type': 'FloorPlan',
            name: '84㎡B 타입',
            numberOfRooms: 3,
            floorSize: { '@type': 'QuantitativeValue', value: 84, unitCode: 'MTK' },
          },
        ],
      },
      {
        '@type': 'RealEstateAgent',
        '@id': `${baseUrl}#agent`,
        name: '온시아 공인중개사',
        telephone: '+82-1668-5257',
        url: baseUrl,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'KR',
        },
        taxID: '846-23-01501',
        areaServed: { '@type': 'City', name: '화성시' },
        knowsAbout: [
          '야목역 서희스타힐스 그랜드힐',
          '야목역서희 분양가',
          '야목역서희 일반분양',
          '야목역서희 모델하우스',
          '비봉 서희스타힐스',
          '비봉 아파트 분양',
          '비봉 신축 아파트',
          '경기도 화성시 아파트 분양',
          '남양 아파트 분양',
          '봉담 민간임대 아파트',
          '화성 비봉 분양',
          '야목역세권 분양',
          'GTX-F 호재 분양',
        ],
      },
      {
        '@type': 'Place',
        '@id': `${baseUrl}#site`,
        name: '야목역 서희스타힐스 그랜드힐 현장',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '비봉면 구포리 614-18번지 일원',
          addressLocality: '화성시',
          addressRegion: '경기도',
          addressCountry: 'KR',
        },
        publicAccess: true,
      },
      {
        '@type': 'Place',
        '@id': `${baseUrl}#modelhouse`,
        name: '야목역 서희스타힐스 그랜드힐 견본주택',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '단원구 광덕4로 178',
          addressLocality: '안산시',
          addressRegion: '경기도',
          addressCountry: 'KR',
        },
        telephone: '+82-1668-5257',
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}#faq`,
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '홈',
            item: 'https://www.onsia.city',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '야목역 서희스타힐스 그랜드힐',
            item: baseUrl,
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

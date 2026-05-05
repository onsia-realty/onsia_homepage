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
}

export default function YamokStructuredData({ faq, ogImage }: Props) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ApartmentComplex',
        '@id': 'https://www.onsia.city/yamok-grandhill#apartmentcomplex',
        name: '야목역 서희스타힐스 그랜드힐',
        alternateName: ['야목역서희스타힐스', '야목역 그랜드힐', '야목 서희스타힐스'],
        description:
          '수인분당선 야목역 도보권, GTX-F(예정) 더블역세권. 화성 비봉 구포리 야목역세권 브랜드타운 첫자리. 서희스타힐스 그랜드힐 신축 분양.',
        url: 'https://www.onsia.city/yamok-grandhill',
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
        '@id': 'https://www.onsia.city/yamok-grandhill#agent',
        name: '온시아 공인중개사',
        telephone: '+82-1668-5257',
        url: 'https://www.onsia.city/yamok-grandhill',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'KR',
        },
        taxID: '846-23-01501',
        areaServed: { '@type': 'City', name: '화성시' },
        knowsAbout: [
          '야목역 서희스타힐스 그랜드힐',
          '화성 비봉 분양',
          '야목역세권 분양',
          'GTX-F 호재 분양',
        ],
      },
      {
        '@type': 'Place',
        '@id': 'https://www.onsia.city/yamok-grandhill#site',
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
        '@id': 'https://www.onsia.city/yamok-grandhill#modelhouse',
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
        '@id': 'https://www.onsia.city/yamok-grandhill#faq',
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
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

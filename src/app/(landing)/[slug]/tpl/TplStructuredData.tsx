// YamokStructuredData 복제 — Schema.org JSON-LD (ApartmentComplex / RealEstateAgent / Place / FAQPage / BreadcrumbList)
import type { TplSiteConfig } from '@/landing-sites/types'

interface Props {
  config: TplSiteConfig
  baseUrl: string
}

export default function TplStructuredData({ config, baseUrl }: Props) {
  const { structured: s, seo, faq, name, phone } = config
  const tel = `+82-${phone.replace(/^0/, '')}`
  const image = seo.ogImage.startsWith('http') ? seo.ogImage : `https://www.onsia.co.kr${seo.ogImage}`
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ApartmentComplex',
        '@id': `${baseUrl}#apartmentcomplex`,
        name,
        alternateName: s.alternateNames,
        keywords: seo.keywords.join(', '),
        description: s.description,
        url: baseUrl,
        image,
        numberOfAccommodationUnits: s.units,
        address: {
          '@type': 'PostalAddress',
          streetAddress: s.address.street,
          addressLocality: s.address.locality,
          addressRegion: s.address.region,
          addressCountry: 'KR',
        },
        amenityFeature: s.features.map((f) => ({ '@type': 'LocationFeatureSpecification', name: f })),
        accommodationFloorPlan: s.floorPlans.map((p) => ({
          '@type': 'FloorPlan',
          name: p.name,
          numberOfRooms: p.rooms,
          floorSize: { '@type': 'QuantitativeValue', value: p.area, unitCode: 'MTK' },
        })),
      },
      {
        '@type': 'RealEstateAgent',
        '@id': `${baseUrl}#agent`,
        name: '온시아 공인중개사',
        telephone: tel,
        url: baseUrl,
        address: { '@type': 'PostalAddress', addressCountry: 'KR' },
        taxID: '846-23-01501',
        areaServed: { '@type': 'City', name: s.address.locality },
        knowsAbout: seo.keywords,
      },
      {
        '@type': 'Place',
        '@id': `${baseUrl}#site`,
        name: `${name} 현장`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: s.address.street,
          addressLocality: s.address.locality,
          addressRegion: s.address.region,
          addressCountry: 'KR',
        },
        publicAccess: true,
      },
      {
        '@type': 'Place',
        '@id': `${baseUrl}#modelhouse`,
        name: `${name} 견본주택`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: s.modelhouse.street,
          addressLocality: s.modelhouse.locality,
          addressRegion: s.modelhouse.region,
          addressCountry: 'KR',
        },
        telephone: tel,
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}#faq`,
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.onsia.co.kr' },
          { '@type': 'ListItem', position: 2, name, item: baseUrl },
        ],
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

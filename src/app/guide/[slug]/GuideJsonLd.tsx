// /guide 글 상세 구조화 데이터 (Article + BreadcrumbList + FAQPage)
// - author/publisher는 루트 layout이 정의한 Organization @id를 참조 (중복 정의 금지)
// - FAQPage는 frontmatter faq가 있을 때만. 본문에도 동일 내용이 가시 렌더된다.

import type { GuidePost } from '@/lib/guide'

const SITE = 'https://www.onsia.city'
const ORG_REF = { '@id': `${SITE}/#organization` }

function absolute(url: string): string {
  return url.startsWith('http') ? url : `${SITE}${url.startsWith('/') ? '' : '/'}${url}`
}

export default function GuideJsonLd({ post, url }: { post: GuidePost; url: string }) {
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      image: absolute(post.coverImage ?? '/og-image.png'),
      inLanguage: 'ko-KR',
      keywords: post.keywords.join(', '),
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: ORG_REF,
      publisher: ORG_REF,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: SITE },
        { '@type': 'ListItem', position: 2, name: '분양·청약 가이드', item: `${SITE}/guide` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ]

  if (post.faq && post.faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: post.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  )
}

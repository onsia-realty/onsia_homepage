// /guide/<한글 slug> 글 상세
// middleware는 /guide/*에 rewrite를 걸지 않으므로 params.slug는 percent-encoded로 들어온다
// → decodeURIComponent 필수 (이미 디코드된 값이 와도 한글엔 %가 없어 안전)

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllGuidePosts, getGuidePostBySlug, getRelatedPosts } from '@/lib/guide'
import { guideMdxComponents, LandingCTA } from '@/components/guide/mdx-components'
import { guideHref } from '@/components/guide/GuideList'
import GuideJsonLd from './GuideJsonLd'

const SITE = 'https://www.onsia.city'

export const dynamicParams = false

export function generateStaticParams() {
  // raw(디코드된) slug를 반환해야 요청 시 Next가 디코드한 param과 매칭된다 (encode하면 404)
  return getAllGuidePosts().map((post) => ({ slug: post.slug }))
}

function decodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getGuidePostBySlug(decodeSlug(slug))
  if (!post) return {}

  const url = `${SITE}/guide/${encodeURIComponent(post.slug)}`
  const image = post.coverImage ?? '/og-image.png'

  return {
    // 루트 layout의 title.template("%s | 온시아(ONSIA)")이 접미사를 붙인다 → 여기서 중복 표기 금지
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: '온시아(ONSIA)',
      locale: 'ko_KR',
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: image, alt: post.coverAlt ?? post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [image],
    },
  }
}

export default async function GuidePostPage({ params }: Props) {
  const { slug } = await params
  const post = getGuidePostBySlug(decodeSlug(slug))
  if (!post) notFound()

  const url = `${SITE}/guide/${encodeURIComponent(post.slug)}`
  const related = getRelatedPosts(post, 4)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <GuideJsonLd post={post} url={url} />

      <nav aria-label="현재 위치" className="mb-8 text-sm text-slate-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-white">
              홈
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link href="/guide" className="hover:text-white">
              분양 가이드
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="text-slate-200">{post.title}</li>
        </ol>
      </nav>

      <article>
        <header className="mb-10 border-b border-white/10 pb-8">
          <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
            {post.title}
          </h1>
          <p className="mb-5 leading-relaxed text-slate-300">{post.description}</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>
              발행 <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            </span>
            <span>
              수정 <time dateTime={post.updatedAt}>{post.updatedAt}</time>
            </span>
          </p>
        </header>

        <div>
          {/* blockJS:false — v6 기본값이 JSX 표현식 속성(FactBox items 등)을 제거함. 콘텐츠는 레포 내 신뢰 파일이고 blockDangerousJS는 기본 유지 */}
          <MDXRemote
            source={post.content}
            components={guideMdxComponents}
            options={{ blockJS: false }}
          />
        </div>

        {post.faq && post.faq.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-5 text-2xl font-bold text-white">자주 묻는 질문</h2>
            <dl className="space-y-5">
              {post.faq.map((item) => (
                <div key={item.q} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <dt className="mb-2 font-semibold text-white">{item.q}</dt>
                  <dd className="text-sm leading-[1.85] text-slate-300">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {post.sources && post.sources.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-4 text-xl font-bold text-white">참고 자료</h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-400 marker:text-slate-600">
              {post.sources.map((src) => (
                <li key={src}>
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-sky-300 underline underline-offset-4 hover:text-sky-200"
                  >
                    {src}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <LandingCTA project={post.project} />
      </article>

      {related.length > 0 && (
        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="mb-5 text-xl font-bold text-white">함께 읽으면 좋은 글</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={guideHref(item.slug)}
                  className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/25 hover:bg-white/10"
                >
                  <span className="mb-2 font-semibold leading-snug text-white">{item.title}</span>
                  <span className="text-sm leading-relaxed text-slate-400">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

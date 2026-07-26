// /guide 목록 화면(전체 / 페이지네이션 / 클러스터별)에서 공유하는 표시 조각들

import Link from 'next/link'
import { CLUSTERS, CLUSTER_LABELS, type Cluster, type GuidePost } from '@/lib/guide'

export function guideHref(slug: string): string {
  return `/guide/${encodeURIComponent(slug)}`
}

export function ClusterTabs({ active }: { active: Cluster | 'all' }) {
  const base = 'rounded-full border px-4 py-2 text-sm transition whitespace-nowrap'
  const on = 'border-white/60 bg-white text-slate-900 font-semibold'
  const off = 'border-white/15 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white'

  return (
    <nav aria-label="가이드 주제" className="mb-10 flex flex-wrap gap-2">
      <Link href="/guide" className={`${base} ${active === 'all' ? on : off}`}>
        전체
      </Link>
      {CLUSTERS.map((c) => (
        <Link key={c} href={`/guide/topic/${c}`} className={`${base} ${active === c ? on : off}`}>
          {CLUSTER_LABELS[c]}
        </Link>
      ))}
    </nav>
  )
}

export function GuideCardList({ posts }: { posts: GuidePost[] }) {
  if (posts.length === 0) {
    return <p className="py-12 text-slate-400">아직 등록된 글이 없습니다.</p>
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={guideHref(post.slug)}
            className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/25 hover:bg-white/10"
          >
            <span className="mb-2 text-xs font-medium text-sky-300">
              {CLUSTER_LABELS[post.cluster]}
            </span>
            <span className="mb-2 text-lg font-bold leading-snug text-white">{post.title}</span>
            <span className="mb-4 text-sm leading-relaxed text-slate-400">{post.description}</span>
            <time dateTime={post.publishedAt} className="mt-auto text-xs text-slate-500">
              {post.publishedAt}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function pageHref(n: number): string {
  return n <= 1 ? '/guide' : `/guide/page/${n}`
}

export function GuidePagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null

  const base = 'rounded-lg border px-3.5 py-2 text-sm transition'
  const on = 'border-white/60 bg-white text-slate-900 font-semibold'
  const off = 'border-white/15 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white'

  return (
    <nav aria-label="페이지 이동" className="mt-12 flex flex-wrap items-center gap-2">
      {page > 1 && (
        <Link href={pageHref(page - 1)} className={`${base} ${off}`}>
          이전
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={pageHref(n)}
          aria-current={n === page ? 'page' : undefined}
          className={`${base} ${n === page ? on : off}`}
        >
          {n}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={pageHref(page + 1)} className={`${base} ${off}`}>
          다음
        </Link>
      )}
    </nav>
  )
}

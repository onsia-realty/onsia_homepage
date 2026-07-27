// /guide/page/2 이후 목록 페이지 (1페이지는 /guide)

import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getAllGuidePosts, GUIDE_PAGE_SIZE } from '@/lib/guide'
import { ClusterTabs, GuideCardList, GuidePagination } from '@/components/guide/GuideList'

export const dynamicParams = false

function totalPages(): number {
  return Math.max(1, Math.ceil(getAllGuidePosts().length / GUIDE_PAGE_SIZE))
}

export function generateStaticParams() {
  // 2페이지부터만 생성. 글이 20개 이하면 빈 배열(= 생성되는 경로 없음)
  const total = totalPages()
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ n: String(i + 2) }))
}

type Props = { params: Promise<{ n: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params
  const page = Number(n)
  if (!Number.isInteger(page) || page < 2) return {}

  return {
    title: `분양·청약 가이드 (${page}페이지)`,
    description: `온시아 분양·청약 가이드 글 목록 ${page}페이지입니다. 분양가·청약 가점·교통 계획 등 주제별 정리 글을 모았습니다.`,
    alternates: { canonical: `https://www.onsia.city/guide/page/${page}` },
  }
}

export default async function GuidePagedPage({ params }: Props) {
  const { n } = await params
  const page = Number(n)

  if (page === 1) redirect('/guide')

  const total = totalPages()
  if (!Number.isInteger(page) || page < 1 || page > total) notFound()

  const posts = getAllGuidePosts().slice((page - 1) * GUIDE_PAGE_SIZE, page * GUIDE_PAGE_SIZE)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          분양·청약 가이드 <span className="text-slate-400">({page}페이지)</span>
        </h1>
      </header>

      <ClusterTabs active="all" />
      <GuideCardList posts={posts} />
      <GuidePagination page={page} totalPages={total} />
    </div>
  )
}

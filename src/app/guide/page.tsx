// /guide 목록 1페이지

import type { Metadata } from 'next'
import { getAllGuidePosts, GUIDE_PAGE_SIZE } from '@/lib/guide'
import { ClusterTabs, GuideCardList, GuidePagination } from '@/components/guide/GuideList'

const DESCRIPTION =
  '분양가·청약 가점·교통 계획까지, 아파트 분양을 결정하기 전에 확인해야 할 정보를 주제별로 정리한 온시아 가이드입니다.'

export const metadata: Metadata = {
  title: '분양·청약 가이드',
  description: DESCRIPTION,
  alternates: { canonical: 'https://www.onsia.city/guide' },
}

export default function GuideIndexPage() {
  const posts = getAllGuidePosts()
  const totalPages = Math.max(1, Math.ceil(posts.length / GUIDE_PAGE_SIZE))

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">분양·청약 가이드</h1>
        <p className="max-w-2xl leading-relaxed text-slate-300">{DESCRIPTION}</p>
      </header>

      <ClusterTabs active="all" />
      <GuideCardList posts={posts.slice(0, GUIDE_PAGE_SIZE)} />
      <GuidePagination page={1} totalPages={totalPages} />
    </div>
  )
}

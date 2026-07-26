// /guide/topic/<cluster> 클러스터별 목록 (URL 키는 영문 cluster 값)

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CLUSTERS, CLUSTER_LABELS, getAllGuidePosts, type Cluster } from '@/lib/guide'
import { ClusterTabs, GuideCardList } from '@/components/guide/GuideList'

export const dynamicParams = false

export function generateStaticParams() {
  return CLUSTERS.map((cluster) => ({ cluster }))
}

function toCluster(value: string): Cluster | undefined {
  return (CLUSTERS as readonly string[]).includes(value) ? (value as Cluster) : undefined
}

type Props = { params: Promise<{ cluster: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cluster: raw } = await params
  const cluster = toCluster(raw)
  if (!cluster) return {}

  const label = CLUSTER_LABELS[cluster]
  return {
    title: `${label} 가이드`,
    description: `${label} 관련 분양·청약 정보를 모은 온시아 가이드 글 목록입니다.`,
    alternates: { canonical: `https://www.onsia.city/guide/topic/${cluster}` },
  }
}

export default async function GuideTopicPage({ params }: Props) {
  const { cluster: raw } = await params
  const cluster = toCluster(raw)
  if (!cluster) notFound()

  const label = CLUSTER_LABELS[cluster]
  const posts = getAllGuidePosts().filter((post) => post.cluster === cluster)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">{label} 가이드</h1>
        <p className="max-w-2xl leading-relaxed text-slate-300">
          {label} 관련 분양·청약 정보를 모은 글 목록입니다.
        </p>
      </header>

      <ClusterTabs active={cluster} />
      <GuideCardList posts={posts} />
    </div>
  )
}

import { Metadata } from 'next'
import Link from 'next/link'
import { getLandingPages } from '@/lib/supabase-landing'

export const metadata: Metadata = {
  title: '분양 홈페이지 | ONSIA',
  description: '분양 현장별 홈페이지 모음. 관심고객 등록 및 분양 상담.',
}

export const revalidate = 3600

export default async function HomepageListPage() {
  const pages = await getLandingPages()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900">
      {/* 헤더 */}
      <div className="pt-32 pb-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            분양 홈페이지
          </h1>
          <p className="text-gray-400 text-lg">
            분양 현장별 홈페이지를 확인하세요
          </p>
        </div>
      </div>

      {/* 카드 목록 */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {pages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">등록된 홈페이지가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/${page.slug}`}
                className="group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                {/* 히어로 이미지 */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-800">
                  {page.hero_image ? (
                    <img
                      src={page.hero_image}
                      alt={page.project_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-600 text-4xl font-bold">
                        {page.project_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* 오버레이 그라디언트 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* 로고 */}
                  {page.logo_image && (
                    <img
                      src={page.logo_image}
                      alt=""
                      className="absolute top-3 right-3 h-8 w-auto object-contain drop-shadow-lg"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* 정보 */}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                    {page.project_name}
                  </h2>
                  {page.subtitle && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-1">
                      {page.subtitle}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {page.location && (
                      <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {page.location.split(' ').slice(0, 3).join(' ')}
                      </span>
                    )}
                    {page.developer && (
                      <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 line-clamp-1">
                        {page.developer.length > 20 ? page.developer.slice(0, 20) + '...' : page.developer}
                      </span>
                    )}
                    {page.phone_number && (
                      <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
                        {page.phone_number}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import type { BusinessInfo } from '@/lib/supabase-landing'

interface Props {
  businessInfo: BusinessInfo | null
  primaryColor: string
  accentColor: string
  /** anchor id (PC=pc-location, mobile=section-location) */
  id?: string
  /** 컴팩트 모드: 모바일 메인 페이지용 (작은 padding) */
  compact?: boolean
}

const NaverIcon = () => (
  <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-sm bg-[#03C75A] text-white text-[12px] font-extrabold">
    N
  </span>
)

const KakaoIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.86 1.86 5.36 4.66 6.78l-1.18 4.32a.5.5 0 0 0 .78.55L11.5 19.4c.16.01.33.02.5.02 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
  </svg>
)

export default function LocationSection({
  businessInfo,
  primaryColor,
  accentColor,
  id = 'section-location',
  compact = false,
}: Props) {
  if (!businessInfo) return null
  const {
    location_image,
    modelhouse_address,
    modelhouse_naver_url,
    modelhouse_kakao_url,
    site_address,
    site_naver_url,
    site_kakao_url,
  } = businessInfo

  const hasModelhouse = modelhouse_address || modelhouse_naver_url || modelhouse_kakao_url
  const hasSite = site_address || site_naver_url || site_kakao_url
  if (!hasModelhouse && !hasSite && !location_image) return null

  return (
    <section
      id={id}
      className={`${compact ? 'py-8 px-4' : 'py-16 px-6'}`}
      style={{ backgroundColor: primaryColor }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className={`text-center font-bold text-white mb-${compact ? '6' : '10'} ${
            compact ? 'text-2xl' : 'text-3xl md:text-4xl'
          }`}
        >
          오시는길
        </h2>

        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${compact ? 'p-4' : 'p-6 md:p-10'}`}>
          <div className={`grid ${compact ? 'gap-4' : 'gap-6 md:grid-cols-2 md:gap-10'}`}>
            {/* 좌측: 지도 이미지 */}
            {location_image && (
              <div className="rounded-xl overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={location_image}
                  alt="오시는길 약도"
                  className="w-full block"
                  loading="lazy"
                />
              </div>
            )}

            {/* 우측: 견본주택 + 현장 */}
            <div className={`flex flex-col ${compact ? 'gap-4' : 'gap-6 md:gap-8'} justify-center`}>
              {hasModelhouse && (
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-bold" style={{ color: primaryColor }}>
                      견본주택
                    </h3>
                    {modelhouse_address && (
                      <p className="text-sm md:text-[15px] text-gray-700 leading-snug">
                        {modelhouse_address}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {modelhouse_naver_url && (
                      <a
                        href={modelhouse_naver_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-md bg-gray-900 text-white text-sm md:text-[15px] font-semibold hover:bg-gray-800 transition-colors"
                      >
                        <NaverIcon />
                        네이버 지도 보기
                      </a>
                    )}
                    {modelhouse_kakao_url && (
                      <a
                        href={modelhouse_kakao_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-md bg-[#FEE500] text-gray-900 text-sm md:text-[15px] font-semibold hover:brightness-95 transition-all"
                      >
                        <KakaoIcon />
                        카카오 지도 보기
                      </a>
                    )}
                  </div>
                </div>
              )}

              {hasSite && (
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-bold" style={{ color: primaryColor }}>
                      현장
                    </h3>
                    {site_address && (
                      <p className="text-sm md:text-[15px] text-gray-700 leading-snug">
                        {site_address}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {site_naver_url && (
                      <a
                        href={site_naver_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-md bg-gray-900 text-white text-sm md:text-[15px] font-semibold hover:bg-gray-800 transition-colors"
                      >
                        <NaverIcon />
                        네이버 지도 보기
                      </a>
                    )}
                    {site_kakao_url && (
                      <a
                        href={site_kakao_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-md bg-[#FEE500] text-gray-900 text-sm md:text-[15px] font-semibold hover:brightness-95 transition-all"
                        style={{ outlineColor: accentColor }}
                      >
                        <KakaoIcon />
                        카카오 지도 보기
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

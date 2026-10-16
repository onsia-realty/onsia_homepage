// 오시는길 — 기존 LocationSection(primary 배경 + 흰 카드)과 같은 레이아웃. 내용은 config.location.
// 네이버/카카오 지도 링크를 현장·견본주택별로 노출.
import type { TplSiteConfig } from '@/landing-sites/types'

interface Props {
  location: TplSiteConfig['location']
  primaryColor: string
  pc?: boolean
  id?: string
}

function MapLinks({ naver, kakao }: { naver?: string; kakao?: string }) {
  if (!naver && !kakao) return null
  return (
    <div className="mt-2 flex gap-2">
      {naver && (
        <a href={naver} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center px-3 py-2.5 rounded-md bg-[#03C75A] text-white text-sm md:text-[15px] font-semibold hover:brightness-95 transition-all">
          네이버 지도
        </a>
      )}
      {kakao && (
        <a href={kakao} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center px-3 py-2.5 rounded-md bg-[#FEE500] text-gray-900 text-sm md:text-[15px] font-semibold hover:brightness-95 transition-all">
          카카오 지도
        </a>
      )}
    </div>
  )
}

export default function TplLocation({ location: l, primaryColor, pc = false, id }: Props) {
  return (
    <section id={id} className={pc ? 'py-16 px-6' : 'py-8 px-4'} style={{ backgroundColor: primaryColor }}>
      <div className="max-w-5xl mx-auto">
        <h2 className={`text-center font-bold text-white ${pc ? 'mb-10 text-3xl md:text-4xl' : 'mb-6 text-2xl'}`}>오시는길</h2>
        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${pc ? 'p-6 md:p-10' : 'p-4'}`}>
          <div className={`grid ${pc ? 'gap-6 md:grid-cols-2 md:gap-10' : 'gap-4'}`}>
            {l.image && (
              <div className="rounded-xl overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.image} alt={l.imageAlt || '오시는길 약도'} className="w-full block" loading="lazy" />
              </div>
            )}
            <div className={`flex flex-col ${pc ? 'gap-6 md:gap-8' : 'gap-4'} justify-center`}>
              <div>
                <h3 className="text-base md:text-xl font-bold mb-1" style={{ color: primaryColor }}>견본주택</h3>
                <p className="text-sm md:text-[15px] text-gray-700 leading-snug">{l.modelhouseAddress}</p>
                <MapLinks naver={l.modelhouseNaverUrl} kakao={l.modelhouseKakaoUrl} />
              </div>
              <div>
                <h3 className="text-base md:text-xl font-bold mb-1" style={{ color: primaryColor }}>현장</h3>
                <p className="text-sm md:text-[15px] text-gray-700 leading-snug">{l.siteAddress}</p>
                <MapLinks naver={l.siteNaverUrl} kakao={l.siteKakaoUrl} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

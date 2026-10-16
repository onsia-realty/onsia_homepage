// 분양 조건·혜택 체크리스트 + 프리미엄 카드 그리드
// 카드 스타일은 야목 "MORE INFO" 카테고리 그리드(다크 그라디언트 + 골드 아이콘 링)를 그대로 가져옴.
// 야목은 카테고리 서브페이지 링크였지만 템플릿은 서브페이지가 없어 콘텐츠 카드(프리미엄 포인트)로 대체.
import Reveal from '../Reveal'
import type { TplSiteConfig } from '@/landing-sites/types'

const GOLD = '#C9A96E'
const GRAD = 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #4338CA 100%)'

interface Props {
  benefits: TplSiteConfig['benefits']
  premium: TplSiteConfig['premium']
  pc?: boolean
  id?: string
}

export default function TplBenefits({ benefits, premium, pc = false, id }: Props) {
  return (
    <>
      {/* 혜택 체크리스트 */}
      <Reveal enabled>
        <section id={id} className={pc ? 'py-16 px-8 bg-white' : 'py-8 sm:py-10 px-3 sm:px-4 bg-white'}>
          <div className={pc ? 'max-w-[1100px] mx-auto' : ''}>
            <div className="rounded-2xl overflow-hidden shadow-xl relative" style={{ background: GRAD }}>
              <span aria-hidden className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-40 pointer-events-none" style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }} />
              <div className={`relative ${pc ? 'px-12 py-10' : 'px-5 py-6'}`}>
                <p className={`font-bold tracking-[0.25em] ${pc ? 'text-[13px] mb-2' : 'text-[11px] mb-1.5'}`} style={{ color: GOLD }}>{benefits.kicker}</p>
                <p className={`text-white font-extrabold leading-tight ${pc ? 'text-4xl mb-7' : 'text-2xl mb-4'}`}>{benefits.title}</p>
                <ul className={`grid ${pc ? 'grid-cols-3 gap-x-8 gap-y-3.5' : 'grid-cols-1 sm:grid-cols-2 gap-2.5'}`}>
                  {benefits.items.map((b) => (
                    <li key={b} className={`flex items-start gap-2.5 text-white ${pc ? 'text-[17px]' : 'text-[14.5px]'} font-semibold leading-snug`}>
                      <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-1 ring-white/25" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 프리미엄 카드 */}
      <section className={pc ? 'pb-16 px-8 bg-white' : 'pb-8 sm:pb-10 px-3 sm:px-4 bg-white'}>
        <div className={pc ? 'max-w-[1100px] mx-auto' : ''}>
          <h2 className="text-center text-[12px] sm:text-[13px] font-bold tracking-[0.25em] mb-1.5" style={{ color: GOLD }}>
            {premium.kicker}
          </h2>
          <p className={`text-center font-extrabold text-gray-900 ${pc ? 'text-3xl mb-8' : 'text-xl sm:text-2xl mb-6'}`}>{premium.title}</p>
          <div className={pc ? 'grid grid-cols-3 gap-5' : 'space-y-3 sm:space-y-3.5'}>
            {premium.items.map((item, ci) => (
              <Reveal enabled delay={ci * 90} key={item.title}>
                <div className="h-full rounded-2xl overflow-hidden shadow-xl relative" style={{ background: GRAD }}>
                  <div className={`relative ${pc ? 'px-7 py-7' : 'px-5 sm:px-6 py-5 sm:py-6'} flex items-start gap-4`}>
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20 font-black text-[18px]" style={{ color: GOLD }}>
                      {String(ci + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-white font-extrabold leading-tight ${pc ? 'text-[20px]' : 'text-[18px] sm:text-[20px]'}`}>{item.title}</p>
                      <p className={`text-white/70 mt-1.5 leading-relaxed ${pc ? 'text-[14px]' : 'text-[13px] sm:text-[14px]'}`}>{item.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

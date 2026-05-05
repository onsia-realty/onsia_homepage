// 야목역 그랜드힐 agent 페이지 전용 VR CTA
// - hero: 영상 1번 자리(상단)에 들어가는 큰 다크 그라디언트 단일 박스 → /yamok-grandhill/vr
// - cards: 영상 2번 자리(하단)에 들어가는 59A/84B 두 카드 그리드 → 직접 VR 새 탭

interface Props {
  variant: 'hero' | 'cards'
  /** PC면 max-w 1100, mobile은 풀 폭에 가깝게 */
  pc?: boolean
}

const VRS = [
  {
    label: '59A',
    area: '전용 59㎡A타입',
    thumb: '/uploads/landing/yamok/unitplan_59a.png',
    href: '/vr/yamok/S59A.html',
  },
  {
    label: '84B',
    area: '전용 84㎡B타입',
    thumb: '/uploads/landing/yamok/unitplan_84b.png',
    href: '/vr/yamok/S84B.html',
  },
]

export default function YamokAgentVrCta({ variant, pc = false }: Props) {
  if (variant === 'hero') {
    return (
      <section className={pc ? 'py-10 px-8 bg-white' : 'py-5 sm:py-6 px-3 sm:px-4 bg-white'}>
        <div className={pc ? 'max-w-[1100px] mx-auto' : ''}>
          <a
            href="/yamok-grandhill/vr"
            className={`block rounded-${pc ? '3xl' : '2xl'} overflow-hidden shadow-${pc ? '2xl' : 'lg'} active:opacity-95 hover:shadow-[0_25px_60px_rgba(67,56,202,0.35)] transition-all duration-300 relative group`}
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #4338CA 100%)',
            }}
          >
            <span
              aria-hidden
              className={`absolute top-0 right-0 ${pc ? 'w-[420px] h-[420px]' : 'w-40 h-40'} rounded-full blur-3xl opacity-${pc ? '30' : '40'} pointer-events-none`}
              style={{ background: 'radial-gradient(circle, #C9A96E 0%, transparent 70%)' }}
            />
            <div className={`relative ${pc ? 'px-12 py-10' : 'px-5 sm:px-6 py-6 sm:py-7'} flex items-center ${pc ? 'gap-10' : 'gap-4 sm:gap-5'}`}>
              <div className={`flex-shrink-0 ${pc ? 'w-28 h-28' : 'w-16 h-16'} rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={pc ? 'w-14 h-14' : 'w-8 h-8'} viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth={pc ? '1.8' : '2'} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
                  <ellipse cx="12" cy="12" rx="9" ry="3" />
                  <path d="M3 12v5c0 1.66 4.03 3 9 3s9-1.34 9-3v-5" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`${pc ? 'text-[14px] tracking-[0.28em] mb-2' : 'text-[12px] sm:text-[13px] tracking-[0.22em] mb-1.5'} font-bold`} style={{ color: '#C9A96E' }}>
                  360° E-MODEL HOUSE
                </p>
                <p className={`text-white font-extrabold leading-tight mb-${pc ? '2' : '0'} ${pc ? 'text-4xl' : 'text-2xl sm:text-[26px]'}`}>
                  E-모델하우스 보러가기
                </p>
                <p className={`text-white/${pc ? '75' : '75'} ${pc ? 'text-lg' : 'text-[14px] sm:text-[15px] mt-1.5'}`}>
                  59㎡A · 84㎡B 두 타입 360° VR 둘러보기
                </p>
              </div>
              {pc ? (
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-[16px] transition-all group-hover:translate-x-1"
                    style={{ backgroundColor: '#C9A96E', color: '#0F172A' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    VR 입장하기
                  </span>
                  <span className="text-white/50 text-[12px] tracking-wide">VIEW NOW</span>
                </div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </div>
          </a>
        </div>
      </section>
    )
  }

  // variant === 'cards'
  return (
    <section className={pc ? 'py-12 px-8 bg-white' : 'py-8 sm:py-10 px-4 bg-white'}>
      <div className={pc ? 'max-w-[1100px] mx-auto' : 'max-w-lg mx-auto'}>
        <h2 className="text-center text-[12px] sm:text-[13px] font-bold tracking-[0.25em] mb-1.5" style={{ color: '#C9A96E' }}>
          UNIT VR
        </h2>
        <p className={`text-center font-extrabold mb-6 sm:mb-7 text-gray-900 ${pc ? 'text-2xl' : 'text-xl sm:text-2xl'}`}>
          타입별 직접 입장하기
        </p>
        <div className={`grid gap-4 sm:gap-5 ${pc ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {VRS.map((v) => (
            <a
              key={v.label}
              href={v.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative bg-gray-50 aspect-[4/3] overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.thumb}
                  alt={`야목역 서희스타힐스 그랜드힐 ${v.label} 타입 360° VR 평면도`}
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span
                  className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] md:text-[12px] font-bold text-white"
                  style={{ backgroundColor: '#0F172A' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
                    <ellipse cx="12" cy="12" rx="9" ry="3" />
                  </svg>
                  360° VR
                </span>
              </div>
              <div className="p-4 md:p-5">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-white text-xs md:text-sm mr-2 align-middle" style={{ backgroundColor: '#0F172A' }}>
                      TYPE
                    </span>
                    {v.label}
                  </h3>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
                <p className="text-[13px] md:text-[14px] text-gray-500">{v.area}</p>
              </div>
            </a>
          ))}
        </div>
        <p className="mt-5 sm:mt-6 text-center text-[12px] text-gray-400">
          ※ VR 콘텐츠는 새 탭에서 열립니다
        </p>
      </div>
    </section>
  )
}

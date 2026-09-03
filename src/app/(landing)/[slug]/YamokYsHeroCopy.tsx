// 야목역서희스타힐스 윤상(?a=ys) 전용 히어로 카피 오버레이
// 광고 심사(토스)용으로 "4억원대" 문구가 HTML 텍스트 노드로 존재해야 해서 배경 이미지 대신 코드로 얹는다.
// heading 태그(h1~h6) 사용 금지: PC/모바일 히어로에 이미 h1이 있어 중복되면 SEO 구조가 깨짐.

const PILL_COLOR = '#1E3A5F'
const TEXT_SHADOW = '0 2px 14px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.45)'

export default function YamokYsHeroCopy({ variant }: { variant: 'pc' | 'mobile' }) {
  const isPc = variant === 'pc'

  return (
    <div
      className={`pointer-events-none select-none absolute inset-x-0 z-10 flex flex-col items-center text-center px-4 bg-gradient-to-b from-black/35 via-black/10 to-transparent ${
        // PC는 h-[90px] fixed 헤더가 상단을 덮으므로 그 아래에서 시작해야 첫 줄이 안 가림
        isPc ? 'top-0 pt-[calc(90px+2.5vh)] pb-[12vh]' : 'top-0 pt-[7%] pb-[14%]'
      }`}
    >
      <p
        className={`text-white font-semibold leading-tight tracking-[0.08em] m-0 ${
          isPc ? 'text-[2vw]' : 'text-[3.4vw] sm:text-base md:text-lg'
        }`}
        style={{ textShadow: TEXT_SHADOW }}
      >
        화성 비봉 · 야목역 더블역세권
      </p>

      <p
        className={`text-white font-black leading-none tracking-tight m-0 ${
          isPc ? 'text-[5vw] mt-[0.6vw]' : 'text-[9vw] sm:text-5xl md:text-6xl mt-1'
        }`}
        style={{ textShadow: '0 4px 22px rgba(0,0,0,0.6), 0 2px 5px rgba(0,0,0,0.5)' }}
      >
        4억원대 시작
      </p>

      <span
        className={`inline-block rounded-full text-white font-semibold leading-none ${
          isPc
            ? 'text-[1.8vw] mt-[1.8vw] px-[2.4vw] py-[1vw]'
            : 'text-[3.4vw] sm:text-base mt-3 px-5 py-2.5'
        }`}
        style={{ backgroundColor: PILL_COLOR, boxShadow: '0 6px 20px rgba(0,0,0,0.35)' }}
      >
        더블역세권 프리미엄
      </span>
    </div>
  )
}

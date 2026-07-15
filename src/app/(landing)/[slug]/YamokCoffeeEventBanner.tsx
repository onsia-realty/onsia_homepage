'use client'

// 야목역 관심고객 등록 페이지 — 스타벅스 기프티콘 사은품 배너
// 네이버 이미지형 서브링크(커피 사은품) 랜딩 소재와 페이지 내용 일치용
export default function YamokCoffeeEventBanner() {
  const scrollToForm = () => {
    document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="mb-8 lg:mb-10 rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: '#2E6B52' }}>
      <div className="px-5 pt-7 pb-6 lg:px-10 lg:pt-9 lg:pb-8 text-center">
        {/* 배지 */}
        <span className="inline-block px-4 py-1.5 rounded-full text-[12px] lg:text-[13px] font-bold tracking-wide text-white" style={{ backgroundColor: '#1E3932' }}>
          야목역 서희스타힐스 그랜드힐
        </span>

        {/* 타이틀 */}
        <h2 className="mt-4 text-[24px] lg:text-[34px] font-extrabold leading-snug text-white">
          방문 상담 완료 시
          <br />
          <span style={{ color: '#FFD54F' }}>스타벅스 기프티콘</span> 증정
        </h2>
        <p className="mt-3 text-[13px] lg:text-[15px] leading-relaxed text-white/85">
          관심고객 등록 후 견본주택 방문 상담을 완료하시면
          <br className="lg:hidden" />
          {' '}커피 기프티콘을 드립니다.
        </p>

        {/* 일러스트 */}
        <div className="mt-5 lg:mt-6 max-w-[340px] mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uploads/landing/yamok/coffee-gift.png"
            alt="야목역 서희스타힐스 그랜드힐 방문 상담 스타벅스 기프티콘 증정 이벤트"
            className="w-full block rounded-xl"
          />
        </div>

        {/* 리본 */}
        <div className="mt-6 flex justify-center">
          <span
            className="inline-block px-6 py-2 text-[15px] lg:text-[17px] font-extrabold text-white"
            style={{
              backgroundColor: '#1E3932',
              clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0 50%)',
            }}
          >
            특별 혜택 제공!
          </span>
        </div>
        <p className="mt-3 text-[14px] lg:text-[16px] font-semibold text-white">
          아래에 등록하고 방문 예약 시 혜택을 받아가세요.
        </p>

        {/* CTA */}
        <button
          type="button"
          onClick={scrollToForm}
          className="mt-4 w-full max-w-[420px] mx-auto block py-4 rounded-xl text-[17px] lg:text-[18px] font-extrabold text-gray-900 shadow-md active:opacity-80 hover:brightness-95 transition-all"
          style={{ backgroundColor: '#FFD54F' }}
        >
          관심고객 등록하고 혜택 받기
        </button>

        <p className="mt-4 text-[11px] lg:text-[12px] leading-relaxed text-white/60">
          ※ 사은품은 방문 상담 완료 고객에 한해 지급되며, 현장 사정에 따라 조기 종료될 수 있습니다.
        </p>
      </div>
    </div>
  )
}

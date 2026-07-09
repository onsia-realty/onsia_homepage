// 어반홈스 메인 랜딩 키비주 밴드 — 리모델링된 공식 사이트 카피 이식 (2026-06-24)
// 실입주금 6천만원대 / 월세보다 저렴하게 내집마련 / 최초 분양가 대비 할인

export default function UrbanhomesKeyVisual() {
  return (
    <section
      className="px-4 py-10 sm:py-12 lg:py-16 text-center text-white"
      style={{ background: 'linear-gradient(135deg, #0F2238 0%, #1E3A5F 55%, #24486F 100%)' }}
    >
      <div className="max-w-[920px] mx-auto">
        {/* 입지 태그라인 */}
        <p className="text-[13px] sm:text-sm lg:text-base font-medium tracking-[0.18em] text-[#C9A96E] mb-4 sm:mb-5">
          교통의 중심 · 왕십리역 초역세권
        </p>

        {/* 메인 카피 */}
        <h2 className="font-extrabold leading-tight mb-2 sm:mb-3">
          <span className="block text-[28px] sm:text-4xl lg:text-5xl">
            실입주금 <span className="text-[#E7C792]">6천만원대</span>
          </span>
        </h2>
        <p className="text-[17px] sm:text-2xl lg:text-3xl font-bold leading-snug mb-7 sm:mb-9">
          월세보다 저렴하게, <span className="whitespace-nowrap">내 집 마련</span>
        </p>

        {/* 할인 하이라이트 */}
        <div className="inline-block rounded-2xl bg-white/8 ring-1 ring-white/15 px-5 sm:px-8 py-5 sm:py-6 backdrop-blur-sm">
          <p className="text-sm sm:text-lg font-bold text-[#E7C792] mb-3 sm:mb-4">
            최초 분양가 대비 <span className="whitespace-nowrap">8,500만원 ~ 1억원 이상 할인</span>
          </p>
          <div className="space-y-1.5 sm:space-y-2 text-[13px] sm:text-base">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-white/45 line-through">699,560,000</span>
              <span className="text-[#C9A96E]">→</span>
              <span className="font-extrabold text-white">599,370,000</span>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-white/45 line-through">672,600,000</span>
              <span className="text-[#C9A96E]">→</span>
              <span className="font-extrabold text-white">586,860,000</span>
            </div>
          </div>
        </div>

        <p className="mt-5 sm:mt-6 text-[11px] sm:text-xs text-white/45 leading-relaxed">
          ※ 상기 금액은 동·호수·타입에 따라 상이하며, 잔여 세대 소진 시 변동될 수 있습니다.
        </p>
      </div>
    </section>
  )
}

'use client'

import { useFraudGate } from './FraudGateContext'

interface Props {
  phone: string
  agentName?: string
}

export default function CallBanner({ phone, agentName }: Props) {
  // agent 있으면: "010" + "3992-1510" / 없으면: "대표번호" + "1668-5257"
  const isAgent = !!agentName
  const displayNumber = isAgent ? phone.replace(/^010-?/, '') : phone

  const { reportClick, tier, enabled } = useFraudGate()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 부정클릭 게이트 비활성 → 기존 동작 100% 유지
    if (!enabled) return

    // 이미 차단 상태 → 통화 차단
    if (tier === 'block') {
      e.preventDefault()
      return
    }

    // 광고 클릭으로 보고 (서버에서 fraud 판정 후 응답)
    reportClick('cta_click', { targetText: '전화상담', targetUrl: `tel:${phone}` }).catch(() => {})
  }

  return (
    <a href={`tel:${phone}`} className="call-banner block w-full" onClick={handleClick}>
      <div className="py-4 sm:py-5 px-4 text-center max-w-4xl lg:mx-auto">
        {isAgent ? (
          <>
            <span className="call-banner-number font-black text-[15vw] sm:text-[12vw] md:text-[9vw] leading-none tracking-tight block lg:hidden">
              010
            </span>
            <span className="call-banner-number font-black text-[15vw] sm:text-[12vw] md:text-[9vw] leading-none tracking-tight block lg:hidden">
              {displayNumber}
            </span>
            <span className="call-banner-number font-black text-8xl leading-none tracking-tight hidden lg:block">
              {phone}
            </span>
          </>
        ) : (
          <>
            <span className="text-white font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide block mb-1">
              대표번호
            </span>
            <span className="call-banner-number font-black text-[15vw] sm:text-[12vw] md:text-[9vw] lg:text-7xl leading-none tracking-tight block">
              {phone}
            </span>
          </>
        )}
      </div>
      {/* Sparkle particles */}
      <div className="call-sparkles" aria-hidden="true">
        <span className="sparkle sparkle-1" />
        <span className="sparkle sparkle-2" />
        <span className="sparkle sparkle-3" />
        <span className="sparkle sparkle-4" />
        <span className="sparkle sparkle-5" />
      </div>
    </a>
  )
}

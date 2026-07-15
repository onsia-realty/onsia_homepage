// 야목역 서희스타힐스 — 관심고객 등록 폼 상단 스타벅스 기프티콘 증정 안내
// 등록 폼 섹션마다 이벤트를 상기시켜 전환 유도. coffee-gift.png(스타벅스 기프티콘 일러스트) 재활용.
export default function YamokInquiryGift() {
  return (
    <div className="max-w-[460px] mx-auto mb-6">
      <div className="rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: '#1E3932' }}>
        <div className="px-5 pt-5 pb-4 text-center">
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide text-white mb-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
          >
            EVENT · SPECIAL GIFT
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uploads/landing/yamok/coffee-gift.png"
            alt="야목역 서희스타힐스 그랜드힐 관심고객 등록 시 스타벅스 기프티콘 증정"
            className="w-full max-w-[300px] mx-auto rounded-xl"
          />
          <p className="mt-3 text-white font-bold text-[15px] lg:text-base leading-snug">
            관심고객 등록하고 방문 상담 시
            <br />
            <span style={{ color: '#FFD54F' }}>스타벅스 기프티콘 또는 고급 사은품 증정</span>
          </p>
        </div>
      </div>
    </div>
  )
}

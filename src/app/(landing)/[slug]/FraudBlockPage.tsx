'use client'

interface Props {
  reasons: string[]
}

export default function FraudBlockPage({ reasons }: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fraud-block-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-red-700/95 px-5 text-white"
    >
      <div className="w-full max-w-md text-center">
        <div className="mb-5 text-6xl" aria-hidden>
          🛑
        </div>

        <h1 id="fraud-block-title" className="mb-3 text-2xl font-extrabold sm:text-3xl">
          접근이 일시 차단되었습니다
        </h1>

        <p className="mb-5 text-sm leading-relaxed opacity-90 sm:text-base">
          비정상적인 클릭 패턴이 지속적으로 확인되어, 본 접속이 차단되었습니다.
          정상적인 문의는 아래 대표번호로 직접 연락 부탁드립니다.
        </p>

        {reasons.length > 0 && (
          <div className="mb-5 rounded-lg bg-white/15 px-4 py-3 text-left text-xs">
            <div className="mb-1 font-semibold">차단 사유</div>
            <ul className="list-disc space-y-0.5 pl-4 opacity-90">
              {reasons.slice(0, 3).map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        <a
          href="tel:1668-5257"
          className="block rounded-xl bg-white px-4 py-3 text-base font-bold text-red-700 transition hover:bg-red-50 sm:text-lg"
        >
          📞 1668-5257 대표번호 문의
        </a>

        <p className="mt-4 text-xs opacity-70">
          본 차단은 광고비 부정사용 방지를 위한 자동 조치이며,
          <br />
          30일 이내 정상 패턴 확인 시 자동 해제됩니다.
        </p>
      </div>
    </div>
  )
}

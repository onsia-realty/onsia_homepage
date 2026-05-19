'use client'

import { useState } from 'react'

interface Props {
  reasons: string[]
}

export default function FraudWarningModal({ reasons }: Props) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fraud-modal-title"
      className="fixed inset-0 z-[9995] flex items-center justify-center bg-black/60 px-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
        <div className="mb-4 flex items-center gap-3">
          <span aria-hidden className="text-3xl">⚠️</span>
          <h2 id="fraud-modal-title" className="text-lg font-bold text-gray-900 sm:text-xl">
            광고링크 반복 클릭이 감지되었습니다
          </h2>
        </div>

        <p className="mb-3 text-sm leading-relaxed text-gray-700 sm:text-[15px]">
          짧은 시간 안에 반복된 클릭/접속이 확인되어, 일시적으로 안내 메시지를 표시합니다.
          정상적인 문의는 그대로 진행하실 수 있습니다.
        </p>

        {reasons.length > 0 && (
          <div className="mb-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
            <div className="mb-1 font-semibold text-gray-700">감지 사유</div>
            <ul className="list-disc space-y-0.5 pl-4">
              {reasons.slice(0, 3).map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:text-base"
        >
          확인했습니다
        </button>

        <p className="mt-3 text-center text-xs text-gray-400">
          정상 사용자라면 이 안내는 곧 사라집니다.
        </p>
      </div>
    </div>
  )
}

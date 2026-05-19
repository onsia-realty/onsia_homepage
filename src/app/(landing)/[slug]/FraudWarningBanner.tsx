'use client'

import { useState } from 'react'

interface Props {
  reasons: string[]
}

export default function FraudWarningBanner({ reasons }: Props) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      role="alert"
      className="fixed top-0 left-0 right-0 z-[9990] bg-yellow-400 text-gray-900 shadow-md"
    >
      <div className="mx-auto flex max-w-5xl items-start gap-3 px-4 py-2.5 text-sm sm:text-[15px]">
        <span aria-hidden className="mt-0.5 text-base">⚠️</span>
        <div className="flex-1 leading-snug">
          <strong className="block sm:inline">비정상적인 클릭 패턴이 감지되었습니다.</strong>{' '}
          <span className="opacity-90">잠시 후 다시 시도해주세요. 거듭 클릭을 자제해주세요.</span>
          {reasons.length > 0 && (
            <span className="ml-1 hidden text-xs opacity-70 sm:inline">
              ({reasons.slice(0, 2).join(', ')})
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded px-2 py-0.5 text-lg leading-none hover:bg-yellow-500/30"
          aria-label="닫기"
        >
          ×
        </button>
      </div>
    </div>
  )
}

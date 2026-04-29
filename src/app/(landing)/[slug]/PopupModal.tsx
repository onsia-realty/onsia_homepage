'use client'

import { useState, useEffect } from 'react'

interface Props {
  imageUrl: string
  linkUrl?: string
  alt?: string
  storageKey?: string
  /** 이 키가 sessionStorage에 설정될 때까지 대기 (순차 팝업용) */
  waitForKey?: string
}

export default function PopupModal({ imageUrl, linkUrl, alt = '팝업', storageKey = 'popup-dismissed', waitForKey }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem(storageKey)
    if (dismissed) return

    if (!waitForKey) {
      setOpen(true)
      return
    }

    // waitForKey가 설정될 때까지 폴링
    const check = () => {
      if (sessionStorage.getItem(waitForKey)) {
        setOpen(true)
        return true
      }
      return false
    }

    if (check()) return

    const interval = setInterval(() => {
      if (check()) clearInterval(interval)
    }, 300)

    return () => clearInterval(interval)
  }, [storageKey, waitForKey])

  const handleClose = () => {
    setOpen(false)
    sessionStorage.setItem(storageKey, '1')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60" onClick={handleClose}>
      <div className="relative mx-4 max-w-sm" onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 font-bold text-lg leading-none"
        >
          &times;
        </button>

        {/* 팝업 이미지 (linkUrl 있으면 새창 링크, 없으면 단순 이미지) */}
        {linkUrl ? (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={alt}
              className="w-full rounded-lg shadow-2xl"
            />
          </a>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={alt}
            className="w-full rounded-lg shadow-2xl"
          />
        )}

        {/* 하단 닫기 */}
        <button
          onClick={handleClose}
          className="w-full mt-2 py-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'

interface Props {
  phone?: string
  accentColor: string
  primaryColor: string
}

export default function FloatingSidebar({ phone, accentColor, primaryColor }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToInquiry = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('inquiry-bottom')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      className={`hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 transition-all duration-500 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'
      }`}
    >
      {/* Inquiry CTA */}
      <button
        onClick={scrollToInquiry}
        className="group flex flex-col items-center justify-center w-16 h-20 rounded-xl shadow-lg transition-all hover:scale-105 hover:shadow-xl text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
        <span className="text-[10px] font-bold leading-tight text-center">관심고객<br />등록</span>
      </button>

      {/* Phone CTA */}
      {phone && (
        <a
          href={`tel:${phone}`}
          className="group flex flex-col items-center justify-center w-16 h-20 rounded-xl shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          style={{ backgroundColor: accentColor, color: primaryColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          <span className="text-[10px] font-bold leading-tight text-center">분양<br />문의</span>
        </a>
      )}

      {/* Top scroll */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex items-center justify-center w-16 h-10 rounded-xl bg-gray-800 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  )
}

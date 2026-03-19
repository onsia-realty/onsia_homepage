'use client'

import { useEffect, useState } from 'react'

interface Props {
  projectName: string
  logoImage?: string
  phone?: string
  primaryColor: string
  accentColor: string
}

const NAV_ITEMS = [
  { label: '사업안내', href: '#section-info' },
  { label: '프리미엄', href: '#section-premium' },
  { label: '갤러리', href: '#section-gallery' },
  { label: '관심고객 등록', href: '#inquiry-bottom' },
]

export default function PCNavBar({ projectName, logoImage, phone, primaryColor, accentColor }: Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          {logoImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoImage} alt={projectName} className="h-8" />
          ) : (
            <span className="text-lg font-bold" style={{ color: primaryColor }}>
              {projectName}
            </span>
          )}
        </div>

        {/* Center: Navigation Links */}
        <div className="flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => scrollTo(e, item.href)}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors relative group"
            >
              {item.label}
              <span
                className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: accentColor }}
              />
            </a>
          ))}
        </div>

        {/* Right: Phone */}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-opacity hover:opacity-80"
            style={{ backgroundColor: primaryColor, color: '#fff' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            {phone}
          </a>
        )}
      </div>
    </nav>
  )
}

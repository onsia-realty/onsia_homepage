// YamokFactStrip 복제 — 모바일 팩트 스트립 (CallBanner 아래 핵심 팩트 4종, 네이비+골드). 항목은 config.facts.
import Reveal from '../Reveal'
import CountUp from '../CountUp'
import type { TplFactIcon, TplSiteConfig } from '@/landing-sites/types'

const ICONS: Record<TplFactIcon, React.ReactNode> = {
  subway: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="13" rx="2" />
      <path d="M4 11h16M12 3v8M8 20l-2 2M16 20l2 2M8.5 16h.01M15.5 16h.01" />
    </svg>
  ),
  train: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14c0-4 3-7 9-7s9 3 9 7v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M9 7V5h6v2M7 17l-2 4M17 17l2 4M9 13h.01M15 13h.01" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v16M13 9h5a1 1 0 0 1 1 1v11" />
      <path d="M8 8h.01M8 12h.01M8 16h.01M16 13h.01M16 17h.01M3 21h18" />
    </svg>
  ),
  medal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14.5 8 22l4-2 4 2-1-7.5M12 7v4M10 9h4" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  lake: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 15c2 0 2-1.5 4-1.5S9 15 11 15s2-1.5 4-1.5 2 1.5 4 1.5M3 19c2 0 2-1.5 4-1.5S9 19 11 19s2-1.5 4-1.5 2 1.5 4 1.5" />
      <path d="M12 3v6M8 7l4-4 4 4" />
    </svg>
  ),
  parking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </svg>
  ),
}

interface Props {
  name: string
  facts: TplSiteConfig['facts']
}

export default function TplFactStrip({ name, facts }: Props) {
  return (
    <Reveal enabled>
      <section
        className="px-2 py-4 sm:py-5"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #1E1B4B 100%)' }}
        aria-label={`${name} 핵심 정보`}
      >
        <ul className="grid grid-cols-4 gap-0 max-w-2xl mx-auto">
          {facts.map((f, i) => (
            <li
              key={f.n}
              className={`flex flex-col items-center text-center px-1 ${i < facts.length - 1 ? 'border-r border-white/10' : ''}`}
            >
              <span className="w-6 h-6 sm:w-7 sm:h-7 mb-1.5" style={{ color: '#C9A96E' }}>
                {ICONS[f.icon]}
              </span>
              <span className="font-extrabold text-[14px] sm:text-[16px] leading-none" style={{ color: '#C9A96E' }}>
                {f.countTo ? <CountUp end={f.countTo} suffix={f.suffix} /> : f.n}
              </span>
              <span className="mt-1 text-[9.5px] sm:text-[11px] leading-tight text-white/75">{f.l}</span>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  )
}

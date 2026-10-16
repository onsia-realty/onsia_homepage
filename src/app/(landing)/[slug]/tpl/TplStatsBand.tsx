'use client'

// YamokStatsBand 복제 — PC 메인 핵심 스탯 밴드 (다크네이비+골드, 인뷰 CountUp). 숫자/라벨은 config.stats.
import CountUp from '../CountUp'
import type { TplSiteConfig } from '@/landing-sites/types'

const GOLD = '#C9A96E'
const GOLD_LIGHT = '#F5D78E'

interface Props {
  kicker: string
  stats: TplSiteConfig['stats']
}

export default function TplStatsBand({ kicker, stats }: Props) {
  return (
    <section
      className="relative overflow-hidden py-16 px-8"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 55%, #4338CA 100%)' }}
    >
      <span
        aria-hidden
        className="absolute -top-24 right-10 w-[420px] h-[420px] rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }}
      />
      <div className="relative max-w-[1200px] mx-auto">
        <p className="text-center text-[13px] font-bold tracking-[0.32em] mb-10" style={{ color: GOLD }}>
          {kicker}
        </p>
        <div className="grid grid-cols-4 divide-x divide-white/10">
          {stats.map((s, i) => (
            <div key={i} className="px-6 text-center">
              <p className="font-black leading-none tracking-tight text-5xl xl:text-6xl">
                {typeof s.value === 'number' ? (
                  <CountUp end={s.value} suffix={s.suffix} className="tabular-nums" style={{ color: GOLD_LIGHT }} />
                ) : (
                  <span style={{ color: GOLD_LIGHT }}>{s.value}{s.suffix}</span>
                )}
                {s.unit && (
                  <span className="text-2xl xl:text-3xl font-extrabold ml-1" style={{ color: GOLD_LIGHT }}>
                    {s.unit}
                  </span>
                )}
              </p>
              <p className="mt-4 text-white/70 text-[14px] leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

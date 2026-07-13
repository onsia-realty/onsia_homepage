'use client'

// 야목역 서희스타힐스 그랜드힐 — PC 메인 핵심 스탯 밴드 (히어로/콜배너 밑 임팩트)
// 다크네이비+골드. 숫자는 인뷰 시 CountUp. yamok 메인 전용(PCLanding에서 isYamok && !isAgent 가드).
import { type ReactNode } from 'react'
import CountUp from './CountUp'

const GOLD = '#C9A96E'
const GOLD_LIGHT = '#F5D78E'

interface Stat {
  value: ReactNode
  unit: string
  label: string
}

const STATS: Stat[] = [
  {
    value: <CountUp end={998} className="tabular-nums" style={{ color: GOLD_LIGHT }} />,
    unit: '세대',
    label: '비봉지구 브랜드 대단지',
  },
  {
    value: <CountUp end={3} className="tabular-nums" style={{ color: GOLD_LIGHT }} />,
    unit: '개 노선',
    label: '트리플 역세권 (수인분당 · KTX · GTX-F 예정)',
  },
  {
    value: <span style={{ color: GOLD_LIGHT }}>59·84</span>,
    unit: '㎡',
    label: '실속 전용면적 타입',
  },
  {
    value: <CountUp end={100} suffix="%" className="tabular-nums" style={{ color: GOLD_LIGHT }} />,
    unit: '',
    label: '남향 위주 판상형 설계',
  },
]

export default function YamokStatsBand() {
  return (
    <section
      className="relative overflow-hidden py-16 px-8"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 55%, #4338CA 100%)' }}
    >
      {/* 우상단 발광 */}
      <span
        aria-hidden
        className="absolute -top-24 right-10 w-[420px] h-[420px] rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }}
      />
      <div className="relative max-w-[1200px] mx-auto">
        <p className="text-center text-[13px] font-bold tracking-[0.32em] mb-10" style={{ color: GOLD }}>
          YAMOK SEOHEE STARHILLS · GRAND HILL
        </p>
        <div className="grid grid-cols-4 divide-x divide-white/10">
          {STATS.map((s, i) => (
            <div key={i} className="px-6 text-center">
              <p className="font-black leading-none tracking-tight text-5xl xl:text-6xl">
                {s.value}
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

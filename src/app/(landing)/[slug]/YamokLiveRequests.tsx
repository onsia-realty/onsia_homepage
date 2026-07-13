'use client'

// 야목역 서희스타힐스 그랜드힐 — 실시간 접수 현황 티커 (소셜프루프, 하이브리드)
// 마운트 시 /api/landing-inquiry/recent 로 실제 최근 접수(마스킹) 로드 → 부족분 랜덤 패딩.
// 이후 주기적으로 랜덤 접수 1건 prepend (활발한 느낌). 이름/연락처는 마스킹만 노출.
// 배치는 PCLanding/page.tsx에서 Reveal로 감싸 스크롤 진입 노출.
import { useEffect, useRef, useState } from 'react'

interface Row {
  id: number
  name: string // 마스킹된 성함 (예: 황**)
  phone: string // 010-****-****
  at: number // epoch ms
}

const SURNAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '류', '전', '홍', '고', '문', '양', '손', '배', '백', '허', '유', '남', '심', '노', '하', '곽', '성', '차', '주', '우', '구', '민']

let SEQ = 1

function randRow(atMs: number): Row {
  const s = SURNAMES[Math.floor(Math.random() * SURNAMES.length)]
  const masks = Math.random() < 0.5 ? '*' : '**'
  return { id: SEQ++, name: `${s}${masks}`, phone: '010-****-****', at: atMs }
}

function fmtAt(ms: number): string {
  const d = new Date(ms)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function fmtNow(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  const h = d.getHours()
  const ap = h < 12 ? '오전' : '오후'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${ap} ${h12}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

interface Props {
  pageId: string
}

export default function YamokLiveRequests({ pageId }: Props) {
  const [rows, setRows] = useState<Row[]>([])
  const [updated, setUpdated] = useState('')
  const seeded = useRef(false)

  // 초기 시드: 실제 최근 접수 + 랜덤 패딩(총 5건)
  useEffect(() => {
    if (seeded.current) return
    seeded.current = true
    const now = Date.now()
    // 우선 랜덤으로 즉시 채우고(빈 화면 방지), 실제 데이터 오면 병합
    const seedRandom = () => {
      const out: Row[] = []
      let t = now
      for (let i = 0; i < 5; i++) {
        t -= (2 + Math.floor(Math.random() * 6)) * 60_000 // 2~7분 간격
        out.push(randRow(t))
      }
      return out
    }
    setRows(seedRandom())
    setUpdated(fmtNow())

    fetch(`/api/landing-inquiry/recent?page_id=${encodeURIComponent(pageId)}&limit=5`)
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => {
        const items: { name?: string; phone?: string; at?: string }[] = Array.isArray(d?.items) ? d.items : []
        if (!items.length) return
        const real: Row[] = items
          .filter((x) => x?.name && x?.at)
          .map((x) => ({ id: SEQ++, name: x.name as string, phone: x.phone || '010-****-****', at: new Date(x.at as string).getTime() }))
        // 실제 + 랜덤 병합 후 최신순 5건
        setRows((prev) => [...real, ...prev].sort((a, b) => b.at - a.at).slice(0, 5))
      })
      .catch(() => {})
  }, [pageId])

  // 주기적으로 랜덤 접수 1건 추가 (7~12초)
  useEffect(() => {
    let alive = true
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      const delay = 7000 + Math.floor(Math.random() * 5000)
      timer = setTimeout(() => {
        if (!alive) return
        setRows((prev) => [randRow(Date.now()), ...prev].slice(0, 5))
        setUpdated(fmtNow())
        tick()
      }, delay)
    }
    tick()
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="max-w-[560px] mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
      {/* 헤더 */}
      <div className="px-5 py-4 text-white" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #4338CA 100%)' }}>
        <div className="flex items-center justify-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <h3 className="font-extrabold text-[17px] tracking-tight">실시간 접수 현황</h3>
        </div>
        <p className="text-center text-[12px] text-white/70 mt-1">최근 상담 신청 내역입니다</p>
      </div>

      {/* 표 헤더 */}
      <div className="flex items-center px-5 py-2.5 bg-gray-50 border-b border-gray-200 text-[12px] font-bold text-gray-500">
        <div className="flex-1">이름</div>
        <div className="flex-1 text-center">연락처</div>
        <div className="flex-1 text-right">접수일시</div>
      </div>

      {/* 리스트 */}
      <div>
        {rows.map((r, i) => (
          <div
            key={r.id}
            className={`request-enter flex items-center px-5 py-3 text-[13.5px] border-b border-gray-100 ${i === 0 ? 'bg-amber-50' : ''}`}
          >
            <div className="flex-1 font-bold text-gray-800">{r.name}</div>
            <div className="flex-1 text-center text-gray-500 tracking-tight">{r.phone}</div>
            <div className="flex-1 text-right text-gray-500 tabular-nums">{fmtAt(r.at)}</div>
          </div>
        ))}
      </div>

      {/* 푸터 */}
      <div className="px-5 py-2.5 bg-gray-50 text-center text-[11px] text-gray-400">
        마지막 업데이트: {updated}
      </div>
    </div>
  )
}

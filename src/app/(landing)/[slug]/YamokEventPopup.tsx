'use client'

// 야목역 서희스타힐스 그랜드힐 — 진입 이벤트 팝업(폼 포함)
// "상담 접수 후 계약 시 백화점 상품권 또는 한우세트 증정" + 성함/연락처/문의내용 폼.
// 제출 → /api/landing-inquiry (message 포함) → landing.inquiries + 관리자 SMS(기존 파이프라인).
// 카드 팝업존(YamokPopupCarousel)과 별개 — 중앙 모달(z-[10000], 카드존 위). 오늘 하루 안보기=localStorage.
import { useCallback, useEffect, useState } from 'react'
import { useFraudGate } from './FraudGateContext'

const GOLD = '#C9A96E'
const GOLD_LIGHT = '#F5D78E'

interface Props {
  pageId: string
  slug: string
  storageKey: string
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export default function YamokEventPopup({ pageId, slug, storageKey }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const fraudGate = useFraudGate()

  // 노출 판단
  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey)) return
      if (localStorage.getItem(`${storageKey}-hide`) === todayKey()) return
    } catch {}
    setOpen(true)
  }, [storageKey])

  // body 스크롤 잠금 + ESC
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const close = useCallback(() => {
    setOpen(false)
    try {
      sessionStorage.setItem(storageKey, '1')
    } catch {}
  }, [storageKey])

  const hideToday = () => {
    setOpen(false)
    try {
      localStorage.setItem(`${storageKey}-hide`, todayKey())
      sessionStorage.setItem(storageKey, '1')
    } catch {}
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11)
    let f = digits
    if (digits.length > 3 && digits.length <= 7) f = `${digits.slice(0, 3)}-${digits.slice(3)}`
    else if (digits.length > 7) f = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
    setPhone(f)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !phone.trim()) {
      setError('성함과 연락처를 입력해주세요.')
      return
    }
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 11 || !digits.startsWith('010')) {
      setError('올바른 연락처를 입력해주세요. (010-XXXX-XXXX)')
      return
    }
    if (!agreed) {
      setError('개인정보 수집 및 이용에 동의해주세요.')
      return
    }
    setIsSubmitting(true)
    if (fraudGate.enabled) {
      const gate = await fraudGate.reportClick('inquiry_submit', { targetText: '이벤트 접수' })
      if (!gate.allow) {
        setError('현재 접속에서 비정상 패턴이 감지되어 접수가 차단되었습니다. 1668-5257로 문의해주세요.')
        setIsSubmitting(false)
        return
      }
    }
    const urlParams = new URLSearchParams(window.location.search)
    try {
      const res = await fetch('/api/landing-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_id: pageId,
          slug,
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim() || '[이벤트 접수] 백화점 상품권/한우세트 이벤트',
          agent_code: urlParams.get('a') || urlParams.get('agent') || undefined,
          utm_source: urlParams.get('utm_source') || undefined,
          utm_medium: urlParams.get('utm_medium') || undefined,
          utm_campaign: urlParams.get('utm_campaign') || undefined,
        }),
      })
      const result = await res.json()
      if (result.success) setSubmitted(true)
      else setError('접수 중 오류가 발생했습니다. 다시 시도해주세요.')
    } catch {
      setError('접수 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
    setIsSubmitting(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 px-4 py-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="야목역 서희스타힐스 그랜드힐 이벤트 접수"
      onClick={close}
    >
      <div
        className="relative w-full max-w-[400px] my-auto rounded-2xl overflow-hidden shadow-2xl"
        style={{ border: `1.5px solid ${GOLD}`, background: 'linear-gradient(160deg, #0F172A 0%, #1E1B4B 60%, #4338CA 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 */}
        <button
          onClick={close}
          aria-label="닫기"
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-black/40 text-white/90 flex items-center justify-center text-xl leading-none hover:bg-black/60 transition-colors"
        >
          &times;
        </button>

        {/* 우상단 발광 */}
        <span aria-hidden className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }} />

        <div className="relative px-6 pt-8 pb-5 text-center">
          <p className="text-[12px] text-white/70">해당 이벤트창을 통해 접수한 고객 한정</p>
          <h2 className="mt-2 text-white font-extrabold text-[22px] leading-tight">상담 접수 후 계약 시</h2>
          <div className="mt-3 flex flex-col items-center">
            <span className="font-black leading-none tracking-tight" style={{ color: GOLD_LIGHT, fontSize: 34 }}>
              백화점 상품권
            </span>
            <span className="mt-1 text-white font-extrabold text-[18px]">
              또는 <span style={{ color: GOLD_LIGHT }}>한우세트</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="inline-block -rotate-2 rounded-full px-4 py-1 text-[13px] font-extrabold" style={{ border: `1.5px solid ${GOLD}`, color: GOLD_LIGHT }}>
              🎁 무조건 증정
            </span>
          </div>
          <p className="mt-3 text-[11px] text-white/50">※ 본 이벤트는 해당 창을 통해 접수한 고객에게만 적용됩니다</p>
        </div>

        {/* 폼 */}
        <div className="px-5 pb-5">
          {submitted ? (
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-2 text-green-500">&#10003;</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">접수 완료</h3>
              <p className="text-gray-600 text-sm">빠른 시간 내에 연락드리겠습니다.</p>
              <button onClick={close} className="mt-4 w-full py-3 rounded-lg font-bold text-[15px]" style={{ background: GOLD, color: '#0F172A' }}>
                닫기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 space-y-2.5">
              <input
                type="text"
                placeholder="성함"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-400 text-[15px]"
              />
              <input
                type="tel"
                placeholder="연락처 (010-0000-0000)"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={13}
                className="w-full px-3.5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-400 text-[15px]"
              />
              <textarea
                placeholder="문의 내용 (선택)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-400 text-[15px] resize-none"
              />
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-amber-500 flex-shrink-0" />
                <span className="text-[12px] text-gray-500 leading-snug">
                  개인정보 수집·이용 동의 (이름·연락처 / 분양 상담 / 상담 완료 후 1년)
                </span>
              </label>
              {error && <p className="text-red-500 text-[12px]">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-lg font-extrabold text-[16px] flex items-center justify-center gap-1.5 disabled:opacity-50 active:opacity-80 transition-opacity"
                style={{ background: GOLD, color: '#0F172A' }}
              >
                🎁 {isSubmitting ? '접수 중...' : '이벤트 접수하고 상담 신청하기'}
              </button>
            </form>
          )}
        </div>

        {/* 하단 컨트롤 */}
        {!submitted && (
          <div className="flex items-stretch bg-black/40 text-[13px]">
            <button onClick={hideToday} className="flex-1 py-3 text-white/60 hover:text-white transition-colors">
              오늘 하루 안보기
            </button>
            <span className="w-px bg-white/15" />
            <button onClick={close} className="flex-1 py-3 text-white/60 hover:text-white transition-colors">
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

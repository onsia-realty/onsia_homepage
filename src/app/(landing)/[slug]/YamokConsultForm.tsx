'use client'

// 야목역 서희스타힐스 그랜드힐 — 간편 상담 신청 폼 (실시간 접수 현황 옆에 배치)
// 성함/연락처/방문예약(날짜·시간)/비고 → 기존 /api/landing-inquiry 로 제출.
// 방문예약·비고는 별도 컬럼 없이 message 필드에 합쳐 저장(DB 변경 0) + 관리자 SMS.
import { useState } from 'react'
import { useFraudGate } from './FraudGateContext'

const GOLD = '#C9A96E'

interface Props {
  pageId: string
  slug: string
}

export default function YamokConsultForm({ pageId, slug }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [memo, setMemo] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const fraudGate = useFraudGate()

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
      const gate = await fraudGate.reportClick('inquiry_submit', { targetText: '상담 신청' })
      if (!gate.allow) {
        setError('현재 접속에서 비정상 패턴이 감지되어 접수가 차단되었습니다. 1668-5257로 문의해주세요.')
        setIsSubmitting(false)
        return
      }
    }
    // 비고를 message에 저장 (방문예약 필드 제거 — DB 미수집 항목)
    const message = memo.trim() || '[상담 신청]'

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
          message,
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

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white h-full">
      {/* 헤더 (티커와 동일 톤) */}
      <div className="px-5 py-4 text-white" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #4338CA 100%)' }}>
        <h3 className="text-center font-extrabold text-[17px] tracking-tight">간편 상담 신청</h3>
        <p className="text-center text-[12px] text-white/70 mt-1">성함과 연락처만 남기면 상담해 드립니다</p>
      </div>

      {submitted ? (
        <div className="p-8 text-center">
          <div className="text-4xl mb-2 text-green-500">&#10003;</div>
          <h4 className="text-lg font-bold text-gray-900 mb-1">접수 완료</h4>
          <p className="text-gray-600 text-sm">빠른 시간 내에 연락드리겠습니다.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-1">성함 <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="성함을 입력해주세요"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-400 text-[15px]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-1">연락처 <span className="text-red-500">*</span></label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={13}
              placeholder="연락처를 입력해주세요"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-400 text-[15px]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-1">문의 내용 <span className="text-gray-400 font-normal">(선택)</span></label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={4}
              placeholder="문의하실 내용을 입력해주세요"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-400 text-[15px] resize-none"
            />
          </div>
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
            {isSubmitting ? '접수 중...' : '상담 신청하기'}
          </button>
        </form>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'

interface Props {
  pageId: string
  slug: string
  accentColor: string
  agentCode?: string
  agentName?: string
}

export default function InquiryForm({ pageId, slug, accentColor, agentCode, agentName }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // 010-XXXX-XXXX 자동 포맷팅
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11)
    let formatted = digits
    if (digits.length > 3 && digits.length <= 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`
    } else if (digits.length > 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
    }
    setPhone(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !phone.trim()) {
      setError('이름과 연락처를 입력해주세요.')
      return
    }

    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length !== 11 || !phoneDigits.startsWith('010')) {
      setError('올바른 연락처를 입력해주세요. (010-XXXX-XXXX)')
      return
    }

    if (!agreed) {
      setError('개인정보 수집 및 이용에 동의해주세요.')
      return
    }

    setIsSubmitting(true)

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
          agent_code: agentCode || urlParams.get('agent') || undefined,
          agent_name: agentName,
          utm_source: urlParams.get('utm_source') || undefined,
          utm_medium: urlParams.get('utm_medium') || undefined,
          utm_campaign: urlParams.get('utm_campaign') || undefined,
        }),
      })
      const result = await res.json()

      if (result.success) {
        setSubmitted(true)
      } else {
        setError('전송 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } catch {
      setError('전송 중 오류가 발생했습니다. 다시 시도해주세요.')
    }

    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3 text-green-500">&#10003;</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">등록 완료</h3>
        <p className="text-gray-600">빠른 시간 내에 연락드리겠습니다.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 lg:p-8 space-y-3 lg:space-y-4">
      <div className="lg:flex lg:gap-4">
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 lg:py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 text-base"
          style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
        />
        <input
          type="tel"
          placeholder="연락처 (010-0000-0000)"
          value={phone}
          onChange={handlePhoneChange}
          maxLength={13}
          className="w-full mt-3 lg:mt-0 px-4 py-3 lg:py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 text-base"
          style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
        />
      </div>
      <label className="flex items-start gap-2.5 cursor-pointer py-1">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 w-5 h-5 rounded border-gray-300 accent-current flex-shrink-0"
          style={{ accentColor }}
        />
        <span className="text-sm text-gray-600 leading-snug">
          개인정보 수집 및 이용에 동의합니다.
          <span className="text-gray-400 block text-xs mt-0.5">
            수집항목: 이름, 연락처 | 목적: 분양 상담 | 보유기간: 상담 완료 후 1년
          </span>
        </span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-lg text-white font-bold text-lg transition-opacity disabled:opacity-50 active:opacity-80 hover:opacity-90"
        style={{ backgroundColor: accentColor }}
      >
        {isSubmitting ? '등록 중...' : '관심고객 등록'}
      </button>
    </form>
  )
}

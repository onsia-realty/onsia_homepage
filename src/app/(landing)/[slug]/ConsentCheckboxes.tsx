'use client'

// 관심고객 폼 공용 동의 3분리 (필수 2 + 선택 1 + 야간 선택) — InquiryForm / YamokConsultForm 공유
// 문구를 바꾸면 CONSENT_VERSION(api/landing-inquiry/route.ts)도 함께 올릴 것.
import { useState } from 'react'

export interface Consents {
  privacy: boolean
  third_party: boolean
  marketing: boolean
  marketing_night: boolean
}

export const EMPTY_CONSENTS: Consents = { privacy: false, third_party: false, marketing: false, marketing_night: false }

export const CONSENT_ITEMS: { key: keyof Consents; required: boolean; label: string; detail: string }[] = [
  {
    key: 'privacy',
    required: true,
    label: '개인정보 수집·이용 동의',
    detail: '수집 항목: 이름, 연락처\n수집 목적: 분양 상담 및 안내\n보유 기간: 상담 완료 후 1년\n동의를 거부할 수 있으나, 거부 시 상담 신청이 제한됩니다.',
  },
  {
    key: 'third_party',
    required: true,
    label: '개인정보 제3자 제공 동의',
    detail: '제공받는 자: 해당 현장 분양사무소 및 분양대행사\n제공 목적: 분양 상담\n제공 항목: 이름, 연락처\n보유 기간: 상담 완료 후 1년\n동의를 거부할 수 있으나, 거부 시 상담 신청이 제한됩니다.',
  },
  {
    key: 'marketing',
    required: false,
    label: '광고성 정보 수신 동의 (문자·전화)',
    detail: '분양 일정·혜택 안내를 문자·전화로 받습니다.\n동의하지 않아도 상담 신청은 가능하며, 언제든 수신을 거부할 수 있습니다.',
  },
]

interface Props {
  value: Consents
  onChange: (next: Consents) => void
  accentColor?: string
  compact?: boolean
}

export default function ConsentCheckboxes({ value, onChange, accentColor = '#C9A96E', compact }: Props) {
  const [open, setOpen] = useState<keyof Consents | null>(null)
  const allChecked = value.privacy && value.third_party && value.marketing && value.marketing_night
  const set = (patch: Partial<Consents>) => onChange({ ...value, ...patch })
  const textCls = compact ? 'text-[12px]' : 'text-sm'
  const boxCls = `${compact ? 'w-4 h-4' : 'w-5 h-5'} mt-0.5 rounded border-gray-300 flex-shrink-0`

  return (
    <div className={`space-y-1.5 ${textCls} text-gray-600`}>
      <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 pb-1.5 border-b border-gray-200">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={(e) => {
            const v = e.target.checked
            onChange({ privacy: v, third_party: v, marketing: v, marketing_night: v })
          }}
          className={boxCls}
          style={{ accentColor }}
        />
        전체 동의
      </label>
      {CONSENT_ITEMS.map((item) => (
        <div key={item.key}>
          <div className="flex items-start gap-2">
            <label className="flex items-start gap-2 cursor-pointer flex-1 min-w-0">
              <input
                type="checkbox"
                checked={value[item.key]}
                onChange={(e) => set({ [item.key]: e.target.checked, ...(item.key === 'marketing' && !e.target.checked ? { marketing_night: false } : {}) })}
                className={boxCls}
                style={{ accentColor }}
              />
              <span className="leading-snug">
                <span className={item.required ? 'text-red-500' : 'text-gray-400'}>[{item.required ? '필수' : '선택'}]</span> {item.label}
              </span>
            </label>
            <button
              type="button"
              onClick={() => setOpen(open === item.key ? null : item.key)}
              className="text-xs text-gray-400 underline flex-shrink-0 py-0.5"
            >
              {open === item.key ? '닫기' : '보기'}
            </button>
          </div>
          {open === item.key && (
            <p className="mt-1 ml-6 p-2.5 rounded bg-gray-50 text-xs text-gray-500 whitespace-pre-line leading-relaxed">{item.detail}</p>
          )}
          {item.key === 'marketing' && value.marketing && (
            <label className="flex items-start gap-2 cursor-pointer ml-6 mt-1">
              <input
                type="checkbox"
                checked={value.marketing_night}
                onChange={(e) => set({ marketing_night: e.target.checked })}
                className={boxCls}
                style={{ accentColor }}
              />
              <span className="leading-snug text-gray-500"><span className="text-gray-400">[선택]</span> 야간(21시~08시) 수신 동의</span>
            </label>
          )}
        </div>
      ))}
    </div>
  )
}

// YamokInquiryGift 복제 — 관심고객 등록 폼 상단 이벤트 카드. 문구/이미지는 config.inquiryGift.
import type { TplSiteConfig } from '@/landing-sites/types'

interface Props {
  gift: NonNullable<TplSiteConfig['inquiryGift']>
}

export default function TplInquiryGift({ gift }: Props) {
  return (
    <div className="max-w-[460px] mx-auto mb-6">
      <div className="rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: '#1E3932' }}>
        <div className="px-5 pt-5 pb-4 text-center">
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide text-white mb-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
          >
            {gift.badge}
          </span>
          {gift.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={gift.image} alt={gift.imageAlt || gift.highlight} className="w-full max-w-[300px] mx-auto rounded-xl" />
          )}
          <p className="mt-3 text-white font-bold text-[15px] lg:text-base leading-snug">
            {gift.line}
            <br />
            <span style={{ color: '#FFD54F' }}>{gift.highlight}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

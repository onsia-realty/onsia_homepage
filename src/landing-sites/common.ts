// 템플릿 현장 공통 값 — 모든 tpl 현장에 동일하게 적용되는 표준 이벤트(야목 YamokEventPopup/YamokInquiryGift 문구 그대로).
import type { TplSiteConfig } from './types'

/** 진입 이벤트 팝업 — eyebrow만 현장명, 나머지는 전 현장 동일 */
export function STANDARD_EVENT_POPUP(siteName: string): NonNullable<TplSiteConfig['eventPopup']> {
  return {
    eyebrow: `${siteName} · 해당 이벤트창을 통해 접수한 고객 한정`,
    title: '상담 접수 후 계약 시',
    prize: '백화점 상품권',
    prizeSub: '또는 한우세트',
    stamp: '🎁 무조건 증정',
    note: '※ 본 이벤트는 해당 창을 통해 접수한 고객에게만 적용됩니다',
    defaultMessage: '[이벤트 접수] 백화점 상품권/한우세트 이벤트',
  }
}

/** 관심고객 폼 상단 이벤트 카드 — 스타벅스 기프티콘 */
export const STANDARD_INQUIRY_GIFT: NonNullable<TplSiteConfig['inquiryGift']> = {
  badge: 'EVENT · SPECIAL GIFT',
  image: '/uploads/landing/_common/coffee-gift.png',
  imageAlt: '관심고객 등록 시 스타벅스 기프티콘 증정',
  line: '관심고객 등록하고 방문 상담 시',
  highlight: '스타벅스 기프티콘 또는 고급 사은품 증정',
}

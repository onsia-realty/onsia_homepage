// 야목역 서희스타힐스 그랜드힐 — 진입 임팩트 "팝업존" 카드 데이터 (완성 이미지형)
// 카드는 완성된 그래픽(public/uploads/landing/yamok/popup/*). CTA 버튼이 이미지에 포함돼
// 카드 전체가 링크로 동작한다. 교체/추가는 이 배열만 손대면 됨.

export interface YamokSlide {
  key: string
  image: string
  alt: string
  href: string
}

const INQUIRY = '/yamok-grandhill/inquiry'

export const YAMOK_POPUP_SLIDES: YamokSlide[] = [
  {
    key: 'event',
    image: '/uploads/landing/yamok/popup/card1_event.png',
    alt: 'LMS 문자상담 신청 이벤트 · 스타벅스 기프티콘 증정',
    href: INQUIRY,
  },
  {
    key: 'deposit',
    image: '/uploads/landing/yamok/popup/card2_deposit5.png',
    alt: '계약금 5% · 1차 계약금 500만원 · 선착순 동·호지정 계약중',
    href: INQUIRY,
  },
  {
    key: 'lastcall',
    image: '/uploads/landing/yamok/popup/card3_lastcall.png',
    alt: '59·84타입 마감임박 · 선착순 LAST CALL',
    href: INQUIRY,
  },
  {
    key: 'premium',
    image: '/uploads/landing/yamok/popup/card4_premium.png',
    alt: '야목역 서희스타힐스만의 프리미엄 · 트리플 역세권 998세대 대단지',
    href: '/yamok-grandhill/premium',
  },
  {
    key: 'freezone',
    image: '/uploads/landing/yamok/popup/card5_freezone.png',
    alt: '희소성 높은 수도권 비규제지역 Free Zone · 청약통장·대출규제·실거주의무 無',
    href: INQUIRY,
  },
]

// 야목역 서희스타힐스 그랜드힐 — 진입 임팩트 팝업 캐러셀 슬라이드 데이터
// 문구 수정은 이 파일만 손대면 됨. 링크 기본값 = 관심고객 등록(/yamok-grandhill/inquiry).
// 디자인 톤: 다크네이비+골드 / 에페트 무드 brown. 과장 없는 광고 disclaimer 안전 카피.

export interface YamokSlide {
  key: string
  theme: 'navy' | 'brown' | 'gold'
  stamp?: string // 로테이트 배지 스탬프
  kicker: string // 상단 레터스페이싱 소문자 라인
  impact: string // 초대형 임팩트 타이포
  impactSub?: string // 임팩트 보조 라인
  title: string // 메인 타이틀
  lines: string[] // 본문 라인
  cta: string // 버튼 문구
  href?: string // 링크 (default /yamok-grandhill/inquiry)
  image?: string // 이미지형 슬라이드용 (스타벅스)
}

const INQUIRY = '/yamok-grandhill/inquiry'

export const YAMOK_POPUP_SLIDES: YamokSlide[] = [
  {
    key: 'starbucks',
    theme: 'brown',
    stamp: 'EVENT',
    kicker: 'SPECIAL GIFT',
    impact: '스타벅스',
    impactSub: '기프티콘 증정',
    title: 'LMS 문자상담 신청 이벤트',
    lines: ['문자로 상담 신청하신 분께', '스타벅스 기프티콘을 드립니다'],
    cta: '관심고객 등록하고 받기',
    href: INQUIRY,
    image: '/Gemini_Generated_Image_8wu5br8wu5br8wu5.png',
  },
  {
    key: 'grand-open',
    theme: 'navy',
    stamp: 'NOW OPEN',
    kicker: '야목역 서희스타힐스 그랜드힐',
    impact: 'GRAND',
    impactSub: 'OPEN',
    title: '견본주택 오픈',
    lines: ['지금 방문 예약하시고', '가장 먼저 만나보세요'],
    cta: '방문 예약하기',
    href: INQUIRY,
  },
  {
    key: 'gtx',
    theme: 'navy',
    stamp: '더블역세권',
    kicker: 'DOUBLE STATION',
    impact: 'GTX-F',
    impactSub: '야목역',
    title: '수인분당선 + GTX-F(예정)',
    lines: ['야목역 도보 생활권', 'GTX-F 예정 더블역세권 입지'],
    cta: '입지 프리미엄 보기',
    href: '/yamok-grandhill/premium',
  },
  {
    key: 'brand-town',
    theme: 'gold',
    stamp: 'BRAND TOWN',
    kicker: '비봉지구 대단지',
    impact: '998세대',
    impactSub: '',
    title: '서희스타힐스 브랜드타운',
    lines: ['비봉지구 998세대 규모', '서희가 만드는 새로운 주거타운'],
    cta: '단지 정보 보기',
    href: '/yamok-grandhill/business',
  },
  {
    key: 'last-call',
    theme: 'brown',
    stamp: '선착순',
    kicker: 'LAST CALL',
    impact: '마감임박',
    impactSub: '',
    title: '지금이 마지막 기회',
    lines: ['관심고객 등록 시', '분양가 · 공급조건 우선 안내'],
    cta: '관심고객 등록하기',
    href: INQUIRY,
  },
]

// 화서역 호수공원 아너스빌 — 템플릿 설정
// 출처: docs/landing-pilot/hwaseo-honorsville/data.json + 00-구인공고-원문요약.md §3 (공고 문구 그대로 사용)
// 이미지: 공식 홈페이지(화서역호수공원아너스빌.com) 원본 → public/uploads/landing/hwaseo-honorsville/ (images.md 참고)
import type { TplSiteConfig } from './types'
import { STANDARD_EVENT_POPUP, STANDARD_INQUIRY_GIFT } from './common'

const IMG = '/uploads/landing/hwaseo-honorsville'
const NAME = '화서역 호수공원 아너스빌'

export const HWASEO_HONORSVILLE: TplSiteConfig = {
  slug: 'hwaseo-honorsville',
  name: NAME,
  nameEn: 'HWASEO LAKE PARK · HONORSVILLE',
  subtitle: '수원 유일 비규제 권선구, 서호공원 옆 전용 84·94·99㎡ 476세대',
  phone: '1668-5257',
  colors: { primary: '#1E3A5F', accent: '#C9A96E' },

  hero: {
    image: `${IMG}/hero.jpg`,
    alt: '화서역 호수공원 아너스빌 — 수원 권선구 서둔동 서호공원 옆 476세대 (삼환기업)',
    kicker: 'SUWON · GWONSEON-GU · SEODUN-DONG',
    title: NAME,
    subtitle: '수원 유일 비규제 권선구 · 서호공원 옆 전용 84·94·99㎡ 476세대',
    chips: ['선착순 동·호 지정 계약 중', '계약금 5% (1차 500만원)', '중도금 60% 무이자', '전매제한 1년'],
  },

  stats: [
    { value: 476, unit: '세대', label: '지하 4층~지상 15층 · 7개 동' },
    { value: '84·94·99', unit: '㎡', label: '전 세대 중대형 전용면적' },
    { value: '1.92', unit: '대', label: '세대당 주차대수' }, // CountUp은 정수 반올림 → 소수는 문자열
    { value: 70, unit: '', suffix: '%', label: 'LTV 최대 (비규제지역)' },
  ],

  facts: [
    { icon: 'subway', n: '화서역', l: '1호선 생활권' },
    { icon: 'shield', n: '비규제', l: '수원 유일 권선구' },
    { icon: 'building', n: '476세대', l: '7개 동 · 15층', countTo: 476, suffix: '세대' },
    { icon: 'lake', n: '서호공원', l: '호수공원 생활권' },
  ],

  benefits: {
    kicker: 'BENEFIT',
    title: '8천만원 상당 혜택',
    items: [
      '계약금 5% (1차 500만원)',
      '입주 시까지 2천만원 정액제',
      '중도금 60% 무이자',
      '발코니 확장 무상',
      '시스템에어컨 등 2천만원 상당 옵션 무상',
      '비규제지역 · 전매제한 1년',
      'LTV 최대 70%',
      '실거주 의무 · 청약통장 불필요',
      '5.6m 광폭거실 + 3면 발코니 특화',
    ],
  },

  premium: {
    kicker: 'PREMIUM 6',
    title: '화서역 호수공원 아너스빌만의 프리미엄',
    items: [
      { title: '수원 유일 비규제 권선구', desc: '영통·장안·팔달구가 규제지역으로 묶인 지금, 권선구만 예외. 전매제한 1년, 실거주 의무 없음, 청약통장 불필요, LTV 최대 70%.' },
      { title: '8천만원 상당 혜택', desc: '계약금 5%(1차 500만원), 입주 시까지 2천만원 정액제, 중도금 60% 무이자, 발코니 확장 무상, 시스템에어컨 등 2천만원 상당 옵션 무상.' },
      { title: '서호공원 생활권', desc: "수원팔경 '서호낙조'의 서호공원 산책로 도보 10분, 국립농업박물관·여기산 녹지 인접. 호수 조망 세대." },
      { title: '전 세대 중대형 84·94·99㎡', desc: '5.6m 광폭 거실 + 3면 발코니 특화, 커튼월룩 외관·유리난간. 476세대 7개 동, 세대당 주차 1.92대, 근생시설 1,258평.' },
      { title: '화서역·수원역 더블 역 + 트리플 몰', desc: '화서역·수원역(KTX, GTX-C 추진) 이용권. 스타필드 수원·롯데몰 타임빌라스·AK플라자 인근.' },
      { title: 'AI 스마트 단지', desc: '안면인식 출입, 수원 최초 실시간 빈자리 주차 안내, 비대면 진료 연계 헬스케어(솔닥 협업).' },
    ],
  },

  popupSlides: [
    { key: 'benefit', image: `${IMG}/popup/benefit_list.png`, alt: '입주 전까지 2천만원 · 1차 계약금 500만원 · 중도금 60% 무이자 · 발코니 확장비 무상 · 전매제한 1년', href: '#inquiry' },
    { key: 'deposit', image: `${IMG}/popup/deposit_2000.jpg`, alt: '부담제로 수원 유일 파격혜택 · 입주 시까지 계약금 2천만원 끝 · 호수공원 조망 프리미엄', href: '#inquiry' },
    { key: 'firstcome', image: `${IMG}/popup/first_come.png`, alt: '선착순 동·호 지정 계약 중', href: '#inquiry' },
    { key: 'special', image: `${IMG}/popup/special_1eok.jpg`, alt: '스페셜 혜택 · 입주 시까지 추가 납부 0원 · 프리미엄 옵션 무상제공 · 중도금 전액 무이자 · 발코니 무상확장', href: '#inquiry' },
    { key: 'event', image: `${IMG}/popup/contract_event.jpg`, alt: '계약고객 감사 이벤트 · 계약고객 전원 주방 아일랜드장 무상 설치', href: '#inquiry' },
  ],

  inquiryGift: STANDARD_INQUIRY_GIFT,
  eventPopup: STANDARD_EVENT_POPUP(NAME),

  gallery: [
    {
      id: 'business',
      navLabel: '사업개요',
      kicker: 'PROJECT',
      stamp: '선착순 계약중',
      title: '권선구 476세대 신축',
      highlight: '476세대',
      sub: '화서역 호수공원 아너스빌 사업개요 · 삼환기업 자체사업',
      grad: 'linear-gradient(135deg, #0c2a5e 0%, #1d4ed8 100%)',
      images: [
        { src: `${IMG}/overview_01.jpg`, alt: '화서역 호수공원 아너스빌 조감도 — 수원 권선구 서둔동 신축 아파트 야경' },
        { src: `${IMG}/overview_02.jpg`, alt: '화서역 호수공원 아너스빌 서호공원 조망 조감도 — 호수공원 아파트' },
        { src: `${IMG}/overview_03.jpg`, alt: '화서역 호수공원 아너스빌 커튼월룩 외관 투시도 — 삼환기업 아너스빌' },
        { src: `${IMG}/overview_table.jpg`, alt: '화서역 호수공원 아너스빌 사업개요 — 수원시 권선구 서둔동 212-1 아파트 476세대 전용 84/94/99㎡' },
      ],
    },
    {
      id: 'location',
      navLabel: '입지환경',
      kicker: 'LOCATION',
      stamp: '서호공원 앞',
      title: '서호공원 앞 화서역 생활권',
      highlight: '서호공원',
      sub: '화서역 · 수원역(KTX · GTX-C 추진) · 스타필드 수원',
      grad: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)',
      images: [
        { src: `${IMG}/location.jpg`, alt: '화서역 호수공원 아너스빌 입지환경 — 서호공원 앞 레이크 파크 스테이션 몰 생활권' },
        { src: `${IMG}/location_map.jpg`, alt: '화서역 호수공원 아너스빌 위치도 — 수원 권선구 서둔동 화서역·수원역 사이' },
        { src: `${IMG}/traffic.jpg`, alt: '화서역 호수공원 아너스빌 교통 — 신분당선(예정) · GTX-C(예정) · KTX 서울 수도권 광역 접근성' },
        { src: `${IMG}/lakepark.jpg`, alt: '서호공원 산책로 일러스트 — 화서역 호수공원 아너스빌 호수공원 생활권' },
      ],
    },
    {
      id: 'premium',
      navLabel: '프리미엄',
      kicker: 'PREMIUM',
      stamp: '비규제',
      title: '수원 유일 비규제 프리미엄',
      highlight: '비규제',
      sub: '프리미엄 6 · 호수뷰 · AI 스마트 단지',
      grad: 'linear-gradient(135deg, #b91c1c 0%, #f97316 100%)',
      images: [
        { src: `${IMG}/premium.jpg`, alt: '화서역 호수공원 아너스빌 프리미엄 6 — 비규제 · 교통 · 서호공원 · 중대형 · 스마트 단지' },
        { src: `${IMG}/view.jpg`, alt: '화서역 호수공원 아너스빌 호수뷰 — 단지에서 바라보는 서호공원 풍경' },
        { src: `${IMG}/industry.jpg`, alt: '화서역 호수공원 아너스빌 미래가치 — 수원 경제자유구역 · 탑동 이노베이션밸리 · R&D 사이언스파크' },
        { src: `${IMG}/ai_apt.jpg`, alt: '화서역 호수공원 아너스빌 AI 스마트 단지 — 안면인식 로비폰 · 도어카메라 · 헬스케어 · 주차유도' },
        { src: `${IMG}/ai_health.jpg`, alt: '화서역 호수공원 아너스빌 AI 헬스케어 — 비대면 진료 연계(솔닥)' },
        { src: `${IMG}/system.jpg`, alt: '화서역 호수공원 아너스빌 삼성 홈닉 스마트 홈 시스템' },
      ],
    },
    {
      id: 'complex',
      navLabel: '단지안내',
      kicker: 'SITE PLAN',
      stamp: '7개 동 476세대',
      title: '단지 배치 안내',
      highlight: '단지 배치',
      sub: '단지배치도 · 동호수표 · 조경 · 커뮤니티 · 상가',
      grad: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)',
      images: [
        { src: `${IMG}/layout.jpg`, alt: '화서역 호수공원 아너스빌 단지배치도 · 동호수표' },
        { src: `${IMG}/complex.jpg`, alt: '화서역 호수공원 아너스빌 조경 · 놀이터 · 5.6m 광폭거실 · 세대당 주차 1.92대' },
        { src: `${IMG}/community.jpg`, alt: '화서역 호수공원 아너스빌 커뮤니티 시설 안내' },
        { src: `${IMG}/onestop.jpg`, alt: '화서역 호수공원 아너스빌 아너스 레이크 스퀘어 근생시설 상가' },
      ],
    },
    {
      id: 'schedule',
      navLabel: '분양안내',
      kicker: 'GUIDE',
      stamp: '선착순 동호지정',
      title: '분양 · 공급 안내',
      highlight: '공급',
      sub: '분양일정 · 공급안내(분양가) · 모델하우스 고색동',
      grad: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
      images: [
        { src: `${IMG}/schedule.jpg`, alt: '화서역 호수공원 아너스빌 분양일정 — 2026년 9월 그랜드오픈 · 선착순 동호지정 계약' },
        { src: `${IMG}/supply.jpg`, alt: '화서역 호수공원 아너스빌 공급안내 — 타입별 분양가 · 중도금 무이자' },
        { src: `${IMG}/grandopen.jpg`, alt: '화서역 호수공원 아너스빌 견본주택 그랜드오픈 현장' },
        { src: `${IMG}/rendering_night.jpg`, alt: '화서역 호수공원 아너스빌 야간 조감도' },
      ],
    },
  ],

  unitPlans: [
    { type: '84A', area: '84.7459㎡', units: 27, src: `${IMG}/unitplan_84a.jpg`, alt: '화서역 호수공원 아너스빌 84㎡A 평면도 — 전용 84.7459㎡ 27세대', interior: `${IMG}/unit_interior_84a.jpg` },
    { type: '84B', area: '84.8508㎡', units: 84, src: `${IMG}/unitplan_84b.jpg`, alt: '화서역 호수공원 아너스빌 84㎡B 평면도 — 전용 84.8508㎡ 84세대', interior: `${IMG}/unit_interior_84b.jpg` },
    { type: '84C', area: '84.6391㎡', units: 39, src: `${IMG}/unitplan_84c.jpg`, alt: '화서역 호수공원 아너스빌 84㎡C 평면도 — 전용 84.6391㎡ 39세대', interior: `${IMG}/unit_interior_84c.jpg` },
    { type: '84D', area: '84.9663㎡', units: 70, src: `${IMG}/unitplan_84d.jpg`, alt: '화서역 호수공원 아너스빌 84㎡D 평면도 — 전용 84.9663㎡ 70세대', interior: `${IMG}/unit_interior_84d.jpg` },
    { type: '84E', area: '84.9739㎡', units: 14, src: `${IMG}/unitplan_84e.jpg`, alt: '화서역 호수공원 아너스빌 84㎡E 평면도 — 전용 84.9739㎡ 14세대', interior: `${IMG}/unit_interior_84e.jpg` },
    { type: '94A', area: '94.9503㎡', units: 147, src: `${IMG}/unitplan_94a.jpg`, alt: '화서역 호수공원 아너스빌 94㎡A 평면도 — 전용 94.9503㎡ 147세대', interior: `${IMG}/unit_interior_94a.jpg` },
    { type: '94B', area: '94.961㎡', units: 14, src: `${IMG}/unitplan_94b.jpg`, alt: '화서역 호수공원 아너스빌 94㎡B 평면도 — 전용 94.961㎡ 14세대', interior: `${IMG}/unit_interior_94b.jpg` },
    { type: '99A', area: '99.6774㎡', units: 81, src: `${IMG}/unitplan_99a.jpg`, alt: '화서역 호수공원 아너스빌 99㎡A 평면도 — 전용 99.6774㎡ 81세대', interior: `${IMG}/unit_interior_99a.jpg` },
  ],

  faq: [
    { q: '화서역 호수공원 아너스빌 위치는 어디인가요?', a: '경기도 수원시 권선구 서둔동 212-1번지 일원(도로명 수인로135번길 22)입니다. 서호공원 바로 옆이며 화서역(1호선)·수원역(1호선·수인분당선·KTX) 생활권입니다.' },
    { q: '모델하우스(견본주택)는 어디에 있나요?', a: '경기도 수원시 권선구 고색동 533-1에 있습니다. 방문 전 분양문의 1668-5257로 예약하시면 대기 없이 상담받으실 수 있습니다.' },
    { q: '규제지역인가요? 청약통장이 필요한가요?', a: '수원시에서 유일하게 권선구는 비규제지역(조정대상지역·투기과열지구 아님)입니다. 전매제한 1년, 실거주 의무 없음, 청약통장 불필요, LTV 최대 70%가 적용됩니다.' },
    { q: '세대 규모와 타입은 어떻게 되나요?', a: '지하 4층~지상 15층, 7개 동, 총 476세대이며 전용 84㎡(A~E)·94㎡(A·B)·99㎡(A) 8개 타입으로 구성됩니다. 5.6m 광폭거실과 3면 발코니 특화 설계가 적용됩니다.' },
    { q: '계약 조건과 혜택은 무엇인가요?', a: '계약금 5%(1차 500만원), 입주 시까지 2천만원 정액제, 중도금 60% 무이자, 발코니 확장 무상, 시스템에어컨 등 2천만원 상당 옵션 무상 등 8천만원 상당 혜택이 제공됩니다. 세부 조건은 상담 시 안내드립니다.' },
    { q: '현재 분양 진행 상황은 어떤가요?', a: '청약 접수 및 당첨자 계약이 완료되어 현재 선착순 동·호 지정 계약 중입니다. 관심고객 등록 시 잔여 동·호와 분양가를 우선 안내해 드립니다.' },
    { q: '입주 예정일은 언제인가요?', a: '2029년 10월 입주 예정입니다.' },
  ],

  location: {
    image: `${IMG}/contact.jpg`,
    imageAlt: '화서역 호수공원 아너스빌 오시는길 — 현장(서둔동 212-1) · 견본주택(고색동 533-1) 약도',
    siteAddress: '경기도 수원시 권선구 서둔동 212-1번지 일원',
    siteNaverUrl: 'https://naver.me/5JqTD7aI',
    siteKakaoUrl: 'https://kko.to/RrNycV1Y-N',
    modelhouseAddress: '경기도 수원시 권선구 고색동 533-1',
    modelhouseNaverUrl: 'https://naver.me/GRDuR7gW',
    modelhouseKakaoUrl: 'https://kko.to/cGNUAhsO7d',
  },

  footer: {
    companyName: '화서역 호수공원 아너스빌 분양홍보관',
    lines: ['시행·시공 삼환기업㈜ (SM그룹 건설부문)　|　사업지 수원시 권선구 서둔동 212-1'],
    disclaimer:
      '※ 본 홈페이지에 사용된 CG, 지역도, 일러스트 및 각종 이미지는 소비자의 이해를 돕기 위해 제작된 것으로 실제와 다를 수 있습니다.\n' +
      '※ 본 홈페이지에 표기된 사항은 인허가 및 건축허가 변경 승인에 따라 변경될 수 있으며, 제작과정에서 오탈자 혹은 수치표기 오류가 있을 수 있으므로 자세한 사항은 상기 번호로 문의하시기 바랍니다.',
  },

  seo: {
    title: '화서역 호수공원 아너스빌 | 수원 권선구 비규제 476세대 선착순 동호지정',
    description:
      '수원시 권선구 서둔동 화서역 호수공원 아너스빌. 전용 84·94·99㎡ 476세대, 계약금 5%·중도금 60% 무이자·발코니 확장 무상. 수원 유일 비규제, 전매 1년·실거주 의무 없음. 2029년 10월 입주 예정, 선착순 동·호 지정 계약 중. 모델하우스 고색동.',
    keywords: ['화서역 호수공원 아너스빌', '화서역 아너스빌', '서둔동 아너스빌', '수원 아너스빌', '권선구 분양', '수원 비규제 아파트', '서호공원 아파트', '수원 선착순 분양', '삼환기업 아너스빌', '수원 신축 분양 2026'],
    ogImage: `${IMG}/hero.jpg`,
  },

  structured: {
    alternateNames: ['화서역호수공원아너스빌', '화서역아너스빌', '서둔동아너스빌', '수원아너스빌', '호수공원아너스빌', '권선구아너스빌'],
    description:
      '화서역 호수공원 아너스빌 — 수원시 권선구 서둔동 서호공원 옆 전용 84·94·99㎡ 476세대 신축 아파트. 수원 유일 비규제 권선구, 선착순 동·호 지정 계약 중. 모델하우스 고색동.',
    units: 476,
    address: { street: '서둔동 212-1번지 일원', locality: '수원시 권선구', region: '경기도' },
    modelhouse: { street: '고색동 533-1', locality: '수원시 권선구', region: '경기도' },
    floorPlans: [
      { name: '84㎡A 타입', area: 84, rooms: 4 },
      { name: '84㎡B 타입', area: 84, rooms: 4 },
      { name: '84㎡C 타입', area: 84, rooms: 4 },
      { name: '84㎡D 타입', area: 84, rooms: 4 },
      { name: '84㎡E 타입', area: 84, rooms: 4 },
      { name: '94㎡A 타입', area: 94, rooms: 4 },
      { name: '94㎡B 타입', area: 94, rooms: 4 },
      { name: '99㎡A 타입', area: 99, rooms: 4 },
    ],
    features: ['수원 유일 비규제 권선구', '서호공원 생활권', '화서역·수원역 더블 역세권', '5.6m 광폭거실 · 3면 발코니', 'AI 스마트 단지'],
  },

  // ponytail: 마케팅 baseline — 오너가 정할 값. 0이면 "총 0명"으로 보여 임시 100으로 둠.
  reserveBaseline: 100,
  flags: { fraudGate: false, liveRequests: true, eventPopup: true, reserveCounter: true },
}

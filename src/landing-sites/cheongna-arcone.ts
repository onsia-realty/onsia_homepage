// 청라 아크원 푸르지오 — 템플릿 설정
// 출처: docs/landing-pilot/cheongna-arcone/data.json + 00-구인공고-원문요약.md §1 (공고 문구 그대로 사용) + 공식 홈페이지 프리미엄 문구
// 이미지: 공식 홈페이지(arkone-prugio.com) 원본 → public/uploads/landing/cheongna-arcone/ (images.md 참고)
// 상태: 입주자모집공고 10/22 예정 · 청약 11/2 예정 → 사전 관심고객 등록 톤
import type { TplSiteConfig } from './types'
import { STANDARD_EVENT_POPUP, STANDARD_INQUIRY_GIFT } from './common'

const IMG = '/uploads/landing/cheongna-arcone'
const NAME = '청라 아크원 푸르지오'

export const CHEONGNA_ARCONE: TplSiteConfig = {
  slug: 'cheongna-arcone',
  name: NAME,
  nameEn: 'CHEONGNA ARKONE · PRUGIO',
  subtitle: '청라국제업무단지 10년 만의 분양가상한제 대단지 — 아파트 868세대 + 오피스텔 987실',
  phone: '1668-5257',
  colors: { primary: '#1B3A34', accent: '#C9A96E' },

  hero: {
    image: `${IMG}/hero.jpg`,
    alt: '청라 아크원 푸르지오 조감도 — 인천 서구 청라국제업무단지 M5블록 지하 5층~지상 49층 6개 동 1,855세대 (대우건설)',
    kicker: 'INCHEON · CHEONGNA INTERNATIONAL CITY · M5 BLOCK',
    title: NAME,
    subtitle: '청라국제업무단지 분양가상한제 · 아파트 868세대 + 오피스텔 987실 총 1,855세대',
    chips: ['사전 관심고객 등록 접수 중', '입주자모집공고 10/22 예정', '청약 접수 11/2 예정', '아파트 분양가상한제', '모델하우스 10/30 오픈'],
  },

  stats: [
    { value: 1855, unit: '세대', label: '아파트 868세대 + 오피스텔 987실' },
    { value: '84·103', unit: '㎡', label: '아파트 전용면적 (84A·B·C·D / 103)' },
    { value: 49, unit: '층', label: '지하 5층~지상 49층 · 6개 동' },
    { value: 10, unit: '년', label: '만의 청라 분양가상한제 공급 (500세대 이상)' },
  ],

  facts: [
    { icon: 'shield', n: '분양가상한제', l: '아파트 868세대' },
    { icon: 'building', n: '1,855세대', l: '6개 동 · 지상 49층', countTo: 1855, suffix: '세대' },
    { icon: 'subway', n: '7호선·9호선', l: '연장 · 국제업무단지역(예정)' },
    { icon: 'medal', n: '대우건설', l: '푸르지오 브랜드타운' },
  ],

  benefits: {
    kicker: 'POINT',
    title: '청라 아크원 푸르지오 핵심 포인트',
    items: [
      '아파트 868세대 분양가상한제 적용',
      '비규제지역 인천 서구',
      '총 1,855세대 대단지 (아파트 868 + 오피스텔 987)',
      '전용 84·103㎡ (아파트) · 105·121·136㎡ (오피스텔)',
      '대우건설 시공 · 지상 최고 49층',
      '청라 피크원 푸르지오 1차의 성공을 다시 한번',
      '2017년 이후 10년 만의 분양가상한제 공급 아파트',
      '모델하우스 10월 30일 오픈 · 청라 피크원 1차 모델하우스 자리',
      '2031년 입주 예정',
    ],
  },

  premium: {
    kicker: 'PREMIUM',
    title: '풍부한 개발호재',
    items: [
      { title: '스타필드 청라 · 돔구장', desc: "돔구장 & 스타필드 청라('28년 개장 예정). 완벽해지는 청라의 트렌디한 생활특권." },
      { title: '7호선·9호선 연장', desc: '서울 지하철 7호선 청라연장 국제업무단지역(예정), 공항철도·9호선 직결(계획), 경인고속도로 지하화(예정). 서울과 하나되는 교통 네트워크.' },
      { title: '의료복합타운(아산병원)', desc: "서울아산청라병원('29년 예정) 청라의료복합타운. 집 가까이 완성되는 의료 인프라." },
      { title: '하나금융타운', desc: '하나드림타운(하나금융 청라 헤드쿼터) 직주근접. 청라국제업무단지를 대표하는 푸르지오 브랜드타운.' },
      { title: '로봇랜드 · 영상문화단지', desc: "인천로봇랜드(예정), 영상문화복합단지('31년 계획), 청라시티타워(계획), I-CON City(계획)." },
      { title: '코스트코 · 외국인 국제학교', desc: '코스트코 청라, 청라달튼외국인학교. 도보 약 5분 초교 신설(예정)·중교 신설(계획), 도보거리 경연초·중교 교육 프리미엄.' },
    ],
  },

  // 공식 홈페이지(티저)에 팝업 이미지 없음 → 팝업존 미노출
  popupSlides: [],

  inquiryGift: STANDARD_INQUIRY_GIFT,
  eventPopup: STANDARD_EVENT_POPUP(NAME),

  gallery: [
    {
      id: 'business',
      navLabel: '사업개요',
      kicker: 'PROJECT',
      stamp: '모집공고 10/22 예정',
      title: '청라국제업무단지 1,855세대 대단지',
      highlight: '1,855세대',
      sub: '청라 아크원 푸르지오 사업개요 · 시행 ㈜청라스마트시티 · 시공 ㈜대우건설',
      grad: 'linear-gradient(135deg, #0f2f29 0%, #1b6b5a 100%)',
      images: [
        { src: `${IMG}/hero.jpg`, alt: '청라 아크원 푸르지오 조감도 — 청라국제업무단지 M5블록 지하 5층~지상 49층 6개 동' },
        { src: `${IMG}/rendering_tower.jpg`, alt: '청라 아크원 푸르지오 투시도 — 아파트 868세대 + 오피스텔 987실 49층 주상복합' },
        { src: `${IMG}/rendering_street.jpg`, alt: '청라 아크원 푸르지오 단지 중앙 조경 투시도 — 푸르지오 브랜드타운' },
      ],
    },
    {
      id: 'location',
      navLabel: '입지환경',
      kicker: 'LOCATION',
      stamp: '국제업무단지역(예정)',
      title: '청라의 기다림이 완성되는 곳',
      highlight: '청라',
      sub: '7호선 청라연장(예정) · 공항철도·9호선 직결(계획) · 청라국제도시역 · 경인고속도로 지하화(예정)',
      grad: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)',
      images: [
        { src: `${IMG}/location_map.jpg`, alt: '청라 아크원 푸르지오 입지환경 지도 — 청라국제업무단지 M5블록 · 7호선 청라연장(예정) · 9호선 직결(계획) · 스타필드 청라 · 코스트코' },
        { src: `${IMG}/location_route_01.png`, alt: '청라국제도시역 → 마곡나루역 — 공항철도·9호선 직결(계획) 서울 최대 R&D 마곡업무지구' },
        { src: `${IMG}/location_route_02.png`, alt: '국제업무단지역(예정) → 강남구청역 — 7호선 청라연장선(예정) 강남권역 환승 없이' },
        { src: `${IMG}/location_route_03.png`, alt: '남청라IC → 여의도 — 경인고속국도 지하화(예정) & 신월여의지하도로' },
      ],
    },
    {
      id: 'premium',
      navLabel: '프리미엄',
      kicker: 'PREMIUM',
      stamp: '분양가상한제',
      title: '정점을 넘어 완성된 라이프',
      highlight: '정점',
      sub: '교통 네트워크 · 브랜드타운 · 오션뷰&시티뷰 · 교육 · 생활특권 · 희소가치',
      grad: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
      images: [
        { src: `${IMG}/premium_school.jpg`, alt: '청라 아크원 푸르지오 교육 프리미엄 — 단지 앞 안전한 통학길, 도보 약 5분 초교 신설(예정)' },
        { src: `${IMG}/premium_school_street.jpg`, alt: '청라 아크원 푸르지오 통학로 — 경연초·중교 · 청라달튼외국인학교 도보거리' },
        { src: `${IMG}/premium_traffic.jpg`, alt: '청라 아크원 푸르지오 교통 프리미엄 — 경인고속도로 지하화(예정) 서울을 더 빠르게' },
      ],
    },
    {
      id: 'subscription',
      navLabel: '청약안내',
      kicker: 'INFORMATION',
      stamp: '청약 11/2 예정',
      title: '청약 안내 · 변경된 청약제도',
      highlight: '청약 안내',
      sub: '입주자모집공고 10/22 예정 · 인터넷 청약 11/2 예정 · 당첨자 발표 11/10 예정',
      grad: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
      images: [
        { src: `${IMG}/subscription_change.jpg`, alt: '청라 아크원 푸르지오 변경된 청약제도 안내' },
        { src: `${IMG}/subscription_normal.jpg`, alt: '청라 아크원 푸르지오 일반공급 청약 안내' },
        { src: `${IMG}/subscription_special.jpg`, alt: '청라 아크원 푸르지오 특별공급 청약 안내' },
      ],
    },
  ],

  // 공식 홈페이지(티저)에 평면도 미공개 (모집공고 10/22 예정) → 공개 후 추가
  unitPlans: [],

  faq: [
    { q: '청라 아크원 푸르지오 위치는 어디인가요?', a: '인천광역시 서구 청라동 86-1번지 일원, 청라국제업무단지 M5블록입니다. 청라 피크원 푸르지오(B1블록)와 나란히 위치합니다.' },
    { q: '모델하우스(견본주택)는 언제, 어디서 오픈하나요?', a: '인천광역시 서구 청라동 87-1번지(청라 피크원 1차 모델하우스 자리)에서 10월 30일 오픈 예정입니다. 홍보관은 중봉대로586번길 19 홍익파크 1층 108·109호입니다. 방문 전 1668-5257로 예약하시면 대기 없이 상담받으실 수 있습니다.' },
    { q: '입주자모집공고와 청약 일정은 어떻게 되나요?', a: '입주자모집공고 10월 22일 예정, 인터넷 청약 접수 11월 2일 예정, 당첨자 발표 11월 10일 예정입니다. 일정은 변경될 수 있으며 관심고객 등록 시 확정 일정을 우선 안내해 드립니다.' },
    { q: '분양가상한제가 적용되나요? 규제지역인가요?', a: '아파트 868세대는 분양가상한제가 적용되며, 인천 서구는 비규제지역입니다. 오피스텔 987실은 상한제 미적용으로 별도 분양됩니다. 분양가는 입주자모집공고에서 확정됩니다.' },
    { q: '세대 규모와 타입은 어떻게 되나요?', a: '지하 5층~지상 49층, 6개 동, 총 1,855세대(아파트 868세대 + 오피스텔 987실)입니다. 아파트는 전용 84㎡(A·B·C·D) 620세대와 103㎡ 248세대, 오피스텔은 전용 105·121·136㎡입니다.' },
    { q: '주변 개발호재는 무엇인가요?', a: '스타필드 청라·돔구장, 7호선·9호선 연장, 의료복합타운(아산병원), 하나금융타운, 로봇랜드, 영상문화단지, 코스트코, 외국인 국제학교 등 풍부한 개발호재가 있습니다. 세부 추진 단계(예정·계획)는 상담 시 안내드립니다.' },
    { q: '입주 예정일은 언제인가요?', a: '2031년 입주 예정입니다. 세부 일정은 입주자모집공고를 확인해 주세요.' },
  ],

  location: {
    image: `${IMG}/contact_site.jpg`,
    imageAlt: '청라 아크원 푸르지오 오시는길 — 현장(청라동 86-1) · 견본주택(청라동 87-1) 약도',
    siteAddress: '인천광역시 서구 청라동 86-1번지 일원 (청라국제업무단지 M5블록)',
    siteNaverUrl: 'https://naver.me/xSBYFSR0',
    siteKakaoUrl: 'https://kko.to/27AvJsaNys',
    modelhouseAddress: '인천광역시 서구 청라동 87-1번지 (청라 피크원 1차 모델하우스 자리) · 10/30 오픈 예정',
    modelhouseNaverUrl: 'https://naver.me/xNpQLQ3L',
    modelhouseKakaoUrl: 'https://kko.to/06V9ttVXOK',
  },

  footer: {
    companyName: '청라 아크원 푸르지오 분양홍보관',
    lines: ['시행 ㈜청라스마트시티　|　시공 ㈜대우건설　|　사업지 인천광역시 서구 청라동 86-1 (M5블록)'],
    disclaimer:
      '※ 본 홈페이지에 사용된 CG, 지역도, 일러스트 및 각종 이미지는 소비자의 이해를 돕기 위해 제작된 것으로 실제와 다를 수 있으며, 일부 이미지는 AI로 제작되었습니다.\n' +
      '※ 본 홈페이지에 표기된 개발계획(예정·계획)은 관계기관 및 지자체의 사정에 따라 변경, 지연, 취소될 수 있습니다. 분양가·일정 등은 입주자모집공고를 기준으로 하며, 자세한 사항은 상기 번호로 문의하시기 바랍니다.',
  },

  seo: {
    title: '청라 아크원 푸르지오 | 분양가상한제 868세대 분양안내',
    description:
      '인천 서구 청라국제업무단지 M5블록, 대우건설 시공 청라 아크원 푸르지오. 아파트 868세대 분양가상한제·비규제, 전용 84·103㎡, 총 1,855세대. 입주자모집공고 10/22 예정, 청약 11/2 예정. 견본주택·청약 일정 안내, 사전 관심고객 등록.',
    keywords: ['청라 아크원 푸르지오', '청라아크원푸르지오', '청라 푸르지오 분양', '청라국제업무단지 아파트', '인천 서구 분양', '청라 분양가상한제', '청라 신규분양 2026', '대우건설 청라', '청라 M5블록', '청라 아크원 모델하우스'],
    ogImage: `${IMG}/hero.jpg`,
  },

  structured: {
    alternateNames: ['청라아크원푸르지오', '아크원푸르지오', '청라아크원', '청라푸르지오', '청라국제업무단지푸르지오', 'ARKONE PRUGIO'],
    description:
      '청라 아크원 푸르지오 — 인천 서구 청라국제업무단지 M5블록 지하 5층~지상 49층 6개 동 1,855세대(아파트 868세대 분양가상한제 + 오피스텔 987실). 대우건설 시공, 입주자모집공고 10/22 예정, 청약 11/2 예정. 견본주택 청라동 87-1.',
    units: 1855,
    address: { street: '청라동 86-1번지 일원', locality: '인천광역시 서구', region: '인천광역시' },
    modelhouse: { street: '청라동 87-1번지', locality: '인천광역시 서구', region: '인천광역시' },
    floorPlans: [
      { name: '84㎡A 타입', area: 84, rooms: 3 },
      { name: '84㎡B 타입', area: 84, rooms: 3 },
      { name: '84㎡C 타입', area: 84, rooms: 3 },
      { name: '84㎡D 타입', area: 84, rooms: 3 },
      { name: '103㎡ 타입', area: 103, rooms: 4 },
    ],
    features: ['아파트 868세대 분양가상한제', '비규제지역 인천 서구', '7호선·9호선 연장', '스타필드 청라 · 돔구장', '청라 피크원 푸르지오 브랜드타운'],
  },

  // ponytail: 마케팅 baseline — 오너가 정할 값(화서역과 동일 임시값).
  reserveBaseline: 100,
  flags: { fraudGate: false, liveRequests: true, eventPopup: true, reserveCounter: true },
}

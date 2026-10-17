// 병점역 오산 헤리티지 자이(오산헤리티지자이 1·2단지) — 템플릿 설정
// 출처: docs/landing-pilot/osan-heritage-xi/data.json + 00-구인공고-원문요약.md §2 (공고 문구 그대로 사용) + 공식 홈페이지(xi.co.kr/osxi) 프리미엄 문구
// 이미지: 공식 홈페이지 원본 → public/uploads/landing/osan-heritage-xi/ (images.md 참고)
import type { TplSiteConfig } from './types'

const IMG = '/uploads/landing/osan-heritage-xi'
const NAME = '오산헤리티지자이'
const TITLE = '병점역 오산 헤리티지 자이'

export const OSAN_HERITAGE_XI: TplSiteConfig = {
  slug: 'osan-heritage-xi',
  name: NAME,
  nameEn: 'BYEONGJEOM STATION · OSAN HERITAGE XI',
  subtitle: '동탄 생활권 · 병점역 도보 15분 · GS건설 자이 1,783세대 · 선착순 동·호 지정 계약 중',
  phone: '1661-1783',
  colors: { primary: '#1F2A44', accent: '#C9A96E' },

  hero: {
    image: `${IMG}/hero.jpg`,
    alt: '병점역 오산 헤리티지 자이 조감도 — 오산시 양산동 양산4지구 GS건설 자이 1,783세대 (동탄 생활권)',
    kicker: 'OSAN · YANGSAN 4 DISTRICT · DONGTAN LIVING AREA',
    title: TITLE,
    subtitle: '동탄 생활권 · 병점역 도보 15분 · GS건설 자이 22개 동 1,783세대',
    chips: ['선착순 동·호 지정 계약 중', '계약금 5% · 1차 500만원', '병점역 도보 15분', '동탄 생활권', '2029년 9월 입주 예정'],
  },

  stats: [
    { value: 1783, unit: '세대', label: '1단지 1,069 + 2단지 714 · 22개 동' },
    { value: '75~166', unit: '㎡', label: '전용 75 · 84 · 102 · 124 · 166P' },
    { value: 27, unit: '층', label: '지하 2층~지상 27층' },
    { value: 5, unit: '', suffix: '%', label: '계약금 (1차 계약금 500만원)' },
  ],

  facts: [
    { icon: 'subway', n: '병점역', l: '1호선 · 도보 15분' },
    { icon: 'building', n: '1,783세대', l: '22개 동 · 27층', countTo: 1783, suffix: '세대' },
    { icon: 'medal', n: 'GS건설', l: '자이 브랜드 대단지' },
    { icon: 'shield', n: '비규제', l: '전매 6개월 · 통장 불필요' },
  ],

  benefits: {
    kicker: 'BENEFIT',
    title: '선착순 동·호 지정 계약 조건',
    items: [
      '계약금 5% · 1차 계약금 500만원 정액',
      '선착순 동·호 지정 계약 (원하는 동·호·층 선택)',
      '청약통장 불필요',
      '비규제지역 · 전매제한 6개월',
      '실거주의무 없음 · 재당첨제한 없음',
      '병점역 도보 15분 · 동탄 생활권',
      '클럽 자이안 · 스카이라운지 커뮤니티',
      '2029년 9월 입주 예정',
    ],
  },

  premium: {
    kicker: 'PREMIUM 6',
    title: '병점역 오산 헤리티지 자이만의 프리미엄',
    items: [
      { title: '더 커질 병점역 미래가치', desc: 'GTX-C 병점역(예정), 동탄트램(계획) 등 내일이 더 기대되는 병점·동탄 생활권. 병점역 도보 15분, 병점역 복합환승센터 기본계획 반영.' },
      { title: '쾌속 광역 교통망', desc: '수도권 제2순환고속도로, 오산화성고속도로, 오산용인고속도로(계획) 등 광역 교통망. 서동탄역·동탄1신도시·삼성 화성캠퍼스 차량권.' },
      { title: '탁월한 교육 인프라', desc: "도보통학 가능한 양산1초(가칭, 계획)·양산중('27년 예정) 신설, 세마 중·고, 양산도서관 등 다 갖춘 교육환경. 병점·동탄 학원가 이용." },
      { title: '센트럴 그린라이프', desc: '병점복합타운 생활인프라, 단지 앞 대규모 체육공원 조성(계획). 물향기수목원·독산성 녹지 인접.' },
      { title: '다채로운 커뮤니티', desc: '클럽 자이안(피트니스·골프연습장·GX·사우나·독서실), 스카이라운지, 작은도서관 등 입주민을 위한 수준 높은 커뮤니티.' },
      { title: '완성형 新주거타운 비전', desc: '미니신도시급 新주거타운을 이끌 양산4지구 1,783세대(1BL/2BL) 대단지 프리미엄. GS건설 자이 브랜드.' },
    ],
  },

  popupSlides: [
    { key: 'firstcome', image: `${IMG}/popup/first_come.jpg`, alt: '오산헤리티지자이 선착순 동·호 지정 계약중 · 입주 전까지 계약금 5% · 1차 계약금 500만원', href: '#inquiry' },
  ],

  inquiryGift: {
    badge: 'FIRST COME · 선착순 동·호 지정 계약',
    line: '관심고객 등록 시',
    highlight: '잔여 동·호·층 · 분양가 우선 안내',
  },

  gallery: [
    {
      id: 'business',
      navLabel: '사업개요',
      kicker: 'PROJECT',
      stamp: '선착순 계약중',
      title: '양산4지구 자이 1,783세대 대단지',
      highlight: '1,783세대',
      sub: '오산헤리티지자이 1단지(1,069세대) · 2단지(714세대) · 시공 GS건설',
      grad: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
      images: [
        { src: `${IMG}/overview_1bl.jpg`, alt: '오산헤리티지자이 1단지 사업개요 — 오산시 양산동 223번지 일원 지하 2층~지상 27층 13개 동 1,069세대' },
        { src: `${IMG}/overview_2bl.jpg`, alt: '오산헤리티지자이 2단지 사업개요 — 오산시 양산동 328-2번지 일원 9개 동 714세대' },
        { src: `${IMG}/design.jpg`, alt: '오산헤리티지자이 단지설계 — 도시의 삶을 품은 자이 대단지 배치 콘셉트' },
      ],
    },
    {
      id: 'location',
      navLabel: '입지환경',
      kicker: 'LOCATION',
      stamp: '병점역 도보 15분',
      title: '병점역 생활권, 동탄 생활권',
      highlight: '병점역',
      sub: '1호선 병점역 · GTX-C 병점역(예정) · 동탄트램(계획) · 수도권 제2순환고속도로',
      grad: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)',
      images: [
        { src: `${IMG}/location.jpg`, alt: '병점역 오산 헤리티지 자이 입지환경 지도 — 병점역 · 세마역 · 서동탄역 · 동탄신도시 · 삼성 화성캠퍼스' },
        { src: `${IMG}/hero_traffic.jpg`, alt: '오산헤리티지자이 쾌속 광역 교통망 — 수도권 제2순환고속도로 · 오산화성고속도로 · 1호선 병점역' },
        { src: `${IMG}/hero_value.jpg`, alt: '오산헤리티지자이 더 커질 병점역 미래가치 — GTX-C 병점역(예정) · 동탄트램(계획)' },
      ],
    },
    {
      id: 'premium',
      navLabel: '프리미엄',
      kicker: 'PREMIUM',
      stamp: 'GS건설 자이',
      title: '자이답게 빛나는 프리미엄',
      highlight: '프리미엄',
      sub: '병점역 미래가치 · 광역 교통망 · 교육 · 그린라이프 · 커뮤니티 · 新주거타운',
      grad: 'linear-gradient(135deg, #b91c1c 0%, #f97316 100%)',
      images: [
        { src: `${IMG}/premium.jpg`, alt: '오산헤리티지자이 프리미엄 6 — 병점역 미래가치 · 광역 교통망 · 교육 인프라 · 센트럴 그린라이프 · 커뮤니티 · 新주거타운' },
        { src: `${IMG}/hero_education.jpg`, alt: "오산헤리티지자이 탁월한 교육 인프라 — 양산1초(가칭, 계획) · 양산중('27년 예정) 도보통학" },
        { src: `${IMG}/hero_life.jpg`, alt: '오산헤리티지자이 센트럴 그린라이프 — 단지 앞 대규모 체육공원 조성(계획)' },
      ],
    },
    {
      id: 'complex',
      navLabel: '단지안내',
      kicker: 'SITE PLAN',
      stamp: '22개 동 1,783세대',
      title: '단지 배치 · 커뮤니티 안내',
      highlight: '단지 배치',
      sub: '1·2단지 배치도 · 클럽 자이안 · 클럽 클라우드 · 시스템',
      grad: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)',
      images: [
        { src: `${IMG}/layout_1bl.jpg`, alt: '오산헤리티지자이 1단지 단지배치도 — 13개 동 1,069세대' },
        { src: `${IMG}/layout_2bl.jpg`, alt: '오산헤리티지자이 2단지 단지배치도 — 9개 동 714세대' },
        { src: `${IMG}/cloud_01.jpg`, alt: '오산헤리티지자이 클럽 클라우드 — 스카이라운지 · 클럽 자이안 커뮤니티' },
      ],
    },
    {
      id: 'schedule',
      navLabel: '분양안내',
      kicker: 'GUIDE',
      stamp: '선착순 동호지정',
      title: '분양 · 공급 안내',
      highlight: '공급',
      sub: '분양일정 · 공급안내(분양가) · 계약 안내문 · 모델하우스 양산동 10-10',
      grad: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
      images: [
        { src: `${IMG}/schedule.jpg`, alt: '오산헤리티지자이 분양일정 — 2026년 7월 모집공고 · 그랜드오픈 · 청약 · 정당계약, 현재 선착순 동·호 지정 계약 중' },
        { src: `${IMG}/supply_1bl.jpg`, alt: '오산헤리티지자이 1단지 공급안내 — 타입별 세대수 · 분양가' },
        { src: `${IMG}/supply_2bl.jpg`, alt: '오산헤리티지자이 2단지 공급안내 — 타입별 세대수 · 분양가' },
      ],
    },
  ],

  unitPlans: [
    { type: '75', area: '75.4736㎡', units: 91, src: `${IMG}/unitplan_75.jpg`, alt: '오산헤리티지자이 75㎡ 평면도 — 전용 75.4736㎡ 91세대' },
    { type: '84A', area: '84.9796㎡', units: 509, src: `${IMG}/unitplan_84a.jpg`, alt: '오산헤리티지자이 84㎡A 평면도 — 전용 84.9796㎡ 509세대' },
    { type: '84B', area: '84.9665㎡', units: 436, src: `${IMG}/unitplan_84b.jpg`, alt: '오산헤리티지자이 84㎡B 평면도 — 전용 84.9665㎡ 436세대' },
    { type: '84C', area: '84.8237㎡', units: 446, src: `${IMG}/unitplan_84c.jpg`, alt: '오산헤리티지자이 84㎡C 평면도 — 전용 84.8237㎡ 446세대' },
    { type: '84D', area: '84.9708㎡', units: 88, src: `${IMG}/unitplan_84d.jpg`, alt: '오산헤리티지자이 84㎡D 평면도 — 전용 84.9708㎡ 88세대 (1단지)' },
    { type: '102', area: '102.6201㎡', units: 140, src: `${IMG}/unitplan_102.jpg`, alt: '오산헤리티지자이 102㎡ 평면도 — 전용 102.6201㎡ 140세대' },
    { type: '124', area: '124.8692㎡', units: 68, src: `${IMG}/unitplan_124.jpg`, alt: '오산헤리티지자이 124㎡ 평면도 — 전용 124.8692㎡ 68세대' },
    { type: '166P', area: '166.2309㎡', units: 5, src: `${IMG}/unitplan_166p.jpg`, alt: '오산헤리티지자이 166㎡P 펜트하우스 평면도 — 전용 166.2309㎡ 5세대' },
  ],

  faq: [
    { q: '병점역 오산 헤리티지 자이 위치는 어디인가요?', a: '경기도 오산시 양산동 223번지 일원(1단지)·328-2번지 일원(2단지), 양산4지구입니다. 1호선 병점역 도보 15분, 동탄 생활권입니다.' },
    { q: '모델하우스(견본주택)는 어디에 있나요?', a: '경기도 오산시 양산동 10-10에 있습니다. 방문 전 분양문의 1661-1783으로 예약하시면 대기 없이 상담받으실 수 있습니다.' },
    { q: '현재 분양 진행 상황은 어떤가요?', a: '청약 및 정당계약이 완료되어 현재 선착순 동·호 지정 계약 중입니다. 원하는 동·호·층을 선택할 수 있으며, 관심고객 등록 시 잔여 동·호와 분양가를 우선 안내해 드립니다.' },
    { q: '계약 조건은 어떻게 되나요?', a: '계약금 5%, 1차 계약금 500만원 정액입니다. 비규제지역으로 청약통장이 필요 없고, 전매제한 6개월, 실거주의무·재당첨제한이 없습니다. 세부 조건은 상담 시 안내드립니다.' },
    { q: '세대 규모와 타입은 어떻게 되나요?', a: '지하 2층~지상 27층, 22개 동, 총 1,783세대(1단지 1,069세대·2단지 714세대)이며 전용 75㎡, 84㎡(A·B·C·D), 102㎡, 124㎡, 166㎡P 8개 타입으로 구성됩니다.' },
    { q: '커뮤니티 시설은 무엇이 있나요?', a: '클럽 자이안(피트니스·골프연습장·GX·사우나·독서실 등)과 스카이라운지(클럽 클라우드), 작은도서관 등 입주민을 위한 커뮤니티가 조성됩니다.' },
    { q: '입주 예정일은 언제인가요?', a: '2029년 9월 입주 예정입니다.' },
  ],

  location: {
    image: `${IMG}/contact.jpg`,
    imageAlt: '오산헤리티지자이 오시는길 — 1호선 병점역 · 1BL · 2BL · 견본주택(양산동 10-10) 약도',
    siteAddress: '경기도 오산시 양산동 223번지 일원(1단지) · 328-2번지 일원(2단지)',
    modelhouseAddress: '경기도 오산시 양산동 10-10',
  },

  footer: {
    companyName: '오산헤리티지자이 분양홍보관',
    lines: ['시행 ㈜양산사지구에스피씨 · 신탁 ㈜하나자산신탁　|　시공 GS건설㈜　|　사업지 오산시 양산동 223 · 328-2 일원'],
    disclaimer:
      '※ 본 홈페이지에 사용된 CG, 지역도, 일러스트 및 각종 이미지는 소비자의 이해를 돕기 위해 제작된 것으로 실제와 다를 수 있습니다.\n' +
      '※ 본 홈페이지에 표기된 개발계획(예정·계획)은 관계기관의 사정에 따라 변경, 지연, 취소될 수 있으며, 분양가·세대수·일정 등은 입주자모집공고를 기준으로 합니다. 자세한 사항은 상기 번호로 문의하시기 바랍니다.',
  },

  seo: {
    title: '병점역 오산 헤리티지 자이 | 동탄 생활권 자이 1,783세대 선착순 동호지정',
    description:
      'GS건설 오산헤리티지자이 1·2단지(오산 양산동, 동탄 생활권, 병점역 도보 15분) 선착순 동·호 지정 계약 중. 계약금 5%·1차 500만원, 청약통장 불필요, 전매 6개월, 2029년 9월 입주 예정. 전용 75·84·102·124㎡. 모델하우스 양산동 10-10.',
    keywords: ['오산헤리티지자이', '오산 헤리티지 자이', '병점역 자이', '병점역 오산 헤리티지 자이', '오산 양산동 아파트', '양산4지구', '오산 자이 분양', '병점 신축 아파트', 'GS건설 오산', '오산 선착순 분양', '동탄 생활권 아파트'],
    ogImage: `${IMG}/hero.jpg`,
  },

  structured: {
    alternateNames: ['병점역오산헤리티지자이', '오산 헤리티지 자이', '병점역자이', '오산자이', '양산동자이', '헤리티지자이'],
    description:
      '병점역 오산 헤리티지 자이(오산헤리티지자이 1·2단지) — 오산시 양산동 양산4지구 지하 2층~지상 27층 22개 동 1,783세대 GS건설 자이. 동탄 생활권, 병점역 도보 15분, 선착순 동·호 지정 계약 중. 모델하우스 양산동 10-10.',
    units: 1783,
    address: { street: '양산동 223번지 일원', locality: '오산시', region: '경기도' },
    modelhouse: { street: '양산동 10-10', locality: '오산시', region: '경기도' },
    floorPlans: [
      { name: '75㎡ 타입', area: 75, rooms: 3 },
      { name: '84㎡A 타입', area: 84, rooms: 4 },
      { name: '84㎡B 타입', area: 84, rooms: 4 },
      { name: '84㎡C 타입', area: 84, rooms: 4 },
      { name: '84㎡D 타입', area: 84, rooms: 4 },
      { name: '102㎡ 타입', area: 102, rooms: 4 },
      { name: '124㎡ 타입', area: 124, rooms: 4 },
      { name: '166㎡P 타입', area: 166, rooms: 4 },
    ],
    features: ['병점역 도보 15분 · 동탄 생활권', 'GS건설 자이 1,783세대', '선착순 동·호 지정 · 계약금 5%', '비규제 · 전매 6개월 · 통장 불필요', '클럽 자이안 · 스카이라운지'],
  },

  // ponytail: 마케팅 baseline — 오너가 정할 값(화서역과 동일 임시값).
  reserveBaseline: 100,
  flags: { fraudGate: false, liveRequests: true, eventPopup: false, reserveCounter: true },
}

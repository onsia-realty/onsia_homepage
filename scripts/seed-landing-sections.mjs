import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_CRM_URL,
  process.env.SUPABASE_CRM_SERVICE_ROLE_KEY,
  { db: { schema: 'landing' } }
)

// 야목역 서희스타힐스 그랜드힐 — SEO 본문 sections
const yamokSections = [
  {
    id: 'seo-overview',
    type: 'info',
    order: 0,
    title: '야목역 서희스타힐스 그랜드힐 사업개요',
    content: `
<p><strong>야목역 서희스타힐스 그랜드힐</strong>은 경기도 화성시 비봉면 구포리 614-18번지 일원 비봉택지지구에 들어서는 <strong>998세대 규모의 신축 아파트</strong>입니다. 수인분당선 야목역 도보권에 위치하며, GTX-F 노선(예정) 호재로 더블역세권의 미래가치를 갖춘 단지입니다.</p>
<ul>
  <li><strong>단지 위치:</strong> 경기도 화성시 비봉면 구포리 614-18번지 일원 (비봉택지지구)</li>
  <li><strong>총 세대수:</strong> 998세대</li>
  <li><strong>주택 형태:</strong> 전용면적 59㎡A·B·C, 84㎡A·B 두 가지 평형</li>
  <li><strong>입주 예정:</strong> 2028년 (예정)</li>
  <li><strong>분양 형식:</strong> 일반분양 + 관심고객 등록 운영</li>
</ul>
<p>견본주택은 방문예약제로 상시 운영 중이며, 360° E-모델하우스 VR을 통해 59㎡A·84㎡B 두 타입을 사전에 미리 체험할 수 있습니다.</p>
    `.trim(),
  },
  {
    id: 'seo-location',
    type: 'info',
    order: 1,
    title: '야목역 서희스타힐스 그랜드힐 입지환경',
    content: `
<p><strong>야목역 서희스타힐스 그랜드힐 입지</strong>는 수인분당선 야목역을 중심으로 한 더블역세권 호재가 핵심입니다. 화성 비봉택지지구 내 신규 개발 단지로 광역교통망과 자연환경을 동시에 갖추고 있습니다.</p>
<h3>교통 인프라</h3>
<ul>
  <li><strong>수인분당선 야목역</strong> 도보권 단지 (역세권 입지)</li>
  <li><strong>GTX-F 야목역</strong> 정차 예정 — 강남·여의도 직결 호재</li>
  <li>봉담 IC·매송 IC 광역도로망 인접</li>
  <li>수원·안산·서울 도심 접근성 우수</li>
</ul>
<h3>주변 환경</h3>
<ul>
  <li>비봉택지지구 신규 개발로 인근 인프라 동반 성장</li>
  <li>화성 비봉면·매송면 자연환경, 학세권 형성 진행 중</li>
  <li>야목역 일대 상업·생활편의시설 확충 계획</li>
</ul>
    `.trim(),
  },
  {
    id: 'seo-sales',
    type: 'info',
    order: 2,
    title: '야목역 서희스타힐스 그랜드힐 분양정보',
    content: `
<p><strong>야목역 서희스타힐스 그랜드힐 분양</strong>은 998세대 규모 일반분양으로 진행되며, 견본주택 방문 전 사전예약과 360° VR 체험을 통해 충분한 정보 확인이 가능합니다.</p>
<h3>분양 안내</h3>
<ul>
  <li><strong>분양 문의:</strong> 1668-5257 (방문예약 / 분양 상담)</li>
  <li><strong>모델하우스:</strong> 방문예약제 상시 운영</li>
  <li><strong>E-모델하우스 VR:</strong> 59㎡A · 84㎡B 360° 사전 체험</li>
  <li><strong>관심고객 등록:</strong> 분양 일정·로얄층 우선 안내</li>
</ul>
<p>야목역 서희스타힐스 그랜드힐의 평면도, 동호수 배치도, 단지 배치도, 입지 프리미엄 자료는 각 카테고리 페이지에서 상세 확인할 수 있습니다. 야목역서희 모델하우스 위치와 분양일정은 관심고객 등록 후 1:1로 안내드립니다.</p>
    `.trim(),
  },
]

// 왕십리역 어반홈스 — SEO 본문 sections
const urbanhomesSections = [
  {
    id: 'seo-overview',
    type: 'info',
    order: 0,
    title: '왕십리역 어반홈스 사업개요',
    content: `
<p><strong>왕십리역 어반홈스</strong>는 서울특별시 성동구 도선동 114번지 외 3필지에 들어서는 <strong>지하 3층 ~ 지상 13층, 1개동 총 42실 규모의 신축 오피스텔</strong>입니다. 왕십리역 도보 2분 초역세권 입지로 서울 동북권 교통의 중심에 자리잡고 있습니다.</p>
<ul>
  <li><strong>단지 위치:</strong> 서울특별시 성동구 도선동 114번지 외 3필지</li>
  <li><strong>건물 규모:</strong> 지하 3층 ~ 지상 13층, 1개동</li>
  <li><strong>오피스텔 실수:</strong> 총 42실 (A·B동)</li>
  <li><strong>입주 시기:</strong> 2025년 12월 (B동), 순차 입주</li>
  <li><strong>분양 특징:</strong> 주택수 미포함 / 실거주의무 없음 / 다주택자 중과 없음</li>
</ul>
<p>토지거래허가 NO, 자금조달계획 NO로 규제로부터 자유로운 도심 오피스텔 투자처입니다.</p>
    `.trim(),
  },
  {
    id: 'seo-location',
    type: 'info',
    order: 1,
    title: '왕십리역 어반홈스 입지환경',
    content: `
<p><strong>왕십리역 어반홈스 입지</strong>의 핵심은 <strong>4중 환승 쿼드러플 역세권</strong>입니다. 현재 4개 노선이 교차하며, GTX-C(예정) 신설 시 6개 노선 헥사 역세권으로 발전합니다.</p>
<h3>왕십리역 환승 노선</h3>
<ul>
  <li><strong>지하철 2호선</strong> — 강남·삼성·홍대 방면</li>
  <li><strong>지하철 5호선</strong> — 광화문·여의도 방면</li>
  <li><strong>수인분당선</strong> — 잠실·판교 방면</li>
  <li><strong>경의중앙선</strong> — 용산·일산 방면</li>
  <li><strong>GTX-C(예정)</strong> — 헥사 역세권 완성 호재</li>
</ul>
<h3>주요 업무지구 접근성</h3>
<ul>
  <li>강남·종로·여의도·성수·잠실 30분 내 도달</li>
  <li>왕십리민자역사 복합쇼핑·문화시설 도보권</li>
  <li>한양대·왕십리뉴타운·성수동 카페거리 생활권</li>
</ul>
    `.trim(),
  },
  {
    id: 'seo-sales',
    type: 'info',
    order: 2,
    title: '왕십리역 어반홈스 분양정보',
    content: `
<p><strong>왕십리역 어반홈스 분양</strong>은 1·2인 가구 실수요와 도심 오피스텔 투자자를 동시에 겨냥한 분양가 5억대 상품입니다. 무순위 청약과 잔여세대 분양이 순차적으로 진행됩니다.</p>
<h3>분양 핵심 포인트</h3>
<ul>
  <li><strong>분양가:</strong> 5억대~ (타입·층별 상이)</li>
  <li><strong>규제 혜택:</strong> 토지거래허가 NO · 자금조달계획 NO</li>
  <li><strong>세제 혜택:</strong> 주택수 미포함 · 다주택자 중과 없음 · 실거주의무 없음</li>
  <li><strong>청약 자격:</strong> 만 19세 이상 누구나 청약 가능</li>
  <li><strong>분양 문의:</strong> 1668-5257 (방문상담 / 분양가·평면 안내)</li>
</ul>
<p>왕십리역 어반홈스 평면도, UNIT VR, SKY VR, 커뮤니티 시설, 프리미엄 입지 정보는 각 카테고리 페이지에서 상세 확인할 수 있으며, 무료 상담예약을 통해 1:1 컨설팅이 가능합니다.</p>
    `.trim(),
  },
]

const updates = [
  { slug: 'yamok-grandhill', sections: yamokSections },
  { slug: 'urbanhomes', sections: urbanhomesSections },
]

for (const u of updates) {
  const { error } = await supabase
    .from('pages')
    .update({ sections: u.sections })
    .eq('slug', u.slug)

  if (error) {
    console.log(`❌ ${u.slug}:`, error.message)
  } else {
    const totalChars = u.sections.reduce((sum, s) => sum + (s.content?.length || 0), 0)
    console.log(`✅ ${u.slug}: ${u.sections.length}개 섹션 / 총 ${totalChars}자 추가`)
  }
}

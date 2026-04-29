/**
 * 야목역 서희스타힐스 그랜드힐 랜딩페이지 데이터 삽입/업데이트
 * 참조 사이트: https://www.xn--2i0bs4kloch9d4zkhlca439cd3a150f0iqomae.com/
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_CRM_URL
const SUPABASE_KEY = process.env.SUPABASE_CRM_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('필수 환경변수 누락: NEXT_PUBLIC_SUPABASE_CRM_URL, SUPABASE_CRM_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: 'landing' },
  auth: { autoRefreshToken: false, persistSession: false }
})

const REF = 'https://www.xn--2i0bs4kloch9d4zkhlca439cd3a150f0iqomae.com'

const HERO_IMAGE = `${REF}/img/main/section01_bg_n2.jpg?new`

// 참조 사이트 페이지별 핵심 컨텐츠 이미지를 순서대로 gallery로 구성
const GALLERY = [
  // 사업안내
  `${REF}/img/sub/business_n4.png`,        // 사업개요
  `${REF}/img/sub/premium_n4.png`,         // 입지 프리미엄
  `${REF}/img/sub/brand_n.jpg`,            // 브랜드소개
  `${REF}/img/sub/location_n4.png`,        // 오시는길

  // 분양안내
  `${REF}/img/sub/schedule.png`,           // 분양일정
  `${REF}/img/sub/info03_n.png`,           // 공급안내
  `${REF}/img/sub/apply.png`,              // 모집공고

  // 청약안내
  `${REF}/img/sub/ssp_guide_n.png`,        // 청약안내

  // 단지안내
  `${REF}/img/sub/cpx_layout_n2.png`,      // 단지배치도
  `${REF}/img/sub/no_layout.png`,          // 동호수배치도

  // 세대안내 (평면)
  `${REF}/img/sub/unitplan_59a_n2.png?new`,
  `${REF}/img/sub/unitplan_59b_n2.png?new`,
  `${REF}/img/sub/unitplan_59c_n2.png?new`,
  `${REF}/img/sub/unitplan_84a_n2.png?new`,
  `${REF}/img/sub/unitplan_84b_n2.png?new`,

  // 마감재 / 옵션
  `${REF}/img/sub/interior.png`,
  `${REF}/img/sub/option.png`,
]

const PAGE_DATA = {
  slug: 'yamok-grandhill',
  project_name: '야목역 서희스타힐스 그랜드힐',
  subtitle: '새로운 화성 비봉 프리미엄, 야목역세권 브랜드타운 첫자리',
  developer: '서희건설',
  location: '경기도 화성시 비봉면 구포리 614-18번지 일원',
  total_units: null,
  move_in_date: null,
  phone_number: '1551-2148',
  homepage_url: `${REF}/`,
  hero_image: HERO_IMAGE,
  logo_image: `${REF}/img/footer_logo.png`,
  gallery: GALLERY,
  sections: [],
  // 서희스타힐스 브랜드 청록/그린 톤
  primary_color: '#127a6e',
  accent_color: '#f3d653',
  seo_title: '야목역 서희스타힐스 그랜드힐 | 화성 비봉 GTX-F 예정 분양',
  seo_description: '수인분당선 야목역 + GTX-F(예정) 더블역세권. 야목역세권 브랜드타운 첫자리 야목역 서희스타힐스 그랜드힐. 관심고객 등록 및 분양 상담.',
  seo_keywords: '야목역,서희스타힐스,그랜드힐,화성분양,비봉분양,야목역분양,GTX-F,수인분당선',
  og_image: HERO_IMAGE,
  is_published: true,
  youtube_id: null,
  kakao_chat_url: null,        // 메인은 비움 (어반홈스 패턴), agent 추가 시 직원별 부여
  show_bottom_bar: true,
  business_info: {
    company_name: '야목역 서희스타힐스 그랜드힐 홍보관',
    address: '견본주택: 경기도 안산시 단원구 광덕4로 178 / 현장: 경기도 화성시 비봉면 구포리 614-18번지 일원',
    disclaimer:
      '본 홈페이지에 사용된 CG, 사진, 일러스트 등은 소비자의 이해를 돕기 위한 것으로 실제와 차이가 있을 수 있습니다.\n' +
      '본 홈페이지에 표기된 사항은 인허가 및 건축허가 변경 승인에 따라 변경될 수 있으며, 자세한 사항은 대표번호로 문의하시기 바랍니다.',
  },
}

async function main() {
  console.log('=== 야목역 서희스타힐스 그랜드힐 랜딩페이지 입력 ===\n')

  const { data: existing } = await supabase
    .from('pages')
    .select('id, updated_at')
    .eq('slug', PAGE_DATA.slug)
    .maybeSingle()

  if (existing) {
    console.log('기존 row 발견 → 업데이트 진행 (id:', existing.id, ')')
    const { error } = await supabase
      .from('pages')
      .update(PAGE_DATA)
      .eq('slug', PAGE_DATA.slug)
    if (error) { console.error('❌ 업데이트 실패:', error.message); process.exit(1) }
    console.log('✅ 업데이트 완료')
  } else {
    console.log('새 row 생성')
    const { data, error } = await supabase
      .from('pages')
      .insert(PAGE_DATA)
      .select('id, slug')
      .single()
    if (error) { console.error('❌ insert 실패:', error.message); process.exit(1) }
    console.log('✅ 생성 완료:', data)
  }

  // 검증
  const { data: verify } = await supabase
    .from('pages')
    .select('slug, project_name, gallery')
    .eq('slug', PAGE_DATA.slug)
    .single()
  console.log(`\n📊 검증: ${verify.project_name} / gallery ${verify.gallery.length}장`)
  console.log(`🔗 URL: http://localhost:3000/${verify.slug}`)
  console.log(`🔗 카드 노출: http://localhost:3000/homepage`)
}

main().catch(e => { console.error(e); process.exit(1) })

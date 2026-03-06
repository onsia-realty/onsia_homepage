/**
 * 왕십리역 어반홈스 랜딩페이지 데이터 삽입
 * 원본: https://www.왕십리역어반홈스.kr/
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEW_SUPABASE_URL || 'https://uwddeseqwdsryvuoulsm.supabase.co'
const SUPABASE_KEY = process.env.NEW_SUPABASE_KEY

if (!SUPABASE_KEY) {
  console.error('필수 환경변수 누락: NEW_SUPABASE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: 'landing' },
  auth: { autoRefreshToken: false, persistSession: false }
})

const W = 'https://static.wixstatic.com/media'

// Wix 이미지 URL (w_1200 품질로 통일)
const img = (id, ext, name) => `${W}/${id}~mv2.${ext}/v1/fill/w_1200,q_90/${encodeURIComponent(name)}.${ext}`
const gif = (id) => `${W}/${id}~mv2.gif`

const HERO_IMAGE = img('a5ff46_a210481ad97a446898c9c6c54a0378cb', 'jpg', '프리미엄')

const GALLERY_IMAGES = [
  // 히어로/역세권
  img('a5ff46_a3d9eb75fbac49cb872fdab4adaafdbd', 'png', '역사'),
  gif('a5ff46_9b626c081130444aa21e6ce0d1b5940f'),
  gif('a5ff46_b8046c2cbff54b8c87e8ce13dba6b2cc'),
  // 사업개요
  img('9fe6d7_6192fc1a4dfa4f9aab8827a4ed6bf1b4', 'jpg', 'business01'),
  img('a5ff46_8e5ea9fefbf042e2b22767a833270869', 'png', '제목 없음-1'),
  // 프리미엄
  img('a5ff46_037da5b7e9cf4a1c8f6f798809049a97', 'png', '프리미엄1'),
  img('a5ff46_83e950ce03604c3fa8a612e5b4fe0d33', 'png', '프리미엄2'),
  img('a5ff46_897772a1eba34883a008dbbaea1a90e2', 'png', '프리미엄3'),
  img('a5ff46_6ff05874f34144f0bb5632d5041235fc', 'png', '프리미엄4'),
  // 그래프/투자
  img('a5ff46_d1c1563d8379438791f4d18e0d43c4ca', 'webp', '자산 1그래프'),
  img('a5ff46_f812bd859dcb4fe1abccd552a8ec6ea0', 'webp', '비조명 플렉스'),
  // 입지환경
  img('a5ff46_ba376e811844488198d150acfb72d9c4', 'png', '대지 9'),
  img('a5ff46_1f7f65e72b844b9aa8975241e86c68b8', 'png', '자산 41s'),
  // 동호수배치도
  img('9fe6d7_568f99d44fab46f1b5c6b50e6c405021', 'jpg', 'layout'),
  // A동 평면도
  img('9fe6d7_70b43396898e4313af1ae852ea129979', 'jpg', 'unit01'),
  img('9fe6d7_4e8e6233b0a1445b9b064db2b5973d83', 'jpg', 'unit02'),
  img('9fe6d7_d731df3d28144b9ebc0fa0bcf01727a1', 'jpg', 'unit03'),
  img('9fe6d7_cf4fb7259af147d78f8e11eb896b1c0c', 'jpg', 'unit04'),
  img('9fe6d7_6cd53e4b1b9f48c2adb16504ced95ff7', 'jpg', 'unit05'),
  img('9fe6d7_6a58ae345e9b431ca32d8c89b3fb6bd7', 'jpg', 'unit06'),
  // B동 평면도
  img('9fe6d7_ac51431374254d92a2f6de58726afb05', 'jpg', 'B_unit01'),
  img('9fe6d7_ddbd20b52c8142fdb245e6553f8acb92', 'jpg', 'B_unit02'),
  img('9fe6d7_9030d00ee66742f7a2f11d453efbf9be', 'jpg', 'B_unit03'),
  img('9fe6d7_d49982661d824c86b856aae15378902a', 'jpg', 'B_unit04'),
  img('9fe6d7_1df07a7f74924526840cab9ef83759cb', 'jpg', 'B_unit05'),
  img('9fe6d7_d9036e9ae00c4ba1b90808b960a38702', 'jpg', 'B_unit06'),
]

const PAGE_DATA = {
  slug: 'wangsimni-urbanhomes',
  project_name: '왕십리역 어반홈스',
  subtitle: '현재는 쿼드러플, 미래는 헥사 역세권',
  developer: '시행수탁: 교보자산신탁(주) / 시공: 대건산업건설(주)',
  location: '서울특별시 성동구 도선동 114 외 3필지',
  total_units: null,
  move_in_date: null,
  phone_number: '1668-1252',
  homepage_url: 'https://www.xn--oy2bi8bx5ijis6j0j9x343h.kr/',
  hero_image: HERO_IMAGE,
  logo_image: img('a5ff46_56caa0d0504644d8a470d30abab4b068', 'png', '자산 3로고'),
  gallery: GALLERY_IMAGES,
  sections: [],
  primary_color: '#1a1a2e',
  accent_color: '#c8a97e',
  seo_title: '왕십리역 어반홈스 | 교통의 중심 왕십리역 초역세권',
  seo_description: '서울 성동구 왕십리역 초역세권 어반홈스. 쿼드러플 역세권, 미래 헥사 역세권. 관심고객 등록 및 분양 상담.',
  seo_keywords: '왕십리역,어반홈스,성동구,도선동,역세권,분양',
  og_image: HERO_IMAGE,
  is_published: true,
  youtube_id: null,
  kakao_chat_url: null,
  show_bottom_bar: true,
  business_info: {
    company_name: '왕십리역 어반홈스',
    registration_number: '542-81-01235',
    address: '분양대행사: (주)태성개발',
    disclaimer: '홈페이지에 사용된 CG, 그래픽, 이미지컷 등은 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다. 단지 인근 각종 개발계획 및 도로 등의 기반시설은 인·허가나 정부 시책에 따라 변경 및 취소가 가능하며 이는 시행사 및 시공사와 무관합니다.'
  },
}

async function main() {
  console.log('=== 왕십리역 어반홈스 랜딩페이지 데이터 삽입 ===\n')

  const { data: existing } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', PAGE_DATA.slug)
    .single()

  if (existing) {
    console.log('기존 레코드 발견 - 업데이트 진행')
    const { error } = await supabase
      .from('pages')
      .update(PAGE_DATA)
      .eq('slug', PAGE_DATA.slug)
    if (error) { console.error('업데이트 실패:', error.message); process.exit(1) }
    console.log('업데이트 완료! ID:', existing.id)
  } else {
    console.log('신규 레코드 삽입')
    const { data, error } = await supabase
      .from('pages')
      .insert(PAGE_DATA)
      .select('id, slug')
      .single()
    if (error) { console.error('삽입 실패:', error.message); process.exit(1) }
    console.log('삽입 완료! ID:', data.id, 'Slug:', data.slug)
  }

  const { data: verify } = await supabase
    .from('pages')
    .select('id, slug, project_name, show_bottom_bar, is_published')
    .eq('slug', PAGE_DATA.slug)
    .single()

  console.log('\n검증:', JSON.stringify(verify, null, 2))
  console.log(`갤러리: ${PAGE_DATA.gallery.length}장`)
  console.log(`URL: /${PAGE_DATA.slug}`)
}

main()

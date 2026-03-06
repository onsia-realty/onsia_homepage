/**
 * 클러스터용인 경남아너스빌 랜딩페이지 데이터 삽입/업데이트
 * 기존 HTML 페이지(onsiasimplehonorsville.vercel.app) → 동적 랜딩페이지 전환
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

const BASE_URL = 'https://onsiasimplehonorsville.vercel.app'

// URL-encode path (handle spaces, Korean chars, commas)
function imgUrl(path) {
  const parts = path.split('/')
  const encoded = parts.map(p => encodeURIComponent(p)).join('/')
  return `${BASE_URL}/${encoded}`
}

const HERO_IMAGE = imgUrl('crawled-images/Generated Image September 21, 2025 - 2_14PM.png')

const GALLERY_IMAGES = [
  'crawled-images/image_03.jpg',
  'crawled-images/image_04.jpg',
  'crawled-images/image_05.jpg',
  'crawled-images/image_06.jpg',
  'crawled-images/양지지도.png',
  'crawled-images/image_07.png',
  'crawled-images/image_08.png',
  'crawled-images/image_09.jpg',
  'crawled-images/image_10.jpg',
  'crawled-images/image_11.jpeg',
  'crawled-images/image_12.jpg',
  'crawled-images/image_13.jpeg',
  'crawled-images/Generated Image September 21, 2025 - 2_26PM.png',
  'crawled-images/image_15.jpg',
  'crawled-images/00-2_1758429285333.jpg',
  'crawled-images/10-1_1758429285381.jpg',
  'crawled-images/19_1758429284879.jpg',
  'crawled-images/20_1758429284938.jpg',
  'crawled-images/21_1758429284989.jpg',
  'crawled-images/22_1758429285024.jpg',
  'crawled-images/23_1758429285050.jpg',
  'crawled-images/24_1758429285080.jpg',
  'crawled-images/25_1758429285111.jpg',
  'crawled-images/26_1758429285154.jpg',
  'crawled-images/27_1758429285197.jpg',
  'crawled-images/28_1758429285243.jpg',
  'crawled-images/29_1758429285275.jpg',
  'crawled-images/image_31.jpeg',
  'crawled-images/image_32.jpeg',
  'crawled-images/image_33.png',
  'crawled-images/image_34.jpg',
  'crawled-images/image_35.jpg',
  'crawled-images/image_36.jpeg',
  'crawled-images/image_37.png',
].map(imgUrl)

const PAGE_DATA = {
  slug: 'cluster-yongin-honorsville',
  project_name: '클러스터용인 경남아너스빌',
  subtitle: '4억대 내집 마련 마지막 기회!',
  developer: '경남기업',
  location: '경기도 용인시 처인구 양지면 양지지구',
  total_units: 6500,
  move_in_date: '2028년 예정',
  phone_number: '1668-5257',
  homepage_url: 'https://onsiasimplehonorsville.vercel.app/',
  hero_image: HERO_IMAGE,
  logo_image: null,
  gallery: GALLERY_IMAGES,
  sections: [],
  primary_color: '#1a1a2e',
  accent_color: '#d4a853',
  seo_title: '클러스터용인 경남아너스빌 | 6500세대 미니신도시 양지지구 분양',
  seo_description: '경기도 용인시 양지지구 6,500세대 미니신도시 클러스터용인 경남아너스빌. 4억대 내집 마련 마지막 기회! 관심고객 등록 및 분양 상담.',
  seo_keywords: '클러스터용인,경남아너스빌,양지지구,용인분양,6500세대,미니신도시',
  og_image: HERO_IMAGE,
  is_published: true,
  youtube_id: 'YWB5Yy6LOmg',
  kakao_chat_url: 'https://open.kakao.com/o/sen4dWJh',
  show_bottom_bar: true,
  business_info: {
    company_name: '클러스터용인 경남아너스빌 홍보관',
    disclaimer: '본 홍보물은 소비자의 이해를 돕기 위해 제작된 것으로, 개발사업의 여건 변화 등에 따라 변경될 수 있으며 이에 따른 법적 책임을 지지 않습니다. 계약 시에는 반드시 모집공고문과 계약서를 기준으로 확인하시기 바랍니다. 단지 내 조경, 외관 등은 CG 작업으로 실제와 다를 수 있습니다.'
  },
}

async function main() {
  console.log('=== 클러스터용인 경남아너스빌 랜딩페이지 데이터 삽입 ===\n')

  // Check if record exists
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

    if (error) {
      console.error('업데이트 실패:', error.message)
      process.exit(1)
    }
    console.log('업데이트 완료! ID:', existing.id)
  } else {
    console.log('신규 레코드 삽입')
    const { data, error } = await supabase
      .from('pages')
      .insert(PAGE_DATA)
      .select('id, slug')
      .single()

    if (error) {
      console.error('삽입 실패:', error.message)
      process.exit(1)
    }
    console.log('삽입 완료! ID:', data.id, 'Slug:', data.slug)
  }

  // Also delete old test data if exists
  const { data: oldRecord } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', 'gyeongnam-anusville')
    .single()

  if (oldRecord) {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('slug', 'gyeongnam-anusville')

    if (error) console.warn('이전 테스트 데이터 삭제 실패:', error.message)
    else console.log('이전 테스트 데이터(gyeongnam-anusville) 삭제 완료')
  }

  // Verify
  const { data: verify, error: verifyErr } = await supabase
    .from('pages')
    .select('id, slug, project_name, youtube_id, show_bottom_bar, is_published')
    .eq('slug', PAGE_DATA.slug)
    .single()

  if (verifyErr) console.error('검증 실패:', verifyErr.message)
  else {
    console.log('\n검증 결과:')
    console.log(JSON.stringify(verify, null, 2))
    console.log(`\n갤러리 이미지: ${PAGE_DATA.gallery.length}장`)
    console.log(`URL: /landing/${PAGE_DATA.slug}`)
  }
}

main()

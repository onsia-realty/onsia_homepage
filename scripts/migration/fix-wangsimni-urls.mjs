/**
 * 왕십리역 어반홈스 이미지 URL 수정
 * Wix 이미지 URL을 원본 사이트에서 추출한 실제 URL로 교체
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

// 원본 사이트에서 추출한 실제 이미지 URL
const HERO_IMAGE = `${W}/a5ff46_a210481ad97a446898c9c6c54a0378cb~mv2.jpg/v1/fill/w_1200,h_612,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%ED%94%84%EB%A6%AC%EB%AF%B8%EC%97%84.jpg`

const LOGO_IMAGE = `${W}/a5ff46_56caa0d0504644d8a470d30abab4b068~mv2.png/v1/fill/w_258,h_63,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%9E%90%EC%82%B0%203%EB%A1%9C%EA%B3%A0.png`

const GALLERY_IMAGES = [
  // 히어로/역세권
  `${W}/a5ff46_a3d9eb75fbac49cb872fdab4adaafdbd~mv2.png/v1/fill/w_600,h_307,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%97%AD%EC%82%AC.png`,
  `${W}/a5ff46_9b626c081130444aa21e6ce0d1b5940f~mv2.gif`,
  `${W}/a5ff46_b8046c2cbff54b8c87e8ce13dba6b2cc~mv2.gif`,
  // 사업개요
  `${W}/9fe6d7_6192fc1a4dfa4f9aab8827a4ed6bf1b4~mv2.jpg/v1/fill/w_1142,h_759,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/business01.jpg`,
  `${W}/a5ff46_8e5ea9fefbf042e2b22767a833270869~mv2.png/v1/fill/w_1142,h_379,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%A0%9C%EB%AA%A9%20%EC%97%86%EC%9D%8C-1.png`,
  // 프리미엄
  `${W}/a5ff46_037da5b7e9cf4a1c8f6f798809049a97~mv2.png/v1/fill/w_245,h_439,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%ED%94%84%EB%A6%AC%EB%AF%B8%EC%97%841.png`,
  `${W}/a5ff46_83e950ce03604c3fa8a612e5b4fe0d33~mv2.png/v1/fill/w_243,h_439,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%ED%94%84%EB%A6%AC%EB%AF%B8%EC%97%842.png`,
  `${W}/a5ff46_897772a1eba34883a008dbbaea1a90e2~mv2.png/v1/fill/w_243,h_439,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%ED%94%84%EB%A6%AC%EB%AF%B8%EC%97%843.png`,
  `${W}/a5ff46_6ff05874f34144f0bb5632d5041235fc~mv2.png/v1/fill/w_243,h_439,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%ED%94%84%EB%A6%AC%EB%AF%B8%EC%97%844.png`,
  // 그래프/투자
  `${W}/a5ff46_d1c1563d8379438791f4d18e0d43c4ca~mv2.webp/v1/fill/w_1141,h_788,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%9E%90%EC%82%B0%201%EA%B7%B8%EB%9E%98%ED%94%84.webp`,
  `${W}/a5ff46_f812bd859dcb4fe1abccd552a8ec6ea0~mv2.webp/v1/fill/w_1200,h_804,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EB%B9%84%EC%A1%B0%EB%AA%85%20%ED%94%8C%EB%A0%89%EC%8A%A4.webp`,
  // 입지환경
  `${W}/a5ff46_ba376e811844488198d150acfb72d9c4~mv2.png/v1/fill/w_1200,h_793,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EB%8C%80%EC%A7%80%209.png`,
  `${W}/a5ff46_1f7f65e72b844b9aa8975241e86c68b8~mv2.png/v1/fill/w_1238,h_119,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%9E%90%EC%82%B0%2041s.png`,
  // 동호수배치도
  `${W}/9fe6d7_568f99d44fab46f1b5c6b50e6c405021~mv2.jpg/v1/crop/x_0,y_0,w_1300,h_939/fill/w_1141,h_824,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/layout.jpg`,
  // A동 평면도
  `${W}/9fe6d7_70b43396898e4313af1ae852ea129979~mv2.jpg/v1/fill/w_1143,h_1318,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/unit01.jpg`,
  `${W}/9fe6d7_4e8e6233b0a1445b9b064db2b5973d83~mv2.jpg/v1/fill/w_1142,h_1318,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/unit02.jpg`,
  `${W}/9fe6d7_d731df3d28144b9ebc0fa0bcf01727a1~mv2.jpg/v1/fill/w_1142,h_1318,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/unit03.jpg`,
  `${W}/9fe6d7_cf4fb7259af147d78f8e11eb896b1c0c~mv2.jpg/v1/fill/w_1142,h_1318,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/unit04.jpg`,
  `${W}/9fe6d7_6cd53e4b1b9f48c2adb16504ced95ff7~mv2.jpg/v1/fill/w_1142,h_1318,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/unit05.jpg`,
  `${W}/9fe6d7_6a58ae345e9b431ca32d8c89b3fb6bd7~mv2.jpg/v1/fill/w_1142,h_1318,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/unit06.jpg`,
  // B동 평면도
  `${W}/9fe6d7_ac51431374254d92a2f6de58726afb05~mv2.jpg/v1/fill/w_1142,h_1318,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/B_unit01.jpg`,
  `${W}/9fe6d7_ddbd20b52c8142fdb245e6553f8acb92~mv2.jpg/v1/fill/w_1142,h_1318,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/B_unit02.jpg`,
  `${W}/9fe6d7_9030d00ee66742f7a2f11d453efbf9be~mv2.jpg/v1/fill/w_1142,h_1318,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/B_unit03.jpg`,
  `${W}/9fe6d7_d49982661d824c86b856aae15378902a~mv2.jpg/v1/fill/w_1142,h_1318,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/B_unit04.jpg`,
  `${W}/9fe6d7_1df07a7f74924526840cab9ef83759cb~mv2.jpg/v1/fill/w_1142,h_1318,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/B_unit05.jpg`,
  `${W}/9fe6d7_d9036e9ae00c4ba1b90808b960a38702~mv2.jpg/v1/fill/w_1142,h_1318,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/B_unit06.jpg`,
]

async function main() {
  console.log('=== 왕십리역 어반홈스 이미지 URL 수정 ===\n')

  const { error } = await supabase
    .from('pages')
    .update({
      hero_image: HERO_IMAGE,
      logo_image: LOGO_IMAGE,
      gallery: GALLERY_IMAGES,
    })
    .eq('slug', 'urbanhomes')

  if (error) {
    console.error('업데이트 실패:', error.message)
    process.exit(1)
  }

  console.log('✅ 이미지 URL 수정 완료!')
  console.log(`갤러리: ${GALLERY_IMAGES.length}장`)
}

main()

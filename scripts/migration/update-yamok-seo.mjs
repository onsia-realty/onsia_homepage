/**
 * 야목역 SEO 필드 업데이트 (네이버 검색 키워드 18종 최적화)
 *
 * 타겟 키워드:
 *  - 직접 브랜드: 야목역서희스타힐스그랜드힐, 야목역서희스타힐스, 야목역서희, 야목역서희아파트,
 *                야목역서희스타, 야목역서희스타힐스아파트, 야목역서희스타힐스모델하우스,
 *                야목역서희스타힐스위치, 야목역서희분양가, 야목역서희일반분양
 *  - 지역 (비봉): 비봉서희스타힐스, 비봉아파트, 비봉아파트분양, 비봉신축아파트
 *  - 화성 광역: 경기도화성시아파트분양, 남양아파트분양, 남양읍아파트, 봉담민간임대아파트
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_CRM_URL
const SUPABASE_KEY = process.env.SUPABASE_CRM_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: 'landing' },
  auth: { autoRefreshToken: false, persistSession: false }
})

// 네이버 SERP는 약 30자, 페이스북/카톡 OG 60자까지 표시 → 핵심 키워드 앞쪽 배치
const seo_title =
  '야목역 서희스타힐스 그랜드힐 | 야목역서희 모델하우스 · 분양가 안내'

// 네이버 description 약 155자. 검색에서 매칭되는 키워드 자연스럽게 녹여서 작성
const seo_description =
  '야목역 서희스타힐스 그랜드힐 일반분양. 수인분당선 야목역·GTX-F(예정) 더블역세권 경기도 화성시 비봉면 신축 아파트. 야목역서희 모델하우스 위치, 분양가, 비봉아파트 분양일정·관심고객 등록 1668-5257.'

// keywords는 네이버 Yeti 봇이 참고함. 검색어 그대로 + 띄어쓰기 변형 + 동의어 포함
const seo_keywords = [
  // 브랜드 직접 매칭 (10)
  '야목역서희스타힐스그랜드힐',
  '야목역서희스타힐스',
  '야목역서희',
  '야목역서희아파트',
  '야목역서희스타',
  '야목역서희스타힐스아파트',
  '야목역서희스타힐스모델하우스',
  '야목역서희스타힐스위치',
  '야목역서희분양가',
  '야목역서희일반분양',
  // 지역 (비봉, 4)
  '비봉서희스타힐스',
  '비봉아파트',
  '비봉아파트분양',
  '비봉신축아파트',
  // 화성 광역 (4)
  '경기도화성시아파트분양',
  '남양아파트분양',
  '남양읍아파트',
  '봉담민간임대아파트',
  // 띄어쓰기 변형 (네이버 토크나이저 보강)
  '야목역 서희스타힐스',
  '야목역 서희스타힐스 그랜드힐',
  '야목역 서희',
  '비봉 아파트',
  '화성 비봉 분양',
  '화성시 아파트 분양',
  // 부가 키워드
  '서희스타힐스',
  '수인분당선 야목역',
  'GTX-F 분양',
].join(', ')

const UPDATE = {
  seo_title,
  seo_description,
  seo_keywords,
}

async function main() {
  console.log('=== 야목역 SEO 업데이트 ===\n')
  console.log('seo_title:', seo_title)
  console.log('  └ 길이:', seo_title.length, '자')
  console.log('seo_description:', seo_description)
  console.log('  └ 길이:', seo_description.length, '자')
  console.log('seo_keywords (', seo_keywords.split(',').length, '개 ):')
  console.log(' ', seo_keywords)
  console.log()

  const { error } = await supabase
    .from('pages')
    .update(UPDATE)
    .eq('slug', 'yamok-grandhill')

  if (error) {
    console.error('❌ 업데이트 실패:', error.message)
    process.exit(1)
  }

  const { data: verify } = await supabase
    .from('pages')
    .select('seo_title, seo_description, seo_keywords')
    .eq('slug', 'yamok-grandhill')
    .single()

  console.log('✅ DB 반영 확인')
  console.log('  seo_title:', verify.seo_title)
  console.log('  seo_description:', verify.seo_description)
  console.log('  seo_keywords:', verify.seo_keywords)
}

main()

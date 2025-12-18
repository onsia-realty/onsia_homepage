import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hwbozwggvlvqnqylunin.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3Ym96d2dndmx2cW5xeWx1bmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMTU4ODMsImV4cCI6MjA4MTU5MTg4M30.bVka8DKTSGXvE5-Up0NBXg-suBPzBhuqcTQOHOQsLH0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔍 Supabase API 테스트 시작...\n')

// 1. auctions 테이블 조회
const { data: auctions, error: auctionsError } = await supabase
  .from('auctions')
  .select('*')
  .limit(5)

if (auctionsError) {
  console.log('❌ auctions 조회 실패:', auctionsError.message)
} else {
  console.log('✅ auctions 조회 성공!')
  console.log(`   - 총 ${auctions.length}건 조회됨`)
  if (auctions.length > 0) {
    console.log('   - 첫 번째 물건:', auctions[0].case_number, '-', auctions[0].address?.substring(0, 30) + '...')
  }
}

// 2. court_codes 테이블 조회
const { data: courts, error: courtsError } = await supabase
  .from('court_codes')
  .select('*')
  .limit(5)

if (courtsError) {
  console.log('❌ court_codes 조회 실패:', courtsError.message)
} else {
  console.log('✅ court_codes 조회 성공!')
  console.log(`   - 총 ${courts.length}건 조회됨 (전체 18개 중)`)
}

// 3. 특정 사건번호 조회
const { data: specific, error: specificError } = await supabase
  .from('auctions')
  .select('*')
  .eq('case_number', '2024타경85191')
  .single()

if (specificError) {
  console.log('❌ 특정 사건 조회 실패:', specificError.message)
} else {
  console.log('✅ 2024타경85191 조회 성공!')
  console.log('   - 법원:', specific.court_name)
  console.log('   - 물건종류:', specific.property_type)
  console.log('   - 감정가:', specific.appraisal_price?.toLocaleString() + '원')
  console.log('   - 최저가:', specific.minimum_price?.toLocaleString() + '원')
  console.log('   - 상태:', specific.status)
}

console.log('\n✨ API 테스트 완료!')

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_CRM_URL,
  process.env.SUPABASE_CRM_SERVICE_ROLE_KEY,
  { db: { schema: 'landing' } }
)

const updates = [
  {
    slug: 'urbanhomes',
    seo_title: '왕십리역 어반홈스 | 6개 노선 헥사역세권 오피스텔 | 분양가·평면도·모델하우스',
    seo_description: '☎️ 1668-5257 | 왕십리역 도보 2분 초역세권 | 2호선·5호선·수인분당선·경의중앙선 4중 환승 + GTX-C(예정) 헥사역세권 | 성동구 도선동 오피스텔 42실 | 5억대 분양가 | 주택수 미포함 | 실거주의무 없음 | 모델하우스 위치·평면도·청약 안내',
    seo_keywords: '왕십리역어반홈스, 왕십리어반홈스, 왕십리역어반홈스오피스텔, 왕십리역오피스텔, 왕십리오피스텔분양, 왕십리역분양, 성동구오피스텔, 성동구도선동, 도선동오피스텔, 어반홈스, 어반홈스왕십리, 어반홈스오피스텔, 왕십리역초역세권, 쿼드러플역세권, 헥사역세권, GTX-C왕십리, 2호선왕십리, 5호선왕십리, 수인분당선왕십리, 경의중앙선왕십리, 왕십리분양, 왕십리신축, 왕십리오피스텔모델하우스, 성동구분양, 서울오피스텔분양, 주택수미포함오피스텔, 왕십리역어반홈스A, 왕십리역어반홈스B, 왕십리역어반홈스분양가, 왕십리역어반홈스평면도',
  },
  {
    slug: 'yamok-grandhill',
    seo_title: '야목역 서희스타힐스 그랜드힐 | 998세대 비봉지구 신축 | 모델하우스·분양가 안내',
    seo_description: '☎️ 1668-5257 | 방문예약제 운영 | 수인분당선 야목역·GTX-F(예정) 더블역세권 | 경기도 화성시 비봉면 비봉택지지구 998세대 신축 아파트 | 59㎡·84㎡ 두 가지 타입 | E-모델하우스 360° VR | 분양가·평면도·동호수배치도·모델하우스 위치 안내',
    seo_keywords: '야목역서희스타힐스그랜드힐, 야목역서희스타힐스, 야목역서희, 야목역서희아파트, 야목역서희스타, 야목역서희스타힐스아파트, 야목역서희스타힐스모델하우스, 야목역서희스타힐스위치, 야목역서희분양가, 야목역서희일반분양, 야목역서희평면도, 야목역서희동호수배치도, 비봉서희스타힐스, 비봉아파트, 비봉아파트분양, 비봉신축아파트, 비봉지구, 비봉택지지구, 경기도화성시아파트분양, 화성비봉, 화성시아파트, 야목역, 야목역분양, 야목역 서희스타힐스, 야목역 서희스타힐스 그랜드힐, 비봉 아파트, 화성 비봉 분양, 화성시 아파트 분양, 서희스타힐스, 수인분당선 야목역, GTX-F 분양, 더블역세권, 998세대',
  },
]

for (const u of updates) {
  const { data, error } = await supabase
    .from('pages')
    .update({
      seo_title: u.seo_title,
      seo_description: u.seo_description,
      seo_keywords: u.seo_keywords,
    })
    .eq('slug', u.slug)
    .select('slug, seo_title')
    .single()

  if (error) {
    console.log(`❌ ${u.slug}:`, error.message)
  } else {
    console.log(`✅ ${u.slug} updated`)
    console.log(`   title: ${data.seo_title}`)
  }
}

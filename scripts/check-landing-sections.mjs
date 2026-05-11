import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_CRM_URL,
  process.env.SUPABASE_CRM_SERVICE_ROLE_KEY,
  { db: { schema: 'landing' } }
)

const slugs = ['yamok-grandhill', 'urbanhomes']

for (const slug of slugs) {
  const { data } = await supabase
    .from('pages')
    .select('slug, sections')
    .eq('slug', slug)
    .single()

  console.log(`\n=== ${slug} sections ===`)
  if (!data?.sections || data.sections.length === 0) {
    console.log('(빈 sections 배열 — 본문 텍스트 없음)')
    continue
  }
  data.sections.forEach((s, i) => {
    console.log(`[${i}] type=${s.type} title="${s.title || ''}" content_length=${s.content?.length || 0}`)
    if (s.content) {
      console.log(`    preview: ${s.content.slice(0, 150).replace(/\s+/g, ' ')}...`)
    }
  })
}

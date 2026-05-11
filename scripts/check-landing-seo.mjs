import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_CRM_URL,
  process.env.SUPABASE_CRM_SERVICE_ROLE_KEY,
  { db: { schema: 'landing' } }
)

const slugs = ['yamok-grandhill', 'urbanhomes', 'cluster-yongin-honorsville']

for (const slug of slugs) {
  const { data, error } = await supabase
    .from('pages')
    .select('slug, project_name, seo_title, seo_description, seo_keywords, location, total_units')
    .eq('slug', slug)
    .single()

  if (error) {
    console.log(`❌ ${slug}:`, error.message)
    continue
  }

  console.log(`\n=== ${slug} ===`)
  console.log('project_name:', data.project_name)
  console.log('location:', data.location)
  console.log('total_units:', data.total_units)
  console.log('seo_title:', data.seo_title || '(NULL)')
  console.log('seo_description:', data.seo_description || '(NULL)')
  console.log('seo_keywords:', data.seo_keywords || '(NULL)')
}

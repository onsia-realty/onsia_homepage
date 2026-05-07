/**
 * 야목역 SEO 필드 현재 값 확인
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_CRM_URL
const SUPABASE_KEY = process.env.SUPABASE_CRM_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: 'landing' },
  auth: { autoRefreshToken: false, persistSession: false }
})

const { data, error } = await supabase
  .from('pages')
  .select('slug, project_name, subtitle, seo_title, seo_description, seo_keywords, og_image')
  .eq('slug', 'yamok-grandhill')
  .single()

if (error) {
  console.error('❌', error.message)
  process.exit(1)
}

console.log('=== 야목역 SEO 필드 ===\n')
console.log('slug:', data.slug)
console.log('project_name:', data.project_name)
console.log('subtitle:', data.subtitle)
console.log('---')
console.log('seo_title:', data.seo_title)
console.log('seo_description:', data.seo_description)
console.log('seo_keywords:', data.seo_keywords)
console.log('og_image:', data.og_image)

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_CRM_URL,
  process.env.SUPABASE_CRM_SERVICE_ROLE_KEY,
  { db: { schema: 'landing' } }
)

const slugs = ['yamok-grandhill', 'urbanhomes']

for (const slug of slugs) {
  const { error } = await supabase
    .from('pages')
    .update({ sections: [] })
    .eq('slug', slug)

  if (error) console.log(`❌ ${slug}:`, error.message)
  else console.log(`✅ ${slug}: sections 비움`)
}

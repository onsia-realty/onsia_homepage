import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const url = process.env.NEXT_PUBLIC_SUPABASE_CRM_URL
const key = process.env.SUPABASE_CRM_SERVICE_ROLE_KEY

const landing = createClient(url, key, { db: { schema: 'landing' } })
const pub = createClient(url, key)

const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
console.log('3일 전:', threeDaysAgo)

// landing 스키마 확인
console.log('\n========== LANDING 스키마 ==========')

for (const table of ['sessions', 'pageviews', 'clicks', 'visitors', 'page_views', 'page_visits', 'analytics', 'events']) {
  const { data, error, count } = await landing.from(table).select('*', { count: 'exact' }).limit(3)
  if (!error) {
    console.log(`\n--- landing.${table} (total: ${count}) ---`)
    if (data && data.length > 0) {
      console.log('Sample:', JSON.stringify(data[0], null, 2).substring(0, 500))
    } else {
      console.log('(empty)')
    }
  }
}

// public 스키마 - tracker 테이블 확인
console.log('\n\n========== PUBLIC 스키마 (tracker) ==========')

for (const table of ['tracker_sessions', 'tracker_pageviews', 'tracker_clicks', 'sessions', 'pageviews', 'clicks', 'ad_clicks']) {
  const { data, error, count } = await pub.from(table).select('*', { count: 'exact' }).limit(3)
  if (!error) {
    console.log(`\n--- public.${table} (total: ${count}) ---`)
    if (data && data.length > 0) {
      console.log('Sample:', JSON.stringify(data[0], null, 2).substring(0, 500))
    } else {
      console.log('(empty)')
    }
  }
}

// urbanhomes 관련 데이터 찾기
console.log('\n\n========== URBANHOMES 관련 데이터 ==========')

// landing.sessions에서 urbanhomes 관련
const { data: landingSessions } = await landing.from('sessions').select('*').gte('created_at', threeDaysAgo).limit(20)
if (landingSessions && landingSessions.length > 0) {
  console.log('\nlanding.sessions (최근 3일):', landingSessions.length, '건')
  landingSessions.forEach((s, i) => {
    console.log(`  [${i+1}] ${s.created_at} | slug: ${s.landing_site_slug || s.site_slug || 'N/A'} | device: ${s.device_type || 'N/A'}`)
  })
}

// landing.pageviews에서 최근 3일
const { data: landingPVs } = await landing.from('pageviews').select('*').gte('created_at', threeDaysAgo).limit(30)
if (landingPVs && landingPVs.length > 0) {
  console.log('\nlanding.pageviews (최근 3일):', landingPVs.length, '건')
  landingPVs.forEach((pv, i) => {
    console.log(`  [${i+1}] ${pv.created_at} | path: ${pv.path || pv.page_url || 'N/A'} | title: ${pv.title || 'N/A'}`)
  })
}

// public.tracker_sessions에서 최근 3일
const { data: trackerSessions } = await pub.from('tracker_sessions').select('*').gte('created_at', threeDaysAgo).limit(20)
if (trackerSessions && trackerSessions.length > 0) {
  console.log('\npublic.tracker_sessions (최근 3일):', trackerSessions.length, '건')
  trackerSessions.forEach((s, i) => {
    console.log(`  [${i+1}] ${s.created_at} | slug: ${s.landing_site_slug || s.site_slug || 'N/A'} | device: ${s.device_type || 'N/A'}`)
  })
}

// landing.clicks에서 최근 3일
const { data: landingClicks } = await landing.from('clicks').select('*').gte('created_at', threeDaysAgo).limit(20)
if (landingClicks && landingClicks.length > 0) {
  console.log('\nlanding.clicks (최근 3일):', landingClicks.length, '건')
  landingClicks.forEach((c, i) => {
    console.log(`  [${i+1}] ${c.created_at} | type: ${c.event_type || 'N/A'} | url: ${c.page_url || 'N/A'}`)
  })
}

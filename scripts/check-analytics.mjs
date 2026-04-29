import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const url = process.env.NEXT_PUBLIC_SUPABASE_CRM_URL
const key = process.env.SUPABASE_CRM_SERVICE_ROLE_KEY

// landing 스키마
const landing = createClient(url, key, { db: { schema: 'landing' } })

// public 스키마
const pub = createClient(url, key)

console.log('=== landing 스키마 테이블 탐색 ===')
const landingTables = ['sessions', 'pageviews', 'clicks', 'analytics', 'events', 'visitors', 'page_views', 'page_visits']
for (const table of landingTables) {
  const { data, error } = await landing.from(table).select('*', { count: 'exact', head: true })
  if (!error) {
    console.log(`  landing.${table}: EXISTS`)
  }
}

console.log('\n=== public 스키마 analytics 테이블 탐색 ===')
const pubTables = ['sessions', 'pageviews', 'clicks', 'analytics', 'events', 'visitors', 'page_views', 'ad_clicks', 'tracker_sessions', 'tracker_pageviews', 'tracker_clicks']
for (const table of pubTables) {
  const { data, error } = await pub.from(table).select('*', { count: 'exact', head: true })
  if (!error) {
    console.log(`  public.${table}: EXISTS`)
    // 최근 3일 데이터 확인
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    const { data: recent, error: recentErr } = await pub.from(table).select('*').gte('created_at', threeDaysAgo).limit(5)
    if (recent) {
      console.log(`    최근 3일: ${recent.length}건 (sample)`)
    }
  }
}

// tracker 프로젝트 Supabase도 체크 (경매 전용이 아닌 다른 Supabase가 있을 수 있음)
console.log('\n=== 경매 Supabase (hwboz...) 확인 ===')
const auctionUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const auctionKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (auctionUrl && auctionKey) {
  const auction = createClient(auctionUrl, auctionKey)
  const auctionTables = ['sessions', 'pageviews', 'clicks', 'analytics', 'page_views']
  for (const table of auctionTables) {
    const { data, error } = await auction.from(table).select('*', { count: 'exact', head: true })
    if (!error) {
      console.log(`  ${table}: EXISTS`)
    }
  }
} else {
  console.log('  경매 Supabase 키 없음')
}

// Vercel Tracker API - POST endpoints로 데이터 읽기 시도
console.log('\n=== Tracker Vercel API 상세 탐색 ===')
const trackerBase = 'https://tracker-1jtn6j9qy-realtors77-7871s-projects.vercel.app'
const apiPaths = [
  '/api/analytics/session',
  '/api/analytics/pageview',
  '/api/analytics/click',
  '/api/analytics/report',
  '/api/dashboard',
  '/api/stats',
  '/api/report',
]

for (const path of apiPaths) {
  try {
    const res = await fetch(trackerBase + path, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    })
    if (res.status !== 404) {
      const text = await res.text()
      console.log(`  GET ${path}: ${res.status} - ${text.substring(0, 200)}`)
    }
  } catch {}
}

/**
 * data.json → landing.pages 업서트 (현장별 코드 없이 원페이지 랜딩 생성)
 *
 *   node scripts/landing/upsert-from-json.mjs <path/to/data.json> [--publish] [--dry-run]
 *
 * - 기본 is_published=false. --publish 로만 공개.
 * - --dry-run: DB에 쓰지 않고 생성될 row JSON만 출력.
 * - 업서트 키: slug (있으면 update, 없으면 insert).
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const args = process.argv.slice(2)
const file = args.find((a) => !a.startsWith('--'))
const publish = args.includes('--publish')
const dryRun = args.includes('--dry-run')
if (!file) {
  console.error('usage: node scripts/landing/upsert-from-json.mjs <data.json> [--publish] [--dry-run]')
  process.exit(1)
}

const d = JSON.parse(readFileSync(resolve(file), 'utf8'))
for (const k of ['slug', 'project_name']) {
  if (!d[k]) { console.error(`data.json: "${k}" 필수`); process.exit(1) }
}

// ---------- HTML helpers (모든 텍스트 escape) ----------
const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const has = (v) => v !== null && v !== undefined && v !== ''
const fmt = (v) => (typeof v === 'number' ? v.toLocaleString('ko-KR') : esc(v))

// prose 플러그인이 없어 렌더러가 표/그리드를 꾸며주지 않음 → 최소 inline style
const S = {
  table: 'width:100%;border-collapse:collapse;text-align:left;font-size:0.95em',
  th: 'padding:10px 12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;font-weight:600;white-space:nowrap;width:30%',
  td: 'padding:10px 12px;border-bottom:1px solid #e5e7eb',
  badge: 'display:inline-block;margin:4px;padding:8px 14px;border-radius:999px;background:#f3f4f6;font-weight:600',
  grid: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;text-align:left',
  card: 'padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#fff',
  note: 'font-size:0.85em;color:#6b7280;margin-top:8px',
}

const kvTable = (rows) => {
  const body = rows.filter(([, v]) => has(v)).map(([k, v]) => `<tr><th style="${S.th}">${esc(k)}</th><td style="${S.td}">${fmt(v)}</td></tr>`).join('')
  return body ? `<table style="${S.table}"><tbody>${body}</tbody></table>` : ''
}

const badges = (items) => (items?.length ? `<div style="text-align:center">${items.map((b) => `<span style="${S.badge}">${esc(b)}</span>`).join('')}</div>` : '')

const unitTable = (units) => {
  if (!units?.length) return ''
  const cols = [
    ['type', '타입', (u) => esc(u.type)],
    ['area_m2', '전용면적', (u) => `${fmt(u.area_m2)}㎡`],
    ['units', '세대수', (u) => `${fmt(u.units)}세대`],
    ['price_from', '분양가', (u) => fmt(u.price_from)],
  ].filter(([key]) => units.some((u) => has(u[key])))
  const head = cols.map(([, label]) => `<th style="${S.th};width:auto">${label}</th>`).join('')
  const rows = units.map((u) => `<tr>${cols.map(([key, , f]) => `<td style="${S.td}">${has(u[key]) ? f(u) : '-'}</td>`).join('')}</tr>`).join('')
  return `<table style="${S.table}"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`
}

const cards = (items) => (items?.length ? `<div style="${S.grid}">${items.map((p) => `<div style="${S.card}"><strong>${esc(p.title)}</strong>${has(p.desc) ? `<p style="margin:6px 0 0">${esc(p.desc)}</p>` : ''}</div>`).join('')}</div>` : '')

const STATUS_LABEL = { confirmed: '확정', construction: '공사중', planned: '계획', review: '검토' }
const devPlans = (plans) => (plans?.length
  ? `<ul style="text-align:left;padding-left:20px">${plans.map((p) => `<li><strong>${esc(p.name)}</strong> <span style="${S.badge};padding:2px 8px;font-size:0.8em">${esc(STATUS_LABEL[p.status] || p.status || '검토')}</span>${has(p.source) ? ` <span style="${S.note}">출처: ${esc(p.source)}</span>` : ''}</li>`).join('')}</ul>`
  : '')

// ---------- sections ----------
function buildSections(d) {
  const st = d.nearest_station
  const station = st?.name ? `${st.name}${has(st.distance_m) ? ` 약 ${fmt(st.distance_m)}m` : ''}` : null
  const mh = d.model_house
  const list = [
    ['benefits', '핵심 혜택', badges(d.benefits)],
    ['overview', '사업개요', kvTable([
      ['위치', d.location],
      ['규모', [has(d.floors) && d.floors, has(d.buildings) && `${fmt(d.buildings)}개 동`].filter(Boolean).join(' · ') || null],
      ['세대수', has(d.total_units) ? `${fmt(d.total_units)}세대${has(d.units_detail) ? ` (${d.units_detail})` : ''}` : null],
      ['시행', d.developer],
      ['시공', d.constructor],
      ['입주', d.move_in_date],
      ['주차', d.parking],
    ])],
    ['unit-types', '타입 안내', unitTable(d.unit_types)],
    ['premium', '프리미엄', cards(d.premium_points)],
    ['location', '입지 · 개발계획', [station && `<p><strong>인근 역</strong> ${esc(station)}</p>`, devPlans(d.development_plans)].filter(Boolean).join('')],
    ['model-house', '모델하우스 안내', kvTable([['주소', mh?.address], ['오픈', mh?.open_date]])],
  ]
  return list.filter(([, , content]) => content).map(([id, title, content], i) => ({ id, type: 'info', order: i, title, content }))
}

// ---------- row ----------
const DEFAULT_DISCLAIMER = '본 페이지의 이미지는 이해를 돕기 위한 연출 컷이며 실제와 다를 수 있습니다. 분양가·세대수·일정 등은 입주자모집공고를 기준으로 하며 변경될 수 있습니다.'
const row = {
  slug: d.slug,
  project_name: d.project_name,
  subtitle: d.subtitle ?? null,
  developer: [d.developer, d.constructor && `시공 ${d.constructor}`].filter(Boolean).join(' / ') || null,
  location: d.location ?? null,
  total_units: d.total_units ?? null,
  move_in_date: d.move_in_date ?? null,
  phone_number: d.phone_number ?? null,
  homepage_url: d.official_url ?? null,
  hero_image: d.hero_image ?? `/uploads/landing/${d.slug}/hero.jpg`,
  og_image: d.hero_image ?? null,
  gallery: [],
  sections: buildSections(d),
  primary_color: d.primary_color ?? '#1E3A5F',
  accent_color: d.accent_color ?? '#C9A96E',
  seo_title: d.seo?.title ?? null,
  seo_description: d.seo?.description ?? null,
  seo_keywords: d.seo?.keywords?.join(',') ?? null,
  show_bottom_bar: true,
  is_published: publish,
  business_info: { ...(d.business_info ?? {}), disclaimer: d.business_info?.disclaimer ?? DEFAULT_DISCLAIMER },
}

if (dryRun) {
  console.log(JSON.stringify(row, null, 2))
  process.exit(0)
}

const url = process.env.NEXT_PUBLIC_SUPABASE_CRM_URL
const key = process.env.SUPABASE_CRM_SERVICE_ROLE_KEY
if (!url || !key) { console.error('env 누락: NEXT_PUBLIC_SUPABASE_CRM_URL / SUPABASE_CRM_SERVICE_ROLE_KEY'); process.exit(1) }
const supabase = createClient(url, key, { db: { schema: 'landing' }, auth: { autoRefreshToken: false, persistSession: false } })

const { data: existing } = await supabase.from('pages').select('id').eq('slug', row.slug).maybeSingle()
const q = existing
  ? supabase.from('pages').update(row).eq('slug', row.slug)
  : supabase.from('pages').insert(row)
const { data, error } = await q.select('id, slug, is_published').single()
if (error) { console.error(existing ? '업데이트 실패:' : '삽입 실패:', error.message); process.exit(1) }
console.log(`${existing ? 'updated' : 'inserted'} id=${data.id} slug=${data.slug} is_published=${data.is_published} sections=${row.sections.length}`)

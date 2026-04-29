/**
 * 야목역 서희스타힐스 그랜드힐 참조 사이트 이미지 다운로드
 * → public/uploads/landing/yamok/ 에 저장
 */

import fs from 'fs'
import path from 'path'

const REF = 'https://www.xn--2i0bs4kloch9d4zkhlca439cd3a150f0iqomae.com'
const OUT = 'public/uploads/landing/yamok'

const TARGETS = [
  // 로고 (헤더 + 푸터)
  ['img/logo.png', 'logo.png'],
  ['img/footer_logo.png', 'footer_logo.png'],

  // 히어로
  ['img/main/section01_bg_n2.jpg?new', 'hero.jpg'],

  // 팝업
  ['img/popup0401.png', 'popup-grand-open.png'],
  ['img/popup0409.png', 'popup-similar-warning.png'],

  // 사업안내
  ['img/sub/business_n4.png', 'business.png'],
  ['img/sub/premium_n4.png', 'premium.png'],
  ['img/sub/brand_n.jpg', 'brand.jpg'],
  ['img/sub/location_n4.png', 'location.png'],

  // 분양안내
  ['img/sub/schedule.png', 'schedule.png'],
  ['img/sub/info03_n.png', 'info03.png'],
  ['img/sub/apply.png', 'apply.png'],

  // 청약안내
  ['img/sub/ssp_guide_n.png', 'ssp_guide.png'],

  // 단지안내
  ['img/sub/cpx_layout_n2.png', 'cpx_layout.png'],
  ['img/sub/no_layout.png', 'no_layout.png'],

  // 세대안내 (평면)
  ['img/sub/unitplan_59a_n2.png?new', 'unitplan_59a.png'],
  ['img/sub/unitplan_59b_n2.png?new', 'unitplan_59b.png'],
  ['img/sub/unitplan_59c_n2.png?new', 'unitplan_59c.png'],
  ['img/sub/unitplan_84a_n2.png?new', 'unitplan_84a.png'],
  ['img/sub/unitplan_84b_n2.png?new', 'unitplan_84b.png'],

  // 마감재 / 옵션
  ['img/sub/interior.png', 'interior.png'],
  ['img/sub/option.png', 'option.png'],
]

async function download(url, dest) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': REF + '/',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(dest, buf)
  return buf.length
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  console.log(`📁 ${OUT} 준비 완료\n`)

  let total = 0
  for (const [src, name] of TARGETS) {
    const url = `${REF}/${src}`
    const dest = path.join(OUT, name)
    try {
      const size = await download(url, dest)
      total += size
      const kb = (size / 1024).toFixed(1)
      console.log(`✅ ${name.padEnd(28)} ${kb}KB`)
    } catch (e) {
      console.log(`❌ ${name.padEnd(28)} ${e.message}`)
    }
  }
  console.log(`\n📊 총 ${TARGETS.length}장, ${(total / 1024 / 1024).toFixed(2)}MB`)
}

main().catch(e => { console.error(e); process.exit(1) })

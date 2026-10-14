// 현재 청약 목록 전체의 대표 이미지를 미리 해석해 DB에 캐시한다 (개발 서버 필요).
// 사용: node scripts/resolve-subscription-thumbnails.mjs  [BASE_URL=http://localhost:3000] [FORCE=1: '없음' 캐시도 재시도]
// 썸네일 API가 호출당 미해결분 6건을 병렬 해석하므로, 6건씩 끊어 호출한다.
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const BATCH = 6;
const FORCE = process.env.FORCE === '1' ? '&force=1' : '';

const items = new Map();
for (const type of ['apt', 'officetel', 'remndr']) {
  const r = await fetch(`${BASE}/api/subscriptions?type=${type}&page=1&perPage=300`).then(r => r.json());
  for (const it of r.data ?? []) items.set(it.HOUSE_MANAGE_NO, it);
}
const ids = [...items.keys()];
console.log(`총 ${ids.length}건 (홈페이지 있음 ${ids.filter(id => items.get(id).HMPG_ADRES).length})`);

const stats = {};
for (let i = 0; i < ids.length; i += BATCH) {
  const chunk = ids.slice(i, i + BATCH);
  let r;
  try { r = await fetch(`${BASE}/api/subscriptions/thumbnails?ids=${chunk.join(',')}${FORCE}`).then(r => r.json()); }
  catch (e) { console.log(`ERR batch ${i}: ${e.message}`); continue; }
  for (const id of chunk) {
    const src = r.meta?.[id]?.source ?? 'pending';
    stats[src] = (stats[src] || 0) + 1;
    console.log(`${src.padEnd(9)} ${id} ${items.get(id).HOUSE_NM} ${r.data?.[id] ? '→ ' + r.data[id] : ''}`);
  }
}
console.log('\n결과:', stats);

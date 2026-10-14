// 청약 단지 대표 이미지 해석 + DB 캐시 (Subscription.rawData.thumbnail)
// 출처 우선순위: 분양 홈페이지의 사업개요 페이지 첫 큰 이미지 → og:image → 홈 첫 큰 이미지 → 없음
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getAPTSubscriptions, getOfficetelSubscriptions, getRemndrSubscriptions, type CheongyakProperty } from '@/lib/cheongyakApi';

export type ThumbSource = 'overview' | 'og' | 'home' | 'none';
export interface Thumb { url: string | null; source: ThumbSource; page: string | null; at: string }

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
const SITE_TIMEOUT_MS = 8000;
const MIN_BYTES = 20000;
const RETRY_NONE_AFTER_MS = 7 * 864e5;
// 로고/아이콘/버튼/팝업/배너 등 대표 이미지가 아닌 파일명 패턴
const SKIP = /logo|icon|sprite|btn|button|bullet|arrow|blank|loading|\.svg|\.gif|banner|popup|pop_|quick|sns|kakao|naver|youtube|facebook|instagram|map|loca|bg_|_bg|dot|line|bar|close|open|menu|nav|gnb|top_|_top|txt_|_txt|title|tit_|_tit|footer|copy/i;
const OVERVIEW = /사업\s*개요|사업\s*안내|사업\s*소개|단지\s*개요|분양\s*개요/;

const strip = (s: string) => s.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi, '');
const abs = (base: string, u: string) => { try { return new URL(u.trim().replace(/&amp;/g, '&'), base).href; } catch { return null; } };
const isHttp = (u: string | null): u is string => !!u && /^https?:\/\//i.test(u);

async function getHtml(url: string, signal: AbortSignal) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' }, redirect: 'follow', signal });
  if (!res.ok) throw new Error(`http ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const cs = /charset=([\w-]+)/i.exec(res.headers.get('content-type') || '')?.[1]
    || /<meta[^>]+charset=["']?([\w-]+)/i.exec(buf.subarray(0, 4096).toString('latin1'))?.[1];
  let html: string;
  try { html = new TextDecoder(cs || 'utf-8').decode(buf); } catch { html = buf.toString('utf8'); }
  return { html, url: res.url };
}

// 페이지 본문 이미지 후보 (header/nav/footer 제외, 문서 순서)
function imageCandidates(html: string, base: string): string[] {
  const h = strip(html).replace(/<(header|nav|footer)\b[\s\S]*?<\/\1>/gi, '');
  const out: string[] = [];
  for (const [tag] of h.matchAll(/<img\b[^>]+>/gi)) {
    const src = /\s(?:data-src|data-original|data-lazy)=["']([^"']+)/i.exec(tag)?.[1] || /\ssrc=["']([^"']+)/i.exec(tag)?.[1];
    if (!src || src.startsWith('data:')) continue;
    const u = abs(base, src);
    if (!isHttp(u) || SKIP.test(u.split('/').slice(3).join('/'))) continue;
    const w = Number(/\swidth=["']?(\d+)/i.exec(tag)?.[1] || 0);
    if (w && w < 400) continue;
    out.push(u);
  }
  for (const [, src] of h.matchAll(/url\(["']?([^"')]+\.(?:jpe?g|png|webp))["']?\)/gi)) {
    const u = abs(base, src);
    if (isHttp(u) && !SKIP.test(u.split('/').slice(3).join('/'))) out.push(u);
  }
  return [...new Set(out)];
}

// 이미지 바이트 수 (image/* 아니면 0). HEAD 우선, 안 되면 GET. 핫링크 차단 사이트가 많아 같은 사이트 Referer를 보낸다
async function imageBytes(u: string, signal: AbortSignal): Promise<number> {
  try {
    const headers = { 'user-agent': UA, accept: 'image/avif,image/webp,image/*,*/*;q=0.8', referer: new URL(u).origin + '/' };
    const isImg = (r: Response) => r.ok && (r.headers.get('content-type') || '').startsWith('image/');
    let res = await fetch(u, { method: 'HEAD', headers, signal });
    if (!isImg(res) || !res.headers.get('content-length')) res = await fetch(u, { headers, signal });
    if (!isImg(res)) return 0;
    const cl = Number(res.headers.get('content-length') || 0);
    if (cl) { await res.body?.cancel(); return cl; }
    return (await res.arrayBuffer()).byteLength;
  } catch { return 0; }
}

async function firstLarge(urls: string[], signal: AbortSignal) {
  for (const u of urls.slice(0, 12)) if ((await imageBytes(u, signal)) >= MIN_BYTES) return u;
  return null;
}

function overviewLink(html: string, base: string) {
  for (const [, attrs, inner] of strip(html).matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const text = `${inner.replace(/<[^>]+>/g, ' ')} ${/alt=["']([^"']*)/i.exec(inner)?.[1] || ''} ${/title=["']([^"']*)/i.exec(attrs)?.[1] || ''}`;
    if (!OVERVIEW.test(text)) continue;
    const href = /href=["']([^"']+)/i.exec(attrs)?.[1];
    if (!href || /^(javascript|#|mailto|tel)/i.test(href)) continue;
    const u = abs(base, href);
    if (isHttp(u)) return u;
  }
  return null;
}

// 스플래시/리다이렉트 진입 페이지(본문이 짧고 JS location 이동 또는 링크 1개)면 다음 페이지 URL
function entryHop(html: string, base: string) {
  const body = strip(html);
  if (body.length > 4000) return null; // 실제 페이지의 로그인 리다이렉트 등은 따라가지 않음
  const js = /location(?:\.href)?\s*=\s*["']([^"']+)|location\.replace\(\s*["']([^"']+)/.exec(html);
  const anchors = [...body.matchAll(/<a\b[^>]*href=["']([^"'#]+)["']/gi)].map(m => m[1]).filter(u => !/^(javascript|mailto|tel)/i.test(u));
  const next = js?.[1] || js?.[2] || (anchors.length === 1 ? anchors[0] : null);
  return next ? abs(base, next) : null;
}

export async function resolveThumbnail(homepage: string): Promise<Thumb> {
  const at = new Date().toISOString();
  const signal = AbortSignal.timeout(SITE_TIMEOUT_MS); // 사이트당 총 예산
  let home = await getHtml(homepage, signal);
  let ov = overviewLink(home.html, home.url);
  if (!ov) {
    const next = entryHop(home.html, home.url);
    if (next && next !== home.url) {
      try { home = await getHtml(next, signal); ov = overviewLink(home.html, home.url); } catch { /* 진입 페이지 그대로 사용 */ }
    }
  }
  if (ov && ov !== home.url) {
    try {
      const p = await getHtml(ov, signal);
      const url = await firstLarge(imageCandidates(p.html, p.url), signal);
      if (url) return { url, source: 'overview', page: ov, at };
    } catch { /* og/home 폴백 */ }
  }
  const og = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i.exec(home.html)?.[1]
    || /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i.exec(home.html)?.[1];
  if (og) {
    const u = abs(home.url, og);
    if (isHttp(u) && (await imageBytes(u, signal)) >= MIN_BYTES) return { url: u, source: 'og', page: home.url, at };
  }
  const url = await firstLarge(imageCandidates(home.html, home.url), signal);
  return url ? { url, source: 'home', page: home.url, at } : { url: null, source: 'none', page: home.url, at };
}

const readThumb = (raw: unknown): Thumb | null => {
  const t = (raw as { thumbnail?: Thumb } | null)?.thumbnail;
  return t && typeof t.at === 'string' ? t : null;
};
const fresh = (t: Thumb) => Date.now() - Date.parse(t.at) < RETRY_NONE_AFTER_MS;

async function fetchItems(ids: Set<string>) {
  const res = await Promise.all([getAPTSubscriptions({ perPage: 100 }), getOfficetelSubscriptions({ perPage: 100 }), getRemndrSubscriptions({ perPage: 100 })]);
  const map = new Map<string, CheongyakProperty>();
  for (const r of res) for (const it of r.data) if (ids.has(it.HOUSE_MANAGE_NO)) map.set(it.HOUSE_MANAGE_NO, it);
  return map;
}

async function resolveAndStore(item: CheongyakProperty, existingRaw: unknown): Promise<Thumb> {
  let thumb: Thumb;
  if (!isHttp(item.HMPG_ADRES)) thumb = { url: null, source: 'none', page: null, at: new Date().toISOString() };
  else {
    try { thumb = await resolveThumbnail(item.HMPG_ADRES); }
    catch { thumb = { url: null, source: 'none', page: item.HMPG_ADRES, at: new Date().toISOString() }; }
  }
  const rawData = { ...((existingRaw as Record<string, unknown>) || {}), thumbnail: { ...thumb } } as Prisma.InputJsonObject;
  await prisma.subscription.upsert({
    where: { houseManageNo: item.HOUSE_MANAGE_NO },
    update: { rawData },
    create: {
      houseManageNo: item.HOUSE_MANAGE_NO,
      pblancNo: item.PBLANC_NO,
      houseName: item.HOUSE_NM,
      houseType: item.HOUSE_SECD_NM || 'APT',
      houseDetailType: item.HOUSE_DTL_SECD_NM || '민영',
      address: item.HSSPLY_ADRES,
      region: item.SUBSCRPT_AREA_CODE_NM,
      regionCode: item.SUBSCRPT_AREA_CODE,
      totalHouseholds: item.TOT_SUPLY_HSHLDCO || 0,
      homepage: item.HMPG_ADRES || null,
      noticeUrl: item.PBLANC_URL || null,
      rawData,
    },
  });
  return thumb;
}

/** 캐시 조회 + 미해결분은 최대 maxResolve개만 즉시 해석 (나머지는 다음 요청에서). force: '없음' 캐시도 7일 안 기다리고 재시도 */
export async function getThumbnails(ids: string[], maxResolve = 6, force = false): Promise<Record<string, Thumb | null>> {
  const out: Record<string, Thumb | null> = {};
  const rows = await prisma.subscription.findMany({ where: { houseManageNo: { in: ids } }, select: { houseManageNo: true, rawData: true } });
  const rawById = new Map(rows.map(r => [r.houseManageNo, r.rawData]));
  const misses: string[] = [];
  for (const id of ids) {
    const t = readThumb(rawById.get(id));
    if (t && (t.url || (!force && fresh(t)))) out[id] = t;
    else { out[id] = null; misses.push(id); }
  }
  const todo = misses.slice(0, maxResolve);
  if (todo.length) {
    const items = await fetchItems(new Set(todo));
    await Promise.all(todo.map(async id => {
      const item = items.get(id);
      if (!item) return;
      try { out[id] = await resolveAndStore(item, rawById.get(id)); }
      catch (e) { console.error('썸네일 저장 실패:', id, e); }
    }));
  }
  return out;
}

/** 캐시된 썸네일 URL인지 (이미지 프록시 허용 목록) */
export async function isCachedThumbnailUrl(url: string) {
  const row = await prisma.subscription.findFirst({ where: { rawData: { path: ['thumbnail', 'url'], equals: url } }, select: { id: true } });
  return !!row;
}

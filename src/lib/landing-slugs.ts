// 랜딩 페이지 슬러그 한↔영 매핑
// - DB(Supabase landing.pages)에는 영문 slug 저장 (코드 곳곳 하드코딩 대응)
// - 외부 노출 URL은 한글 (SEO 키워드 매칭)
// - middleware가 두 방향 변환 처리

export const EN_TO_KO_SLUG: Record<string, string> = {
  'yamok-grandhill': '야목역서희스타힐스',
  'urbanhomes': '왕십리역어반홈스',
  'cluster-yongin-honorsville': '클러스터용인경남아너스빌',
}

export const KO_TO_EN_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(EN_TO_KO_SLUG).map(([en, ko]) => [ko, en])
)

export function toKoreanSlug(slug: string): string {
  return EN_TO_KO_SLUG[slug] || slug
}

export function toEnglishSlug(slug: string): string {
  return KO_TO_EN_SLUG[slug] || slug
}

export function isEnglishLandingSlug(slug: string): boolean {
  return slug in EN_TO_KO_SLUG
}

export function isKoreanLandingSlug(slug: string): boolean {
  return slug in KO_TO_EN_SLUG
}

// ============================================================
// 독립 랜딩 도메인: 도메인 루트 자체가 랜딩 페이지 주소
// (광고/검색 노출용 — middleware가 host 보고 내부 slug로 rewrite)
// ============================================================
export const LANDING_DOMAINS: Record<string, string> = {
  // 야목역서희스타힐스.xyz
  'xn--w52b01jv7aa057aotah02dmgmlja.xyz': 'yamok-grandhill',
}

// 현재 접속 host 기준 랜딩의 base URL (canonical/OG용)
// - 독립 도메인으로 접속: https://야목역서희스타힐스.xyz (루트)
// - 그 외: https://www.onsia.city/한글슬러그
export function landingBaseUrl(host: string | null | undefined, slug: string): string {
  const apex = (host || '').toLowerCase().split(':')[0].replace(/^www\./, '')
  if (LANDING_DOMAINS[apex] === slug) return `https://${apex}`
  return `https://www.onsia.city/${toKoreanSlug(slug)}`
}

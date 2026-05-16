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

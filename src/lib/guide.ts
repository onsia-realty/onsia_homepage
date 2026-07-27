// /guide 콘텐츠 허브 데이터 레이어
// - 글 원본: content/guide/<cluster>/<file>.mdx (frontmatter + 본문)
// - URL slug는 한글 (예: 야목역-서희스타힐스-분양가) → 라우트에서 decodeURIComponent 필요
// - fs만 읽으므로 모든 /guide 라우트는 SSG 가능

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export const CLUSTERS = ['yamok', 'area', 'compare', 'transport', 'cheongyak'] as const
export type Cluster = (typeof CLUSTERS)[number]

export const CLUSTER_LABELS: Record<Cluster, string> = {
  yamok: '야목역 서희스타힐스',
  area: '화성·수원 지역',
  compare: '단지 비교',
  transport: '교통·출퇴근',
  cheongyak: '청약 정보',
}

export const PROJECTS = ['yamok', 'lumiel', 'common'] as const
export type Project = (typeof PROJECTS)[number]

/** 목록 페이지당 글 수 */
export const GUIDE_PAGE_SIZE = 20

export interface GuideFaq {
  q: string
  a: string
}

export interface GuidePost {
  title: string
  description: string
  slug: string
  cluster: Cluster
  project: Project
  keywords: string[]
  publishedAt: string
  updatedAt: string
  coverImage?: string
  coverAlt?: string
  faq?: GuideFaq[]
  draft: boolean
  sources?: string[]
  /** frontmatter를 제거한 MDX 본문 */
  content: string
  /** content/guide 기준 상대 경로 (에러 메시지·디버깅용) */
  filePath: string
}

const GUIDE_DIR = path.join(process.cwd(), 'content', 'guide')

function walkMdx(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walkMdx(full))
    else if (entry.name.endsWith('.mdx')) out.push(full)
  }
  return out
}

function fail(rel: string, message: string): never {
  throw new Error(`[guide] ${rel}: ${message}`)
}

function readString(data: Record<string, unknown>, key: string, rel: string): string {
  const v = data[key]
  if (typeof v !== 'string' || v.trim() === '') fail(rel, `frontmatter '${key}'는 비어있지 않은 문자열이어야 합니다.`)
  return v.trim()
}

// YAML은 따옴표 없는 2026-01-01을 Date로 파싱한다 → 문자열 YYYY-MM-DD로 정규화
function readDate(data: Record<string, unknown>, key: string, rel: string): string {
  const v = data[key]
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v.trim())) return v.trim()
  fail(rel, `frontmatter '${key}'는 YYYY-MM-DD 형식이어야 합니다. (받은 값: ${String(v)})`)
}

function parsePost(absPath: string): GuidePost {
  const rel = path.relative(GUIDE_DIR, absPath).split(path.sep).join('/')
  const raw = fs.readFileSync(absPath, 'utf8')
  const { data, content } = matter(raw)

  const title = readString(data, 'title', rel)
  const description = readString(data, 'description', rel)
  const slug = readString(data, 'slug', rel)
  const cluster = readString(data, 'cluster', rel)
  const project = readString(data, 'project', rel)

  if (!(CLUSTERS as readonly string[]).includes(cluster)) {
    fail(rel, `cluster '${cluster}'는 허용값이 아닙니다. (${CLUSTERS.join(' | ')})`)
  }
  if (!(PROJECTS as readonly string[]).includes(project)) {
    fail(rel, `project '${project}'는 허용값이 아닙니다. (${PROJECTS.join(' | ')})`)
  }

  const folder = rel.split('/')[0]
  if (folder !== cluster) {
    fail(rel, `cluster '${cluster}'가 폴더명 '${folder}'와 일치하지 않습니다.`)
  }

  const keywords = data.keywords
  if (!Array.isArray(keywords) || keywords.length === 0 || keywords.some((k) => typeof k !== 'string')) {
    fail(rel, `frontmatter 'keywords'는 1개 이상의 문자열 배열이어야 합니다.`)
  }

  const coverImage = typeof data.coverImage === 'string' ? data.coverImage.trim() : undefined
  const coverAlt = typeof data.coverAlt === 'string' ? data.coverAlt.trim() : undefined
  if (coverImage && !coverAlt) {
    fail(rel, `coverImage가 있으면 coverAlt는 필수입니다.`)
  }

  let faq: GuideFaq[] | undefined
  if (data.faq !== undefined) {
    if (!Array.isArray(data.faq)) fail(rel, `'faq'는 배열이어야 합니다.`)
    faq = data.faq.map((item, i) => {
      const o = item as Record<string, unknown>
      if (!o || typeof o.q !== 'string' || typeof o.a !== 'string') {
        fail(rel, `faq[${i}]는 { q: string, a: string } 형태여야 합니다.`)
      }
      return { q: o.q as string, a: o.a as string }
    })
  }

  let sources: string[] | undefined
  if (data.sources !== undefined) {
    if (!Array.isArray(data.sources) || data.sources.some((s) => typeof s !== 'string')) {
      fail(rel, `'sources'는 문자열 배열이어야 합니다.`)
    }
    sources = data.sources as string[]
  }

  return {
    title,
    description,
    slug,
    cluster: cluster as Cluster,
    project: project as Project,
    keywords: keywords as string[],
    publishedAt: readDate(data, 'publishedAt', rel),
    updatedAt: readDate(data, 'updatedAt', rel),
    coverImage,
    coverAlt,
    faq,
    draft: data.draft === true,
    sources,
    content,
    filePath: rel,
  }
}

function loadPosts(): GuidePost[] {
  const posts = walkMdx(GUIDE_DIR)
    .map(parsePost)
    .filter((p) => !p.draft)

  const seen = new Map<string, string>()
  for (const p of posts) {
    const prev = seen.get(p.slug)
    if (prev) throw new Error(`[guide] slug 중복: '${p.slug}' (${prev} ↔ ${p.filePath})`)
    seen.set(p.slug, p.filePath)
  }

  return posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0))
}

// dev에서는 매 호출 재스캔(글 수정 즉시 반영), production 빌드에서만 캐시
let cached: GuidePost[] | null = null

export function getAllGuidePosts(): GuidePost[] {
  if (process.env.NODE_ENV === 'production') {
    if (!cached) cached = loadPosts()
    return cached
  }
  return loadPosts()
}

export function getGuidePostBySlug(slug: string): GuidePost | undefined {
  return getAllGuidePosts().find((p) => p.slug === slug)
}

export function getRelatedPosts(post: GuidePost, n = 4): GuidePost[] {
  const others = getAllGuidePosts().filter((p) => p.slug !== post.slug)
  const overlap = (p: GuidePost) => p.keywords.filter((k) => post.keywords.includes(k)).length

  const sameCluster = others
    .filter((p) => p.cluster === post.cluster)
    .sort((a, b) => overlap(b) - overlap(a))

  const fallback = others
    .filter((p) => p.cluster !== post.cluster && overlap(p) > 0)
    .sort((a, b) => overlap(b) - overlap(a))

  return [...sameCluster, ...fallback].slice(0, n)
}

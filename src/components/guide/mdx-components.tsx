// /guide MDX 본문에서 쓰는 컴포넌트 매핑
// - 서버 컴포넌트 전용 (next-mdx-remote/rsc에 components로 주입)
// - 사이트 body가 다크 그라디언트 배경이라 밝은 텍스트 기준으로 스타일링

import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'
import type { Project } from '@/lib/guide'

// 자사 도메인 — rel(nofollow/noreferrer) 붙이지 않는다
const OWN_HOSTS = ['onsia.city', 'xn--w52b01jv7aa057aotah02dmgmlja.xyz']

// 야목역서희스타힐스.xyz 퓨니코드 — 한글 href는 일부 크롤러가 따라가지 못해 punycode로 고정
const YAMOK_LANDING_URL = 'https://xn--w52b01jv7aa057aotah02dmgmlja.xyz/'

function isOwnHost(href: string): boolean {
  try {
    // new URL()은 한글 호스트를 punycode로 정규화한다 → 한 벌만 비교하면 됨
    const host = new URL(href).hostname.toLowerCase().replace(/^www\./, '')
    return OWN_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))
  } catch {
    return false
  }
}

function GuideLink({ href, children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  const cls = 'text-sky-300 underline underline-offset-4 decoration-sky-300/40 hover:text-sky-200'

  if (href && href.startsWith('/')) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }

  // 외부 링크. 자사 .xyz 랜딩에는 rel을 붙이지 않는다(자사 사이트 → nofollow 불필요)
  const own = href ? isOwnHost(href) : false
  return (
    <a
      href={href}
      className={cls}
      target="_blank"
      {...(own ? {} : { rel: 'noopener noreferrer' })}
      {...rest}
    >
      {children}
    </a>
  )
}

function GuideImage({ src, alt, ...rest }: ComponentPropsWithoutRef<'img'>) {
  if (!alt || alt.trim() === '') {
    throw new Error(`[guide] MDX 이미지에 alt가 없습니다: ${String(src)}`)
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="my-6 w-full rounded-xl border border-white/10"
      {...rest}
    />
  )
}

export interface FactBoxItem {
  label: string
  value: string
}

/** 핵심 수치 요약 박스 — dl/dt/dd 시맨틱 (생성형 검색 인용 친화) */
export function FactBox({ title, items }: { title: string; items: FactBoxItem[] }) {
  return (
    <section className="my-8 rounded-2xl border border-white/15 bg-white/5 p-5 sm:p-6">
      <h3 className="mb-4 text-base font-semibold text-white">{title}</h3>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <dt className="text-xs font-medium tracking-wide text-slate-400">{item.label}</dt>
            <dd className="text-sm font-medium text-slate-100">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** 글 하단(또는 본문) 랜딩 유입 버튼. project별 공식 랜딩이 있는 경우에만 렌더 */
export function LandingCTA({ project }: { project: Project }) {
  if (project !== 'yamok') return null

  return (
    <aside className="my-10 rounded-2xl border border-amber-300/25 bg-amber-300/5 p-6 text-center">
      <p className="mb-4 text-sm text-slate-300">
        확정된 공급 조건·일정은 공식 홈페이지에서 확인하세요.
      </p>
      <a
        href={YAMOK_LANDING_URL}
        target="_blank"
        className="inline-block rounded-full bg-amber-300 px-7 py-3 text-sm font-bold text-slate-900 transition hover:bg-amber-200"
      >
        야목역 서희스타힐스 공식 홈페이지
      </a>
    </aside>
  )
}

/** MDXRemote에 주입할 컴포넌트 맵 */
export const guideMdxComponents = {
  a: GuideLink,
  img: GuideImage,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="mt-12 mb-4 text-2xl font-bold text-white sm:text-[1.7rem]" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mt-8 mb-3 text-lg font-semibold text-slate-100" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="my-4 leading-[1.9] text-slate-300" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="my-4 list-disc space-y-2 pl-5 leading-[1.85] text-slate-300 marker:text-slate-500" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="my-4 list-decimal space-y-2 pl-5 leading-[1.85] text-slate-300 marker:text-slate-500" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold text-white" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="my-6 border-l-2 border-sky-300/50 pl-4 text-slate-400 italic" {...props} />
  ),
  hr: () => <hr className="my-10 border-white/10" />,
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm text-slate-300" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th className="border border-white/10 bg-white/5 px-3 py-2 text-left font-semibold text-white" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td className="border border-white/10 px-3 py-2" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em] text-slate-100" {...props} />
  ),
  FactBox,
  LandingCTA,
}

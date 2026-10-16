import type { TplSiteConfig } from './types'
import { HWASEO_HONORSVILLE } from './hwaseo-honorsville'

const SITES: Record<string, TplSiteConfig> = {
  [HWASEO_HONORSVILLE.slug]: HWASEO_HONORSVILLE,
}

/** 템플릿(tpl) 설정이 있는 슬러그만 반환. 기존 현장(야목·어반홈스·아너스빌)은 undefined → page.tsx 기존 코드 그대로. */
export function getTplConfig(slug: string): TplSiteConfig | undefined {
  return SITES[slug]
}

export type { TplSiteConfig } from './types'

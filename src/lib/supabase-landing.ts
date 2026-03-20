import { createClient } from '@supabase/supabase-js'

// Supabase onsia-crm 클라이언트 (landing 스키마 전용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CRM_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_CRM_ANON_KEY!

// landing 스키마를 사용하는 공개 클라이언트
export const supabaseLanding = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'landing' }
})

// landing 스키마를 사용하는 서버 전용 클라이언트 (관리자용)
export function createLandingAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_CRM_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    console.warn('SUPABASE_CRM_SERVICE_ROLE_KEY not set, using anon key')
    return supabaseLanding
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    db: { schema: 'landing' },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// 타입 정의
export interface BusinessInfo {
  company_name?: string
  registration_number?: string
  ceo?: string
  address?: string
  disclaimer?: string
}

export interface LandingPage {
  id: string
  slug: string
  project_name: string
  subtitle: string | null
  developer: string | null
  location: string | null
  total_units: number | null
  move_in_date: string | null
  phone_number: string | null
  homepage_url: string | null
  hero_image: string | null
  logo_image: string | null
  gallery: string[]
  sections: LandingSection[]
  primary_color: string
  accent_color: string
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  og_image: string | null
  is_published: boolean
  view_count: number
  youtube_id: string | null
  kakao_chat_url: string | null
  show_bottom_bar: boolean
  business_info: BusinessInfo | null
  created_at: string
  updated_at: string
}

export interface LandingSection {
  id: string
  type: 'hero' | 'info' | 'gallery' | 'location' | 'floorplan' | 'inquiry' | 'custom'
  title?: string
  content?: string
  images?: string[]
  order: number
}

export interface LandingInquiry {
  id: string
  page_id: string
  name: string
  phone: string
  message: string | null
  agent_code: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  synced_to_crm: boolean
  status: 'pending' | 'contacted' | 'completed'
  created_at: string
}

export interface LandingAgent {
  id: string
  page_id: string
  code: string
  name: string
  phone: string
  kakao_url: string | null
  is_active: boolean
}

// 공개 페이지 조회 (slug로)
export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  const { data, error } = await supabaseLanding
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    console.error('Error fetching landing page:', error)
    return null
  }

  return data as LandingPage
}

// 공개 페이지 목록 조회
export async function getLandingPages(): Promise<LandingPage[]> {
  const { data, error } = await supabaseLanding
    .from('pages')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching landing pages:', error)
    return []
  }

  return data as LandingPage[]
}

// Agent 조회 (page_id + code) - 서버사이드 전용 (service_role)
export async function getAgentByCode(pageId: string, code: string): Promise<LandingAgent | null> {
  const admin = createLandingAdminClient()
  const { data, error } = await admin
    .from('agents')
    .select('*')
    .eq('page_id', pageId)
    .eq('code', code)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching agent:', error)
    return null
  }

  return data as LandingAgent
}

// 문의 등록 (service_role 사용 - RLS 우회)
export async function submitLandingInquiry(inquiry: {
  page_id: string
  name: string
  phone: string
  message?: string
  agent_code?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}): Promise<{ success: boolean; error?: string }> {
  const admin = createLandingAdminClient()
  const { error } = await admin
    .from('inquiries')
    .insert(inquiry)

  if (error) {
    console.error('Error submitting inquiry:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// 조회수 증가 (서버 사이드에서 호출)
export async function incrementViewCount(pageId: string) {
  const admin = createLandingAdminClient()
  const { error } = await admin.rpc('increment_view_count', { page_id: pageId })

  if (error) {
    // RPC가 없으면 직접 업데이트
    await admin
      .from('pages')
      .update({ view_count: supabaseLanding.rpc('') as unknown as number })
      .eq('id', pageId)
  }
}

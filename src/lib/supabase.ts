import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 (경매 데이터 전용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 서버 사이드 전용 (크롤러, API Routes)
export function createServerSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set, using anon key')
    return supabase
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// 타입 정의
export interface Auction {
  id: string
  court_code: string
  court_name: string
  case_number: string
  case_year: number
  item_number: number
  property_type: string | null
  address: string
  address_road: string | null
  sido: string | null
  sigungu: string | null
  dong: string | null
  land_area: number | null
  building_area: number | null
  exclusive_area: number | null
  appraisal_price: number | null
  minimum_price: number | null
  deposit_amount: number | null
  bid_count: number
  case_receipt_date: string | null
  auction_start_date: string | null
  dividend_end_date: string | null
  sale_date: string | null
  sale_place: string | null
  status: 'ACTIVE' | 'SOLD' | 'FAILED' | 'CANCELED' | 'POSTPONED'
  bid_method: string | null
  claim_amount: number | null
  note: string | null
  images: string[]
  source_url: string | null
  crawled_at: string
  updated_at: string
  created_at: string
}

export interface AuctionSchedule {
  id: string
  auction_id: string
  schedule_date: string
  schedule_type: string | null
  schedule_place: string | null
  minimum_price: number | null
  result: string | null
  sold_price: number | null
  created_at: string
}

export interface AuctionRight {
  id: string
  auction_id: string
  register_type: string | null
  register_no: string | null
  receipt_date: string | null
  purpose: string | null
  right_holder: string | null
  claim_amount: number | null
  is_reference: boolean
  will_expire: boolean
  note: string | null
  created_at: string
}

export interface AuctionAnalysis {
  id: string
  auction_id: string
  reference_date: string | null
  has_risk: boolean
  risk_note: string | null
  tenant_info: Record<string, unknown> | null
  total_claim: number | null
  expected_dividend: number | null
  ai_analysis: Record<string, unknown> | null
  investment_grade: string | null
  risk_level: string | null
  updated_at: string
  created_at: string
}

// 헬퍼 함수들
export async function getAuctions(options?: {
  status?: string
  sido?: string
  propertyType?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
  offset?: number
}) {
  let query = supabase
    .from('auctions')
    .select('*')
    .order('sale_date', { ascending: true })

  if (options?.status) {
    query = query.eq('status', options.status)
  }
  if (options?.sido) {
    query = query.eq('sido', options.sido)
  }
  if (options?.propertyType) {
    query = query.eq('property_type', options.propertyType)
  }
  if (options?.minPrice) {
    query = query.gte('minimum_price', options.minPrice)
  }
  if (options?.maxPrice) {
    query = query.lte('minimum_price', options.maxPrice)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching auctions:', error)
    throw error
  }

  return data as Auction[]
}

export async function getAuctionByCase(courtCode: string, caseNumber: string) {
  const { data, error } = await supabase
    .from('auctions')
    .select(`
      *,
      auction_schedules (*),
      auction_rights (*),
      auction_analysis (*)
    `)
    .eq('court_code', courtCode)
    .eq('case_number', caseNumber)
    .single()

  if (error) {
    console.error('Error fetching auction:', error)
    return null
  }

  return data
}

export async function getAuctionById(id: string) {
  const { data, error } = await supabase
    .from('auctions')
    .select(`
      *,
      auction_schedules (*),
      auction_rights (*),
      auction_analysis (*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching auction:', error)
    return null
  }

  return data
}

// 통계 조회
export async function getAuctionStats() {
  const { data, error } = await supabase
    .from('auctions')
    .select('status, sido, property_type')

  if (error) {
    console.error('Error fetching stats:', error)
    return null
  }

  const stats = {
    total: data.length,
    byStatus: {} as Record<string, number>,
    bySido: {} as Record<string, number>,
    byPropertyType: {} as Record<string, number>
  }

  data.forEach(item => {
    stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1
    if (item.sido) {
      stats.bySido[item.sido] = (stats.bySido[item.sido] || 0) + 1
    }
    if (item.property_type) {
      stats.byPropertyType[item.property_type] = (stats.byPropertyType[item.property_type] || 0) + 1
    }
  })

  return stats
}

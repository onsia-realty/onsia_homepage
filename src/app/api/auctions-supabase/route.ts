import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 주거용 + 상업용 물건 타입만 노출
const ALLOWED_PROPERTY_TYPES = [
  // 주거용
  '아파트', '다세대', '연립', '빌라', '단독주택', '오피스텔', '다가구', '주택', '연립주택', '다세대주택',
  // 상업용
  '상가', '건물', '오피스', '근린상가', '근린시설', '상업용', '업무시설', '점포'
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    const itemType = searchParams.get('itemType') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    // 기본 쿼리 - 주거용/상업용만 필터
    let query = supabase
      .from('auctions')
      .select('*', { count: 'exact' });

    // 주거용/상업용 필터 (OR 조건)
    const propertyTypeFilters = ALLOWED_PROPERTY_TYPES.map(type => `property_type.ilike.%${type}%`).join(',');
    query = query.or(propertyTypeFilters);

    // 검색어 필터
    if (search) {
      query = query.or(`address.ilike.%${search}%,case_number.ilike.%${search}%,court_name.ilike.%${search}%`);
    }

    // 지역 필터
    if (city) {
      query = query.eq('sido', city);
    }

    // 물건종류 필터 (프론트엔드에서 선택한 경우)
    if (itemType) {
      const typeMap: Record<string, string> = {
        'APARTMENT': '아파트',
        'VILLA': '다세대',
        'OFFICETEL': '오피스텔',
        'HOUSE': '단독주택',
        'COMMERCIAL': '상가',
        'BUILDING': '건물',
      };
      const mappedType = typeMap[itemType] || itemType;
      query = query.ilike('property_type', `%${mappedType}%`);
    }

    // 상태 필터
    if (status) {
      const statusMap: Record<string, string> = {
        'SCHEDULED': 'ACTIVE',
        'BIDDING': 'ACTIVE',
        'SUCCESSFUL': 'SOLD',
        'FAILED': 'FAILED',
      };
      query = query.eq('status', statusMap[status] || status);
    }

    // 정렬 및 페이징
    query = query
      .order('sale_date', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 프론트엔드 형식에 맞게 변환
    const items = (data || []).map(auction => ({
      id: auction.id,
      caseNumber: auction.case_number,
      courtName: auction.court_name,
      address: auction.address,
      district: auction.sigungu || '',
      city: auction.sido || '',
      itemType: auction.property_type,
      buildingArea: auction.building_area,
      landArea: auction.land_area,
      exclusiveArea: auction.exclusive_area,
      appraisalPrice: auction.appraisal_price?.toString() || '0',
      minimumPrice: auction.minimum_price?.toString() || '0',
      minimumRate: auction.appraisal_price
        ? Math.round((auction.minimum_price / auction.appraisal_price) * 100)
        : null,
      saleDate: auction.sale_date,
      bidCount: auction.bid_count || 0,
      status: auction.status,
      hasRisk: false, // 추후 auction_analysis 연동
      referenceDate: auction.dividend_end_date,
      // 이미지 - 객체 배열 또는 문자열 배열 모두 지원
      images: (auction.images || []).map((img: string | { url: string; type?: string; alt?: string }) => {
        if (typeof img === 'string') {
          return { url: img, alt: null };
        }
        return { url: img.url || '', alt: img.alt || null };
      }).filter((img: { url: string }) => img.url),
    }));

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

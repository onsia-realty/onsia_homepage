import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AuctionDetailClient } from './AuctionDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: auction } = await supabase
    .from('auctions')
    .select('address, case_number, court_name')
    .eq('id', id)
    .single();

  if (!auction) {
    return {
      title: '물건을 찾을 수 없습니다 | ONSIA',
    };
  }

  return {
    title: `${auction.case_number} ${auction.address} | ONSIA 경매`,
    description: `${auction.court_name} ${auction.case_number} - ${auction.address} 경매 물건 상세 정보`,
  };
}

async function getAuctionItem(id: string) {
  // 경매 물건 + 기일 내역 + 권리분석 조회
  const { data: auction, error } = await supabase
    .from('auctions')
    .select(`
      *,
      auction_schedules (*),
      auction_rights (*),
      auction_analysis (*)
    `)
    .eq('id', id)
    .single();

  if (error || !auction) return null;

  // AuctionDetailClient가 기대하는 형식으로 변환
  const item = {
    id: auction.id,
    caseNumber: auction.case_number,
    caseNumberFull: auction.case_number,
    courtCode: auction.court_code,
    courtName: auction.court_name,
    pnu: null, // PNU는 별도 저장 필요
    address: auction.address,
    addressDetail: auction.address_road,
    city: auction.sido || '',
    district: auction.sigungu || '',
    itemType: mapPropertyType(auction.property_type),
    landArea: auction.land_area,
    buildingArea: auction.building_area || auction.exclusive_area,
    floor: null,
    totalFloors: null,
    buildingStructure: null,
    buildingUsage: auction.property_type,
    landUseZone: null,
    // 감정평가 정보
    appraisalOrg: null,
    appraisalDate: null,
    preservationDate: null,
    approvalDate: null,
    landAppraisalPrice: null,
    buildingAppraisalPrice: null,
    appraisalPrice: (auction.appraisal_price || 0).toString(),
    minimumPrice: (auction.minimum_price || 0).toString(),
    minimumRate: auction.appraisal_price
      ? Math.round((auction.minimum_price / auction.appraisal_price) * 100)
      : null,
    deposit: (auction.deposit_amount || 0).toString(),
    saleDate: auction.sale_date,
    saleTime: auction.sale_date ? new Date(auction.sale_date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : null,
    bidCount: auction.bid_count || 0,
    bidEndDate: auction.dividend_end_date,
    referenceDate: auction.auction_analysis?.[0]?.reference_date || null,
    hasRisk: auction.auction_analysis?.[0]?.has_risk || false,
    riskNote: auction.auction_analysis?.[0]?.risk_note || null,
    // 당사자 정보 - 등기내역에서 추출
    owner: extractOwner(auction.auction_rights),
    debtor: extractDebtor(auction.auction_rights),
    creditor: extractCreditor(auction.auction_rights),
    status: mapStatus(auction.status),
    featured: false,
    // 현황/위치 정보
    surroundings: null,
    transportation: null,
    nearbyFacilities: null,
    heatingType: null,
    facilities: null,
    locationNote: auction.note,
    // 외부 데이터
    realPrice: null,
    buildingInfo: null,
    naverComplexId: null,
    // SEO
    seoTitle: null,
    seoDescription: null,
    // 메타
    viewCount: 0,
    inquiryCount: 0,
    createdAt: auction.created_at,
    updatedAt: auction.updated_at,
    // 이미지 - 객체 배열 또는 문자열 배열 모두 지원
    images: (auction.images || []).map((img: string | { url: string; type?: string; alt?: string; order?: number }, index: number) => {
      // 문자열인 경우 (URL만 저장된 경우)
      if (typeof img === 'string') {
        return {
          id: `img-${index}`,
          imageType: 'PHOTO',
          url: img,
          alt: `${auction.address} 이미지 ${index + 1}`,
        };
      }
      // 객체인 경우 (두인경매 형식)
      return {
        id: `img-${index}`,
        imageType: img.type || 'PHOTO',
        url: img.url || '',
        alt: img.alt || `${auction.address} 이미지 ${index + 1}`,
      };
    }).filter((img: { url: string }) => img.url), // 빈 URL 필터링
    // 기일 내역 (입찰 기록)
    bids: (auction.auction_schedules || [])
      .sort((a: { schedule_date: string }, b: { schedule_date: string }) =>
        new Date(b.schedule_date).getTime() - new Date(a.schedule_date).getTime()
      )
      .map((s: {
        id: string;
        schedule_date: string;
        schedule_type: string | null;
        minimum_price: number | null;
        result: string | null;
        sold_price: number | null;
      }, index: number, arr: unknown[]) => ({
        id: s.id,
        round: arr.length - index,
        bidDate: s.schedule_date,
        minimumPrice: (s.minimum_price || 0).toString(),
        result: mapResult(s.result),
        winningPrice: s.sold_price?.toString() || null,
        bidderCount: null,
      })),
    // 등기 내역
    registers: (auction.auction_rights || []).map((r: {
      id: string;
      register_type: string | null;
      register_no: string | null;
      receipt_date: string | null;
      purpose: string | null;
      right_holder: string | null;
      claim_amount: number | null;
      is_reference: boolean;
      will_expire: boolean;
      note: string | null;
    }) => ({
      id: r.id,
      registerType: r.register_type,
      registerNo: r.register_no,
      receiptDate: r.receipt_date,
      purpose: r.purpose,
      rightHolder: r.right_holder,
      claimAmount: r.claim_amount?.toString() || null,
      isReference: r.is_reference,
      willExpire: r.will_expire,
      note: r.note,
    })),
    // 임차인 정보
    tenants: [], // 추후 auction_analysis.tenant_info에서 파싱
  };

  return item;
}

// 물건종류 매핑 (한글 → 영문 코드)
function mapPropertyType(type: string | null): string {
  if (!type) return 'OTHER';
  const typeMap: Record<string, string> = {
    '아파트': 'APARTMENT',
    '다세대': 'VILLA',
    '연립': 'VILLA',
    '빌라': 'VILLA',
    '오피스텔': 'OFFICETEL',
    '단독주택': 'HOUSE',
    '다가구': 'HOUSE',
    '상가': 'COMMERCIAL',
    '근린상가': 'COMMERCIAL',
    '건물': 'BUILDING',
    '토지': 'LAND',
    '공장': 'FACTORY',
  };
  for (const [key, value] of Object.entries(typeMap)) {
    if (type.includes(key)) return value;
  }
  return 'OTHER';
}

// 상태 매핑 (Supabase → 프론트엔드)
function mapStatus(status: string | null): string {
  const statusMap: Record<string, string> = {
    'ACTIVE': 'SCHEDULED',
    'SOLD': 'SUCCESSFUL',
    'FAILED': 'FAILED',
    'CANCELED': 'CANCELED',
    'POSTPONED': 'SCHEDULED',
  };
  return statusMap[status || ''] || 'SCHEDULED';
}

// 기일 결과 매핑
function mapResult(result: string | null): string {
  if (!result) return 'SCHEDULED';
  const resultMap: Record<string, string> = {
    '유찰': 'FAILED',
    '매각': 'SUCCESSFUL',
    '취하': 'WITHDRAWN',
    '변경': 'SCHEDULED',
  };
  return resultMap[result] || 'SCHEDULED';
}

// 등기내역에서 소유자 추출 (가장 최근 소유권이전)
function extractOwner(rights: { purpose: string | null; right_holder: string | null; receipt_date: string | null }[] | null): string | null {
  if (!rights) return null;
  const ownershipTransfers = rights
    .filter(r => r.purpose?.includes('소유권이전') || r.purpose?.includes('소유권보존'))
    .sort((a, b) => new Date(b.receipt_date || 0).getTime() - new Date(a.receipt_date || 0).getTime());
  return ownershipTransfers[0]?.right_holder || null;
}

// 등기내역에서 채무자 추출 (소유자와 동일하게 처리)
function extractDebtor(rights: { purpose: string | null; right_holder: string | null; receipt_date: string | null }[] | null): string | null {
  // 채무자는 보통 소유자와 동일
  return extractOwner(rights);
}

// 등기내역에서 채권자 추출 (경매신청 채권자)
function extractCreditor(rights: { purpose: string | null; right_holder: string | null; note: string | null }[] | null): string | null {
  if (!rights) return null;
  // 임의경매 신청자 찾기
  const auctionRequest = rights.find(r => r.purpose?.includes('임의경매') || r.purpose?.includes('강제경매'));
  if (auctionRequest) return auctionRequest.right_holder;
  // 없으면 말소기준등기 채권자
  const referenceRight = rights.find(r => r.note?.includes('말소기준'));
  return referenceRight?.right_holder || null;
}

export default async function AuctionDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getAuctionItem(id);

  if (!item) {
    notFound();
  }

  return <AuctionDetailClient item={item} />;
}

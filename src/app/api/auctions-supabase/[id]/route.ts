import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // 경매 물건 상세 조회 (기일 내역 포함)
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

    if (error || !auction) {
      return NextResponse.json(
        { error: '물건을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 프론트엔드 형식에 맞게 변환
    const item = {
      id: auction.id,
      caseNumber: auction.case_number,
      courtName: auction.court_name,
      courtCode: auction.court_code,
      address: auction.address,
      addressRoad: auction.address_road,
      district: auction.sigungu || '',
      city: auction.sido || '',
      dong: auction.dong || '',
      itemType: auction.property_type,
      buildingArea: auction.building_area,
      landArea: auction.land_area,
      exclusiveArea: auction.exclusive_area,
      appraisalPrice: auction.appraisal_price?.toString() || '0',
      minimumPrice: auction.minimum_price?.toString() || '0',
      deposit: auction.deposit_amount?.toString() || '0',
      minimumRate: auction.appraisal_price
        ? Math.round((auction.minimum_price / auction.appraisal_price) * 100)
        : null,
      saleDate: auction.sale_date,
      salePlace: auction.sale_place,
      bidCount: auction.bid_count || 0,
      status: auction.status,
      bidMethod: auction.bid_method,
      claimAmount: auction.claim_amount?.toString() || null,
      note: auction.note,
      images: auction.images || [],
      sourceUrl: auction.source_url,

      // 날짜 정보
      caseReceiptDate: auction.case_receipt_date,
      auctionStartDate: auction.auction_start_date,
      dividendEndDate: auction.dividend_end_date,

      // 기일 내역
      bids: (auction.auction_schedules || [])
        .sort((a: { schedule_date: string }, b: { schedule_date: string }) =>
          new Date(b.schedule_date).getTime() - new Date(a.schedule_date).getTime()
        )
        .map((s: {
          id: string;
          schedule_date: string;
          schedule_type: string | null;
          schedule_place: string | null;
          minimum_price: number | null;
          result: string | null;
          sold_price: number | null;
        }, index: number, arr: unknown[]) => ({
          id: s.id,
          round: arr.length - index,
          bidDate: s.schedule_date,
          scheduleType: s.schedule_type,
          place: s.schedule_place,
          minimumPrice: s.minimum_price?.toString() || '0',
          result: s.result,
          winningPrice: s.sold_price?.toString() || null,
        })),

      // 권리분석 (등기 내역)
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

      // 분석 정보
      analysis: auction.auction_analysis?.[0] ? {
        referenceDate: auction.auction_analysis[0].reference_date,
        hasRisk: auction.auction_analysis[0].has_risk,
        riskNote: auction.auction_analysis[0].risk_note,
        tenantInfo: auction.auction_analysis[0].tenant_info,
        totalClaim: auction.auction_analysis[0].total_claim?.toString() || null,
        expectedDividend: auction.auction_analysis[0].expected_dividend?.toString() || null,
        investmentGrade: auction.auction_analysis[0].investment_grade,
        riskLevel: auction.auction_analysis[0].risk_level,
      } : null,

      // 임차인 정보 (분석에서 추출)
      tenants: auction.auction_analysis?.[0]?.tenant_info || [],

      // 위험 여부
      hasRisk: auction.auction_analysis?.[0]?.has_risk || false,
      referenceDate: auction.auction_analysis?.[0]?.reference_date || null,
    };

    return NextResponse.json(item);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

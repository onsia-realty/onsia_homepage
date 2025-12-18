import { NextRequest, NextResponse } from 'next/server';
import {
  getUrlByType,
  getCourtHeaders,
  CourtDataType,
  DATA_TYPE_LABELS,
} from '@/lib/court-crawler';
import { COURT_CODES } from '@/lib/court-auction';

// 캐시 저장소 (메모리 캐시, 프로덕션에서는 Redis 등 사용 권장)
const cache = new Map<string, { data: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5분

/**
 * 대법원 데이터 프록시 API
 *
 * GET /api/court/[type]?courtCode=1710&caseNumber=2024타경85191
 * GET /api/court/[type]?courtName=수원지방법원&caseNumber=2024타경85191
 *
 * type: caseDetail | schedule | property | survey | appraisal | saleStatement | documents
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const { searchParams } = new URL(request.url);

    // 파라미터 추출
    let courtCode = searchParams.get('courtCode');
    const courtName = searchParams.get('courtName');
    const caseNumber = searchParams.get('caseNumber');
    const raw = searchParams.get('raw') === 'true'; // 원본 HTML 반환 여부

    // 필수 파라미터 검증
    if (!caseNumber) {
      return NextResponse.json(
        { error: 'caseNumber is required' },
        { status: 400 }
      );
    }

    // 법원코드 확인 (courtName으로도 조회 가능)
    if (!courtCode && courtName) {
      courtCode = COURT_CODES[courtName];
    }

    if (!courtCode) {
      return NextResponse.json(
        { error: 'courtCode or valid courtName is required' },
        { status: 400 }
      );
    }

    // 데이터 타입 검증
    const validTypes: CourtDataType[] = [
      'caseDetail',
      'schedule',
      'property',
      'survey',
      'appraisal',
      'saleStatement',
      'documents',
    ];

    if (!validTypes.includes(type as CourtDataType)) {
      return NextResponse.json(
        {
          error: `Invalid type. Valid types: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // 캐시 키 생성
    const cacheKey = `${type}_${courtCode}_${caseNumber}`;

    // 캐시 확인
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        type,
        typeLabel: DATA_TYPE_LABELS[type as CourtDataType],
        courtCode,
        caseNumber,
        cached: true,
        data: raw ? cached.data : '캐시된 HTML 데이터',
        fetchedAt: new Date(cached.timestamp).toISOString(),
      });
    }

    // 대법원 URL 생성
    const courtUrl = getUrlByType(type as CourtDataType, courtCode, caseNumber);

    if (!courtUrl) {
      return NextResponse.json(
        { error: 'Failed to generate court URL' },
        { status: 500 }
      );
    }

    // 대법원 서버에 요청
    const response = await fetch(courtUrl, {
      headers: getCourtHeaders(),
      next: { revalidate: 300 }, // 5분 캐시
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Court server responded with ${response.status}`,
          courtUrl,
        },
        { status: 502 }
      );
    }

    // HTML 응답 받기
    const html = await response.text();

    // 캐시 저장
    cache.set(cacheKey, {
      data: html,
      timestamp: Date.now(),
    });

    // 응답
    return NextResponse.json({
      success: true,
      type,
      typeLabel: DATA_TYPE_LABELS[type as CourtDataType],
      courtCode,
      caseNumber,
      cached: false,
      courtUrl,
      data: raw ? html : `HTML 데이터 (${html.length} bytes)`,
      dataLength: html.length,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Court proxy error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch court data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * iframe용 HTML 프록시 (CORS 우회)
 *
 * POST /api/court/[type]
 * Body: { courtCode, caseNumber }
 *
 * HTML을 직접 반환 (iframe에서 사용)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const body = await request.json();
    const { courtCode, courtName, caseNumber } = body;

    // 법원코드 확인
    const code = courtCode || (courtName ? COURT_CODES[courtName] : null);

    if (!code || !caseNumber) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    // 데이터 타입 검증
    const validTypes: CourtDataType[] = [
      'caseDetail',
      'schedule',
      'property',
      'survey',
      'appraisal',
      'saleStatement',
      'documents',
    ];

    if (!validTypes.includes(type as CourtDataType)) {
      return new NextResponse('Invalid type', { status: 400 });
    }

    // 대법원 URL 생성
    const courtUrl = getUrlByType(type as CourtDataType, code, caseNumber);

    if (!courtUrl) {
      return new NextResponse('Failed to generate URL', { status: 500 });
    }

    // 대법원 서버에 요청
    const response = await fetch(courtUrl, {
      headers: getCourtHeaders(),
    });

    if (!response.ok) {
      return new NextResponse(`Court server error: ${response.status}`, {
        status: 502,
      });
    }

    // HTML 응답
    const html = await response.text();

    // HTML 직접 반환 (iframe용)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Court HTML proxy error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

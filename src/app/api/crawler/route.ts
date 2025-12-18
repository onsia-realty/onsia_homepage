/**
 * 경매 크롤러 API
 *
 * POST /api/crawler - 단일 사건 크롤링 및 저장
 * GET /api/crawler?courtCode=xxx&caseNumber=xxx - 크롤링만 (저장 안함)
 */

import { NextRequest, NextResponse } from 'next/server';
import { crawlAuction, findCourtCode } from '@/lib/crawler/court-crawler-service';
import { crawlAndSave } from '@/lib/crawler/auction-saver';

// 간단한 API 키 인증 (환경변수로 설정)
const API_KEY = process.env.CRAWLER_API_KEY || 'dev-crawler-key';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return false;

  const token = authHeader.replace('Bearer ', '');
  return token === API_KEY;
}

/**
 * GET - 크롤링만 (저장 안함, 미리보기용)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const courtCode = searchParams.get('courtCode');
  const courtName = searchParams.get('courtName');
  const caseNumber = searchParams.get('caseNumber');

  if (!caseNumber) {
    return NextResponse.json(
      { error: 'caseNumber 파라미터가 필요합니다' },
      { status: 400 }
    );
  }

  // 법원코드 결정
  let code = courtCode;
  if (!code && courtName) {
    code = findCourtCode(courtName);
  }

  if (!code) {
    return NextResponse.json(
      { error: 'courtCode 또는 courtName이 필요합니다' },
      { status: 400 }
    );
  }

  try {
    const result = await crawlAuction(code, caseNumber);

    return NextResponse.json({
      success: result.success,
      data: result.data,
      error: result.error,
      source: result.source,
      fetchedAt: result.fetchedAt,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '크롤링 실패' },
      { status: 500 }
    );
  }
}

/**
 * POST - 크롤링 + Supabase 저장
 */
export async function POST(request: NextRequest) {
  // API 키 인증
  if (!checkAuth(request)) {
    return NextResponse.json(
      { error: '인증이 필요합니다' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { courtCode, courtName, caseNumber, caseNumbers } = body;

    // 단일 사건 크롤링
    if (caseNumber) {
      let code = courtCode;
      if (!code && courtName) {
        code = findCourtCode(courtName);
      }

      if (!code) {
        return NextResponse.json(
          { error: 'courtCode 또는 courtName이 필요합니다' },
          { status: 400 }
        );
      }

      const result = await crawlAndSave(code, caseNumber);

      return NextResponse.json({
        success: result.success,
        auctionId: result.auctionId,
        error: result.error,
        savedAt: result.savedAt,
      });
    }

    // 여러 사건 일괄 크롤링
    if (caseNumbers && Array.isArray(caseNumbers)) {
      const results = [];

      for (const item of caseNumbers) {
        let code = item.courtCode;
        if (!code && item.courtName) {
          code = findCourtCode(item.courtName);
        }

        if (!code || !item.caseNumber) {
          results.push({
            caseNumber: item.caseNumber,
            success: false,
            error: 'courtCode와 caseNumber가 필요합니다',
          });
          continue;
        }

        const result = await crawlAndSave(code, item.caseNumber);
        results.push({
          caseNumber: item.caseNumber,
          ...result,
        });

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const successCount = results.filter(r => r.success).length;

      return NextResponse.json({
        total: caseNumbers.length,
        success: successCount,
        failed: caseNumbers.length - successCount,
        results,
      });
    }

    return NextResponse.json(
      { error: 'caseNumber 또는 caseNumbers가 필요합니다' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '처리 실패' },
      { status: 500 }
    );
  }
}

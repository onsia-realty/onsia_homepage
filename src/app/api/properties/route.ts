import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



// BigInt를 재귀적으로 문자열로 변환
function serializeBigInt(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeBigInt(value);
    }
    return result;
  }
  return obj;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const limit = parseInt(searchParams.get('limit') || '12');
    const paginated = page !== null; // 페이지네이션 모드 여부

    // 전체 개수 조회 (페이지네이션 모드일 때만)
    const total = paginated ? await prisma.property.count({
      where: { status: 'AVAILABLE' }
    }) : 0;

    const pageNum = parseInt(page || '1');

    const properties = await prisma.property.findMany({
      where: {
        status: 'AVAILABLE'
      },
      include: {
        developer: true,
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: [
        { featured: 'desc' },  // 추천 매물 우선
        { createdAt: 'asc' }   // 오래된 순 (순서 조정용)
      ],
      ...(paginated ? {
        skip: (pageNum - 1) * limit,
        take: limit
      } : {
        take: 12  // 메인화면용: 상위 12개만
      })
    });

    // BigInt를 문자열로 변환
    const serializedProperties = serializeBigInt(properties);

    // 페이지네이션 모드면 pagination 정보 포함, 아니면 배열만 반환
    if (paginated) {
      return new Response(JSON.stringify({
        properties: serializedProperties,
        pagination: {
          page: pageNum,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 기존 방식: 배열만 반환 (메인화면 호환)
    return new Response(JSON.stringify(serializedProperties), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Properties fetch error:', error);
    // 에러 발생해도 빈 배열 반환 (프론트에서 폴백 처리)
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

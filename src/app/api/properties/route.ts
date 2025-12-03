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

export async function GET() {
  try {
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
        { createdAt: 'desc' }
      ],
      take: 12  // 상위 12개만
    });

    // BigInt를 문자열로 변환
    const serializedProperties = serializeBigInt(properties);

    console.log('API - Total properties:', properties.length);
    console.log('API - Featured count:', properties.filter(p => p.featured).length);

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

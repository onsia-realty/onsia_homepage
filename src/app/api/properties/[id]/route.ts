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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        developer: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // BigInt를 문자열로 변환
    const serializedProperty = serializeBigInt(property);

    return new Response(JSON.stringify(serializedProperty), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Property fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

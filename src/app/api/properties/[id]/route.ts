import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const serializedProperty = {
      ...property,
      basePrice: property.basePrice?.toString() || '0',
      pricePerPyeong: property.pricePerPyeong?.toString() || '0',
      contractDeposit: property.contractDeposit?.toString() || '0',
      rightsFee: property.rightsFee?.toString() || '0'
    };

    return NextResponse.json(serializedProperty);
  } catch (error) {
    console.error('Property fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

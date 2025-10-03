import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        status: 'AVAILABLE'
      },
      include: {
        developer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // BigInt를 문자열로 변환
    const serializedProperties = properties.map(property => ({
      ...property,
      basePrice: property.basePrice.toString(),
      pricePerPyeong: property.pricePerPyeong?.toString() || '0',
      contractDeposit: property.contractDeposit?.toString() || '0',
      rightsFee: property.rightsFee?.toString() || '0'
    }));

    console.log('API - Total properties:', properties.length);
    console.log('API - Featured count:', properties.filter(p => p.featured).length);

    return NextResponse.json(serializedProperties);
  } catch (error) {
    console.error('Properties fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

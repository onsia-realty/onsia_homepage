import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 건설사 목록 조회
export async function GET() {
  try {
    const developers = await prisma.developer.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(developers);
  } catch (error) {
    console.error('Failed to fetch developers:', error);
    return NextResponse.json(
      { error: '건설사 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 건설사 등록
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const developer = await prisma.developer.create({
      data: {
        name: body.name,
        description: body.description || null,
        logoUrl: body.logoUrl || null,
        website: body.website || null,
      },
    });

    return NextResponse.json(developer, { status: 201 });
  } catch (error) {
    console.error('Failed to create developer:', error);
    return NextResponse.json(
      { error: '건설사 등록에 실패했습니다.' },
      { status: 500 }
    );
  }
}

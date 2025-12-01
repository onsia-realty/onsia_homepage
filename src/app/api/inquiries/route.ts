import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - 새 문의 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, propertyId, inquiryType, source } = body;

    // 필수 필드 검증
    if (!name || !email || !message || !propertyId) {
      return NextResponse.json(
        { error: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 매물 존재 확인
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true }
    });

    if (!property) {
      return NextResponse.json(
        { error: '해당 매물을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 문의 생성
    const inquiry = await prisma.propertyInquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        propertyId,
        inquiryType: inquiryType || 'GENERAL',
        source: source || 'direct',
      },
      include: {
        property: {
          select: {
            title: true,
            slug: true,
          }
        }
      }
    });

    // 매물의 문의 카운트 증가
    await prisma.property.update({
      where: { id: propertyId },
      data: { inquiryCount: { increment: 1 } }
    });

    console.log(`New inquiry received: ${inquiry.id} for property: ${property.title}`);

    return NextResponse.json({
      success: true,
      message: '문의가 성공적으로 등록되었습니다. 빠른 시일 내에 연락드리겠습니다.',
      inquiry: {
        id: inquiry.id,
        createdAt: inquiry.createdAt,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Inquiry creation error:', error);
    return NextResponse.json(
      { error: '문의 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

// GET - 문의 목록 (관리자용)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const propertyId = searchParams.get('propertyId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (status) where.status = status;
    if (propertyId) where.propertyId = propertyId;

    const [inquiries, total] = await Promise.all([
      prisma.propertyInquiry.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              slug: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.propertyInquiry.count({ where })
    ]);

    return NextResponse.json({
      inquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Inquiries fetch error:', error);
    return NextResponse.json(
      { error: '문의 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

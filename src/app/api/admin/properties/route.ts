import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 매물 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 임시 사용자 ID (나중에 인증 시스템 연동)
    const tempUserId = await getOrCreateTempUser();

    const property = await prisma.property.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
        description: body.description,
        address: body.address,
        district: body.district,
        city: body.city,
        zipCode: body.zipCode || null,
        totalUnits: body.totalUnits,
        availableUnits: body.availableUnits || 0,
        buildingType: body.buildingType,
        completionDate: new Date(body.completionDate),
        moveInDate: body.moveInDate ? new Date(body.moveInDate) : null,
        basePrice: BigInt(body.basePrice),
        pricePerPyeong: body.pricePerPyeong ? BigInt(body.pricePerPyeong) : null,
        contractDeposit: BigInt(body.contractDeposit),
        interimPayments: body.interimPayments || '{"payments":[]}',
        rightsFee: body.rightsFee ? BigInt(body.rightsFee) : null,
        profitRate: body.profitRate || null,
        investmentGrade: body.investmentGrade || null,
        constructor: body.constructor || null,
        keyFeature: body.keyFeature || null,
        totalBuildingCount: body.totalBuildingCount || null,
        parkingSpaces: body.parkingSpaces || null,
        facilities: body.facilities || '[]',
        status: body.status || 'AVAILABLE',
        featured: body.featured || false,
        isPremium: body.isPremium || false,
        pdfUrl: body.pdfUrl || null,
        youtubeVideoId: body.youtubeVideoId || null,
        locationDesc: body.locationDesc || null,
        pyeongTypes: body.pyeongTypes || null,
        developerId: body.developerId,
        authorId: tempUserId,
        images: body.images && body.images.length > 0 ? {
          create: body.images.map((img: { url: string; order: number }, index: number) => ({
            url: img.url,
            order: img.order ?? index,
            type: 'EXTERIOR',
          })),
        } : undefined,
      },
      include: {
        images: true,
        developer: true,
      },
    });

    // BigInt를 문자열로 변환
    const serializedProperty = {
      ...property,
      basePrice: property.basePrice.toString(),
      pricePerPyeong: property.pricePerPyeong?.toString(),
      contractDeposit: property.contractDeposit.toString(),
      rightsFee: property.rightsFee?.toString(),
    };

    return NextResponse.json(serializedProperty, { status: 201 });
  } catch (error) {
    console.error('Failed to create property:', error);
    return NextResponse.json(
      { message: '매물 등록에 실패했습니다.', error: String(error) },
      { status: 500 }
    );
  }
}

// 임시 사용자 생성/조회 (관리자)
async function getOrCreateTempUser() {
  const adminEmail = 'admin@onsia.city';

  let user = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: adminEmail,
        name: '관리자',
        role: 'ADMIN',
      },
    });
  }

  return user.id;
}

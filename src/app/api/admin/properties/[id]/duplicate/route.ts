import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 매물 복제 API
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 원본 매물 조회
    const original = await prisma.property.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!original) {
      return NextResponse.json(
        { error: '원본 매물을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 새 slug 생성 (충돌 방지)
    const timestamp = Date.now();
    const newSlug = `${original.slug}-copy-${timestamp}`;
    const newTitle = `${original.title} (복제)`;

    // 매물 복제
    const duplicated = await prisma.property.create({
      data: {
        title: newTitle,
        slug: newSlug,
        description: original.description,
        address: original.address,
        district: original.district,
        city: original.city,
        zipCode: original.zipCode,
        totalUnits: original.totalUnits,
        availableUnits: original.availableUnits,
        buildingType: original.buildingType,
        completionDate: original.completionDate,
        moveInDate: original.moveInDate,
        basePrice: original.basePrice,
        pricePerPyeong: original.pricePerPyeong,
        contractDeposit: original.contractDeposit,
        interimPayments: original.interimPayments,
        rightsFee: original.rightsFee,
        profitRate: original.profitRate,
        investmentGrade: original.investmentGrade,
        riskLevel: original.riskLevel,
        constructor: original.constructor,
        keyFeature: original.keyFeature,
        totalBuildingCount: original.totalBuildingCount,
        parkingSpaces: original.parkingSpaces,
        facilities: original.facilities,
        status: 'AVAILABLE', // 새 매물은 분양중으로
        featured: false, // 추천은 해제
        isPremium: false, // 프리미엄도 해제
        pdfUrl: original.pdfUrl,
        youtubeVideoId: original.youtubeVideoId,
        locationDesc: original.locationDesc,
        pyeongTypes: original.pyeongTypes,
        developerId: original.developerId,
        authorId: original.authorId,
        // 이미지도 복제
        images: {
          create: original.images.map((img, index) => ({
            url: img.url,
            alt: img.alt,
            type: img.type,
            order: index,
          })),
        },
      },
      include: {
        developer: true,
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: '매물이 복제되었습니다.',
      property: {
        id: duplicated.id,
        title: duplicated.title,
      },
    });

  } catch (error) {
    console.error('Failed to duplicate property:', error);
    return NextResponse.json(
      { error: '매물 복제에 실패했습니다.' },
      { status: 500 }
    );
  }
}

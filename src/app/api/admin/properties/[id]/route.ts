import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



// 매물 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log('PUT request body:', JSON.stringify(body, null, 2));

    // developerId가 빈 문자열이면 null 처리 또는 기본값 설정
    let developerId = body.developerId;
    if (!developerId || developerId === '') {
      // 시행사 미정 찾기
      const undecidedDev = await prisma.developer.findFirst({
        where: { name: '시행사 미정' }
      });
      if (undecidedDev) {
        developerId = undecidedDev.id;
      } else {
        // 시행사 미정 생성
        const newDev = await prisma.developer.create({
          data: { name: '시행사 미정', description: '추후 입력' }
        });
        developerId = newDev.id;
      }
    }

    // 기존 이미지 삭제
    await prisma.propertyImage.deleteMany({
      where: { propertyId: id },
    });

    // 날짜 검증
    const completionDate = body.completionDate ? new Date(body.completionDate) : new Date();
    const moveInDate = body.moveInDate ? new Date(body.moveInDate) : null;

    const property = await prisma.property.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        address: body.address,
        district: body.district,
        city: body.city,
        zipCode: body.zipCode || null,
        totalUnits: body.totalUnits || 0,
        availableUnits: body.availableUnits || 0,
        buildingType: body.buildingType,
        completionDate: completionDate,
        moveInDate: moveInDate,
        basePrice: BigInt(body.basePrice || 0),
        priceDisplay: body.priceDisplay || null,
        pricePerPyeong: body.pricePerPyeong ? BigInt(body.pricePerPyeong) : null,
        contractDeposit: BigInt(body.contractDeposit || 0),
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
        developerId: developerId,
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

    const serializedProperty = {
      ...property,
      basePrice: property.basePrice.toString(),
      pricePerPyeong: property.pricePerPyeong?.toString(),
      contractDeposit: property.contractDeposit.toString(),
      rightsFee: property.rightsFee?.toString(),
    };

    return NextResponse.json(serializedProperty);
  } catch (error) {
    console.error('Failed to update property:', error);
    return NextResponse.json(
      { message: '매물 수정에 실패했습니다.', error: String(error) },
      { status: 500 }
    );
  }
}

// 매물 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete property:', error);
    return NextResponse.json(
      { message: '매물 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // DB에서 청약 정보 조회 (이미지, 주택형 포함)
    const subscription = await prisma.subscription.findUnique({
      where: { houseManageNo: id },
      include: {
        images: {
          orderBy: [{ category: 'asc' }, { order: 'asc' }],
        },
        housingTypes: {
          orderBy: { houseTy: 'asc' },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: '청약 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 응답 데이터 가공
    const responseData = {
      // 기본 정보
      id: subscription.houseManageNo,
      name: subscription.houseName,
      type: subscription.houseDetailType,
      buildingType: subscription.houseType,
      households: subscription.totalHouseholds,
      region: subscription.region,
      address: subscription.address,
      addressDetail: subscription.addressDetail,
      developer: subscription.developer,
      contractor: subscription.contractor,

      // 일정
      subscriptionStart: subscription.receptionStart?.toISOString(),
      subscriptionEnd: subscription.receptionEnd?.toISOString(),
      announcementDate: subscription.winnerAnnouncementDate?.toISOString(),
      moveInDate: subscription.moveInDate,
      status: subscription.status.toLowerCase(),
      isHot: subscription.isHot,
      viewCount: subscription.viewCount,

      // 가격 정보
      pricePerPyeong: subscription.avgPricePerPyeong || 0,

      // 좌표
      lat: subscription.latitude || 37.5,
      lng: subscription.longitude || 127.0,

      // 일정 상세
      supplySchedule: {
        specialSupply: subscription.specialSupplyDate?.toISOString().split('T')[0],
        firstPriority: subscription.rank1Date?.toISOString().split('T')[0],
        secondPriority: subscription.rank2Date?.toISOString().split('T')[0],
        announcement: subscription.winnerAnnouncementDate?.toISOString().split('T')[0],
        contract: subscription.contractStart && subscription.contractEnd
          ? `${subscription.contractStart.toISOString().split('T')[0]} ~ ${subscription.contractEnd.toISOString().split('T')[0]}`
          : null,
      },

      // 주택형 정보
      supplyTypes: subscription.housingTypes.map(type => ({
        type: type.houseTy,
        area: type.exclusiveArea || type.supplyArea,
        supplyArea: type.supplyArea,
        households: type.totalHouseholds,
        price: type.topPrice || 0,
        pricePerPyeong: type.pricePerPyeong || 0,
      })),

      // 이미지
      images: subscription.images.map(img => img.url),

      // 청약홈 URL
      applyUrl: subscription.noticeUrl || 'https://www.applyhome.co.kr',
      homepage: subscription.homepage,
      modelHousePhone: subscription.modelHousePhone,
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('청약 상세 정보 조회 실패:', error);
    return NextResponse.json(
      { success: false, error: '청약 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

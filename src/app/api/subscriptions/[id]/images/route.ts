import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

// 이미지 카테고리 정의
const IMAGE_CATEGORIES = {
  GALLERY: { key: 'gallery', label: '사진갤러리', order: 1 },
  LOCATION: { key: 'location', label: '입지환경', order: 2 },
  LAYOUT: { key: 'layout', label: '단지배치도', order: 3 },
  UNIT_LAYOUT: { key: 'unit-layout', label: '동호수배치표', order: 4 },
  FLOORPLAN: { key: 'floorplan', label: '면적표', order: 5 },
  MODELHOUSE: { key: 'modelhouse', label: '모델하우스', order: 6 },
  PREMIUM: { key: 'premium', label: '프리미엄', order: 7 },
  COMMUNITY: { key: 'community', label: '커뮤니티', order: 8 },
} as const;

type CategoryKey = keyof typeof IMAGE_CATEGORIES;

interface ImageItem {
  url: string;
  name: string;
}

interface CategoryImages {
  category: string;
  label: string;
  images: ImageItem[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // DB에서 청약 정보 조회
    const subscription = await prisma.subscription.findUnique({
      where: { houseManageNo: id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!subscription) {
      return NextResponse.json({
        success: true,
        data: {
          id,
          hasImages: false,
          categories: [],
          pdfUrl: null,
        }
      });
    }

    // 카테고리별로 이미지 그룹화
    const categoryMap = new Map<string, ImageItem[]>();

    for (const image of subscription.images) {
      const categoryInfo = IMAGE_CATEGORIES[image.category as CategoryKey];
      if (!categoryInfo) continue;

      const catKey = categoryInfo.key;
      if (!categoryMap.has(catKey)) {
        categoryMap.set(catKey, []);
      }

      categoryMap.get(catKey)!.push({
        url: image.url,
        name: path.basename(image.url),
      });
    }

    // 카테고리 배열로 변환
    const categories: CategoryImages[] = [];
    for (const [catKey, images] of categoryMap.entries()) {
      const categoryInfo = Object.values(IMAGE_CATEGORIES).find(c => c.key === catKey);
      if (categoryInfo) {
        categories.push({
          category: catKey,
          label: categoryInfo.label,
          images,
        });
      }
    }

    // 순서대로 정렬
    categories.sort((a, b) => {
      const orderA = Object.values(IMAGE_CATEGORIES).find(c => c.key === a.category)?.order || 99;
      const orderB = Object.values(IMAGE_CATEGORIES).find(c => c.key === b.category)?.order || 99;
      return orderA - orderB;
    });

    // PDF 확인 (NOTICE_PDF 카테고리)
    const pdfImage = subscription.images.find(img => img.category === 'NOTICE_PDF');
    const pdfUrl = pdfImage?.url || null;

    return NextResponse.json({
      success: true,
      data: {
        id,
        hasImages: categories.length > 0 || pdfUrl !== null,
        categories,
        pdfUrl,
        totalImages: subscription.images.filter(img => img.category !== 'NOTICE_PDF').length,
      }
    });

  } catch (error) {
    console.error('Error fetching subscription images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

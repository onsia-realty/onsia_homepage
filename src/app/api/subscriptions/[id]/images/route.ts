import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 이미지 카테고리 정의
const IMAGE_CATEGORIES = {
  gallery: { label: '사진갤러리', order: 1 },
  location: { label: '입지환경', order: 2 },
  layout: { label: '단지배치도', order: 3 },
  'unit-layout': { label: '동호수배치표', order: 4 },
  floorplan: { label: '면적표', order: 5 },
  modelhouse: { label: '모델하우스', order: 6 },
} as const;

type CategoryKey = keyof typeof IMAGE_CATEGORIES;

interface ImageItem {
  url: string;
  name: string;
}

interface CategoryImages {
  category: CategoryKey;
  label: string;
  images: ImageItem[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subscriptionDir = path.join(process.cwd(), 'public', 'uploads', 'subscriptions', id);

    // 디렉토리 존재 여부 확인
    if (!fs.existsSync(subscriptionDir)) {
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

    const categories: CategoryImages[] = [];
    let pdfUrl: string | null = null;

    // PDF 확인
    const pdfPath = path.join(subscriptionDir, 'notice.pdf');
    if (fs.existsSync(pdfPath)) {
      pdfUrl = `/uploads/subscriptions/${id}/notice.pdf`;
    }

    // 카테고리별 이미지 수집
    for (const [catKey, catInfo] of Object.entries(IMAGE_CATEGORIES)) {
      const catDir = path.join(subscriptionDir, catKey);

      if (fs.existsSync(catDir)) {
        const files = fs.readdirSync(catDir)
          .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
          .sort((a, b) => {
            // 숫자 순서로 정렬
            const numA = parseInt(a.match(/\d+/)?.[0] || '0');
            const numB = parseInt(b.match(/\d+/)?.[0] || '0');
            return numA - numB;
          });

        if (files.length > 0) {
          categories.push({
            category: catKey as CategoryKey,
            label: catInfo.label,
            images: files.map(file => ({
              url: `/uploads/subscriptions/${id}/${catKey}/${file}`,
              name: file,
            })),
          });
        }
      }
    }

    // 순서대로 정렬
    categories.sort((a, b) => {
      const orderA = IMAGE_CATEGORIES[a.category]?.order || 99;
      const orderB = IMAGE_CATEGORIES[b.category]?.order || 99;
      return orderA - orderB;
    });

    return NextResponse.json({
      success: true,
      data: {
        id,
        hasImages: categories.length > 0 || pdfUrl !== null,
        categories,
        pdfUrl,
        totalImages: categories.reduce((sum, cat) => sum + cat.images.length, 0),
      }
    });

  } catch (error) {
    console.error('Error fetching subscription images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - 영상 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    const where: Record<string, string> = {};
    if (category) where.category = category;

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.video.count({ where })
    ]);

    // tags JSON 파싱
    const parsedVideos = videos.map(video => ({
      ...video,
      tags: video.tags ? JSON.parse(video.tags) : [],
    }));

    return NextResponse.json({
      videos: parsedVideos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Videos fetch error:', error);
    // 에러 발생해도 빈 배열 반환 (프론트에서 폴백 처리)
    return NextResponse.json({
      videos: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
      }
    });
  }
}

// POST - 새 영상 등록 (관리자용)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { youtubeId, title, description, thumbnail, duration, publishedAt, category, tags } = body;

    // 필수 필드 검증
    if (!youtubeId || !title || !thumbnail) {
      return NextResponse.json(
        { error: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 중복 확인
    const existing = await prisma.video.findUnique({
      where: { youtubeId }
    });

    if (existing) {
      return NextResponse.json(
        { error: '이미 등록된 영상입니다.' },
        { status: 409 }
      );
    }

    // 영상 생성
    const video = await prisma.video.create({
      data: {
        youtubeId,
        title,
        description: description || null,
        thumbnail,
        duration: duration || null,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        category: category || '일반',
        tags: tags ? JSON.stringify(tags) : '[]',
      }
    });

    return NextResponse.json({
      success: true,
      video: {
        ...video,
        tags: tags || [],
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Video creation error:', error);
    return NextResponse.json(
      { error: '영상 등록 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

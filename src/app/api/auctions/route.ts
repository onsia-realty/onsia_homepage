import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuctionItemType, AuctionStatus } from '@prisma/client';

// GET: 경매 물건 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 쿼리 파라미터
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    const district = searchParams.get('district') || '';
    const itemType = searchParams.get('itemType') as AuctionItemType | null;
    const status = searchParams.get('status') as AuctionStatus | null;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured') === 'true';

    // 필터 조건 구성
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { address: { contains: search } },
        { caseNumber: { contains: search } },
        { courtName: { contains: search } },
      ];
    }

    if (city) {
      where.city = city;
    }

    if (district) {
      where.district = district;
    }

    if (itemType) {
      where.itemType = itemType;
    }

    if (status) {
      where.status = status;
    }

    if (minPrice) {
      where.minimumPrice = { ...((where.minimumPrice as object) || {}), gte: BigInt(minPrice) };
    }

    if (maxPrice) {
      where.minimumPrice = { ...((where.minimumPrice as object) || {}), lte: BigInt(maxPrice) };
    }

    if (featured) {
      where.featured = true;
    }

    // 총 개수 조회
    const total = await prisma.auctionItem.count({ where });

    // 목록 조회
    const items = await prisma.auctionItem.findMany({
      where,
      include: {
        images: {
          where: { imageType: 'PHOTO' },
          orderBy: { order: 'asc' },
          take: 1,
        },
        _count: {
          select: {
            registers: true,
            tenants: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { saleDate: 'asc' },
        { createdAt: 'desc' },
      ],
      skip: (page - 1) * limit,
      take: limit,
    });

    // BigInt 직렬화 처리
    const serializedItems = items.map((item) => ({
      ...item,
      appraisalPrice: item.appraisalPrice.toString(),
      minimumPrice: item.minimumPrice.toString(),
      deposit: item.deposit?.toString() || null,
      realPrice: item.realPrice?.toString() || null,
      landAppraisalPrice: item.landAppraisalPrice?.toString() || null,
      buildingAppraisalPrice: item.buildingAppraisalPrice?.toString() || null,
    }));

    return NextResponse.json({
      items: serializedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching auction items:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch auction items', details: errorMessage },
      { status: 500 }
    );
  }
}

// POST: 경매 물건 등록 (관리자)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      caseNumber,
      caseNumberFull,
      courtCode,
      courtName,
      pnu,
      address,
      addressDetail,
      city,
      district,
      itemType,
      landArea,
      buildingArea,
      floor,
      appraisalPrice,
      minimumPrice,
      minimumRate,
      deposit,
      saleDate,
      saleTime,
      bidCount,
      bidEndDate,
      referenceDate,
      hasRisk,
      riskNote,
      owner,
      debtor,
      creditor,
      status,
      featured,
      seoTitle,
      seoDescription,
      registers,
      tenants,
      images,
    } = body;

    // 경매 물건 생성
    const auctionItem = await prisma.auctionItem.create({
      data: {
        caseNumber,
        caseNumberFull,
        courtCode,
        courtName,
        pnu,
        address,
        addressDetail,
        city,
        district,
        itemType: itemType || 'OTHER',
        landArea: landArea ? parseFloat(landArea) : null,
        buildingArea: buildingArea ? parseFloat(buildingArea) : null,
        floor,
        appraisalPrice: BigInt(appraisalPrice),
        minimumPrice: BigInt(minimumPrice),
        minimumRate: minimumRate ? parseInt(minimumRate) : null,
        deposit: deposit ? BigInt(deposit) : null,
        saleDate: saleDate ? new Date(saleDate) : null,
        saleTime,
        bidCount: bidCount || 1,
        bidEndDate: bidEndDate ? new Date(bidEndDate) : null,
        referenceDate: referenceDate ? new Date(referenceDate) : null,
        hasRisk: hasRisk || false,
        riskNote,
        owner,
        debtor,
        creditor,
        status: status || 'SCHEDULED',
        featured: featured || false,
        seoTitle,
        seoDescription,
        // 등기 내역
        registers: registers?.length
          ? {
              create: registers.map((reg: Record<string, unknown>) => ({
                registerType: reg.registerType,
                registerNo: reg.registerNo,
                receiptDate: reg.receiptDate ? new Date(reg.receiptDate as string) : null,
                purpose: reg.purpose,
                rightHolder: reg.rightHolder,
                claimAmount: reg.claimAmount ? BigInt(reg.claimAmount as string) : null,
                isReference: reg.isReference || false,
                willExpire: reg.willExpire !== false,
                note: reg.note,
              })),
            }
          : undefined,
        // 임차인
        tenants: tenants?.length
          ? {
              create: tenants.map((tenant: Record<string, unknown>) => ({
                tenantName: tenant.tenantName,
                hasPriority: tenant.hasPriority,
                occupiedPart: tenant.occupiedPart,
                moveInDate: tenant.moveInDate ? new Date(tenant.moveInDate as string) : null,
                fixedDate: tenant.fixedDate ? new Date(tenant.fixedDate as string) : null,
                hasBidRequest: tenant.hasBidRequest,
                deposit: tenant.deposit ? BigInt(tenant.deposit as string) : null,
                monthlyRent: tenant.monthlyRent ? BigInt(tenant.monthlyRent as string) : null,
                analysis: tenant.analysis,
                note: tenant.note,
              })),
            }
          : undefined,
        // 이미지
        images: images?.length
          ? {
              create: images.map((img: Record<string, unknown>, index: number) => ({
                imageType: img.imageType || 'PHOTO',
                url: img.url,
                originalUrl: img.originalUrl,
                alt: img.alt,
                order: img.order ?? index,
              })),
            }
          : undefined,
      },
      include: {
        registers: true,
        tenants: true,
        images: true,
      },
    });

    // BigInt 직렬화
    const serialized = {
      ...auctionItem,
      appraisalPrice: auctionItem.appraisalPrice.toString(),
      minimumPrice: auctionItem.minimumPrice.toString(),
      deposit: auctionItem.deposit?.toString() || null,
      realPrice: auctionItem.realPrice?.toString() || null,
      registers: auctionItem.registers.map((r) => ({
        ...r,
        claimAmount: r.claimAmount?.toString() || null,
      })),
      tenants: auctionItem.tenants.map((t) => ({
        ...t,
        deposit: t.deposit?.toString() || null,
        monthlyRent: t.monthlyRent?.toString() || null,
      })),
    };

    return NextResponse.json(serialized, { status: 201 });
  } catch (error) {
    console.error('Error creating auction item:', error);
    return NextResponse.json(
      { error: 'Failed to create auction item' },
      { status: 500 }
    );
  }
}

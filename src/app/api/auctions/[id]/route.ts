import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 경매 물건 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const item = await prisma.auctionItem.findUnique({
      where: { id },
      include: {
        bids: {
          orderBy: { round: 'desc' },
        },
        registers: {
          orderBy: { receiptDate: 'asc' },
        },
        tenants: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Auction item not found' },
        { status: 404 }
      );
    }

    // 조회수 증가
    await prisma.auctionItem.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    // BigInt 직렬화
    const serialized = {
      ...item,
      appraisalPrice: item.appraisalPrice.toString(),
      minimumPrice: item.minimumPrice.toString(),
      deposit: item.deposit?.toString() || null,
      realPrice: item.realPrice?.toString() || null,
      bids: item.bids.map((b) => ({
        ...b,
        minimumPrice: b.minimumPrice.toString(),
        winningPrice: b.winningPrice?.toString() || null,
      })),
      registers: item.registers.map((r) => ({
        ...r,
        claimAmount: r.claimAmount?.toString() || null,
      })),
      tenants: item.tenants.map((t) => ({
        ...t,
        deposit: t.deposit?.toString() || null,
        monthlyRent: t.monthlyRent?.toString() || null,
      })),
    };

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Error fetching auction item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch auction item' },
      { status: 500 }
    );
  }
}

// PUT: 경매 물건 수정 (관리자)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // 기존 관계 데이터 삭제 후 재생성
    await prisma.$transaction([
      prisma.auctionRegister.deleteMany({ where: { itemId: id } }),
      prisma.auctionTenant.deleteMany({ where: { itemId: id } }),
      prisma.auctionImage.deleteMany({ where: { itemId: id } }),
    ]);

    // 물건 업데이트
    const updated = await prisma.auctionItem.update({
      where: { id },
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
        itemType,
        landArea: landArea ? parseFloat(landArea) : null,
        buildingArea: buildingArea ? parseFloat(buildingArea) : null,
        floor,
        appraisalPrice: BigInt(appraisalPrice),
        minimumPrice: BigInt(minimumPrice),
        minimumRate: minimumRate ? parseInt(minimumRate) : null,
        deposit: deposit ? BigInt(deposit) : null,
        saleDate: saleDate ? new Date(saleDate) : null,
        saleTime,
        bidCount,
        bidEndDate: bidEndDate ? new Date(bidEndDate) : null,
        referenceDate: referenceDate ? new Date(referenceDate) : null,
        hasRisk,
        riskNote,
        owner,
        debtor,
        creditor,
        status,
        featured,
        seoTitle,
        seoDescription,
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
      ...updated,
      appraisalPrice: updated.appraisalPrice.toString(),
      minimumPrice: updated.minimumPrice.toString(),
      deposit: updated.deposit?.toString() || null,
      realPrice: updated.realPrice?.toString() || null,
      registers: updated.registers.map((r) => ({
        ...r,
        claimAmount: r.claimAmount?.toString() || null,
      })),
      tenants: updated.tenants.map((t) => ({
        ...t,
        deposit: t.deposit?.toString() || null,
        monthlyRent: t.monthlyRent?.toString() || null,
      })),
    };

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Error updating auction item:', error);
    return NextResponse.json(
      { error: 'Failed to update auction item' },
      { status: 500 }
    );
  }
}

// DELETE: 경매 물건 삭제 (관리자)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.auctionItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting auction item:', error);
    return NextResponse.json(
      { error: 'Failed to delete auction item' },
      { status: 500 }
    );
  }
}

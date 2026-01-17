import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      property: {
        select: { id: true, title: true, slug: true },
      },
      subscription: {
        select: { id: true, houseName: true, houseManageNo: true },
      },
      auction: {
        select: { id: true, caseNumber: true, address: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(favorites);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { itemType, propertyId, subscriptionId, auctionId } = body;

  // 이미 추가된 관심 매물인지 확인
  const existing = await prisma.favorite.findFirst({
    where: {
      userId: session.user.id,
      itemType,
      propertyId: propertyId || undefined,
      subscriptionId: subscriptionId || undefined,
      auctionId: auctionId || undefined,
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Already favorited" }, { status: 400 });
  }

  const favorite = await prisma.favorite.create({
    data: {
      userId: session.user.id,
      itemType,
      propertyId: propertyId || null,
      subscriptionId: subscriptionId || null,
      auctionId: auctionId || null,
    },
    include: {
      property: {
        select: { id: true, title: true, slug: true },
      },
      subscription: {
        select: { id: true, houseName: true, houseManageNo: true },
      },
      auction: {
        select: { id: true, caseNumber: true, address: true },
      },
    },
  });

  return NextResponse.json(favorite);
}

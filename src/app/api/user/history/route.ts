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

  const history = await prisma.viewHistory.findMany({
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
    orderBy: { viewedAt: "desc" },
    take: 50, // 최근 50개만
  });

  return NextResponse.json(history);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { itemType, propertyId, subscriptionId, auctionId } = body;

  // 같은 매물을 다시 보면 viewedAt만 업데이트
  const existing = await prisma.viewHistory.findFirst({
    where: {
      userId: session.user.id,
      itemType,
      propertyId: propertyId || undefined,
      subscriptionId: subscriptionId || undefined,
      auctionId: auctionId || undefined,
    },
  });

  if (existing) {
    const updated = await prisma.viewHistory.update({
      where: { id: existing.id },
      data: { viewedAt: new Date() },
    });
    return NextResponse.json(updated);
  }

  const history = await prisma.viewHistory.create({
    data: {
      userId: session.user.id,
      itemType,
      propertyId: propertyId || null,
      subscriptionId: subscriptionId || null,
      auctionId: auctionId || null,
    },
  });

  return NextResponse.json(history);
}

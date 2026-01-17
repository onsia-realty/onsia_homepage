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

  const inquiries = await prisma.propertyInquiry.findMany({
    where: { userId: session.user.id },
    include: {
      property: {
        select: { id: true, title: true, slug: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(inquiries);
}

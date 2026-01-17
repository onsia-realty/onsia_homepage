import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // 본인의 관심 매물인지 확인
  const favorite = await prisma.favorite.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!favorite) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.favorite.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

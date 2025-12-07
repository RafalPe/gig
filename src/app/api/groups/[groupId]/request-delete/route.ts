import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { groupId } = await params;
    const { reason } = await request.json();

    if (!reason) {
      return new NextResponse("Reason is required", { status: 400 });
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { ownerId: true },
    });

    if (!group || group.ownerId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.groupDeletionRequest.create({
      data: {
        groupId,
        userId,
        reason,
      },
    });

    return NextResponse.json({ message: "Request submitted" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

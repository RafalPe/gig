import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  const userName = session?.user?.name || "Ktoś";

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { groupId } = await params;

    const existingMembership = await prisma.membersOnGroups.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (existingMembership) {
      return new NextResponse("User is already in this group", { status: 409 });
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { ownerId: true, name: true },
    });

    if (!group) {
      return new NextResponse("Group not found", { status: 404 });
    }

    await prisma.$transaction([
      prisma.membersOnGroups.create({
        data: { userId, groupId },
      }),
      ...(group.ownerId !== userId
        ? [
            prisma.notification.create({
              data: {
                userId: group.ownerId,
                message: `${userName} dołączył do Twojej ekipy "${group.name}"!`,
              },
            }),
          ]
        : []),
    ]);

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Failed to join group:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

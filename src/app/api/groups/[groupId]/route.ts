import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { groupId } = await params;

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { ownerId: true },
    });

    if (!group) {
      return new NextResponse("Group not found", { status: 404 });
    }

    if (group.ownerId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.membersOnGroups.deleteMany({
      where: { groupId: groupId },
    });

    await prisma.group.delete({ where: { id: groupId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete group:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

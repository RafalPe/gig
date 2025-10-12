import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const groupId = params.groupId;

    await prisma.membersOnGroups.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to leave group:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

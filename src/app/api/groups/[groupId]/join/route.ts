import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
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

    const newMember = await prisma.membersOnGroups.create({
      data: {
        userId,
        groupId,
      },
    });

    return NextResponse.json(newMember, { status: 200 });
  } catch (error) {
    console.error("Failed to join group:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await getServerSession(authOptions);

  try {
    const { id } = await params;
    const eventId = id;
    const groups = await prisma.group.findMany({
      where: {
        eventId: eventId,
      },
      include: {
        owner: {
          select: { id: true, name: true, image: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
    const eventId = id;

    const { name, description } = await request.json();
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const newGroup = await prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          name,
          description,
          eventId,
          ownerId: userId,
        },
      });

      await tx.membersOnGroups.create({
        data: {
          groupId: group.id,
          userId: userId,
        },
      });

      return group;
    });

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error("Failed to create group:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

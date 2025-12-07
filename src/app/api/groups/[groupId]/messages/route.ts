import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type SessionUserWithId = { id?: string | null };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await auth();
  if (!(session?.user as SessionUserWithId)?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { groupId } = await params;

    const messages = await prisma.message.findMany({
      where: {
        groupId,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await auth();
  const userId = (session?.user as SessionUserWithId)?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { content } = await request.json();
    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const { groupId } = await params;

    const newMessage = await prisma.message.create({
      data: {
        content,
        authorId: userId,
        groupId,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

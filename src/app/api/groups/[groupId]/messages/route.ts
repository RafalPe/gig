import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { groupId } = await params;

    const messages = await prisma.message.findMany({
      where: { groupId: groupId },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

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
    const { content } = await request.json();

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        content,
        authorId: userId,
        groupId: groupId,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    await pusherServer.trigger(`group-chat-${groupId}`, 'new-message', newMessage);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Failed to send message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
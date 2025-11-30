import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const event = await prisma.event.findUnique({
      where: { id },
      select: { 
        organizerId: true,
        _count: {
          select: { groups: true }
        }
      },
    });

    if (!event) {
      return new NextResponse('Event not found', { status: 404 });
    }

    const isAdmin = user?.role === 'ADMIN';

    if (event.organizerId !== userId && !isAdmin) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    if (event._count.groups > 0 && !isAdmin) {
      return NextResponse.json(
        { error: 'Cannot delete event with active groups. Please submit a deletion request.' },
        { status: 409 }
      );
    }

    await prisma.event.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete event:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
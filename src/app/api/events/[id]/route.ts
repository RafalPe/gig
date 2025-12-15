import { auth } from "@/lib/auth";
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
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
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
          select: { groups: true },
        },
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    const isAdmin = user?.role === "ADMIN";

    if (event.organizerId !== userId && !isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (event._count.groups > 0 && !isAdmin) {
      return NextResponse.json(
        {
          error:
            "Cannot delete event with active groups. Please submit a deletion request.",
        },
        { status: 409 }
      );
    }

    await prisma.event.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete event:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const event = await prisma.event.findUnique({
      where: { id },
      select: { organizerId: true },
    });

    if (!event) return new NextResponse("Event not found", { status: 404 });

    const isAdmin = user?.role === "ADMIN";
    if (event.organizerId !== userId && !isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        name: body.name,
        artist: body.artist,
        location: body.location,
        description: body.description,
        imageUrl: body.imageUrl,
        sourceUrl: body.sourceUrl,
        date: body.date ? new Date(body.date) : undefined,
        isVerified: body.isVerified,
        lat: body.lat,
        lng: body.lng,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Failed to update event:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

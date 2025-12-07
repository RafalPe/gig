import { auth } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

async function isAdmin(_request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  return user?.role === "ADMIN";
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const events = await prisma.event.findMany({
      where: { isVerified: false, eventType: "USER_SUBMITTED" },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(events);
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const { eventId } = await request.json();
    if (!eventId) {
      return new NextResponse("Event ID is required", { status: 400 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { isVerified: true },
    });

    return NextResponse.json(updatedEvent);
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

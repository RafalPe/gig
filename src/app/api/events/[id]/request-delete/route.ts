import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
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
    const { reason } = await request.json();

    if (!reason) {
      return new NextResponse('Reason is required', { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id },
      select: { organizerId: true }
    });

    if (!event || event.organizerId !== userId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    await prisma.deletionRequest.create({
      data: {
        eventId: id,
        userId: userId,
        reason: reason,
      }
    });

    return NextResponse.json({ message: 'Request submitted' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        groupsMemberOf: {
          include: {
            group: {
              select: {
                id: true,
                name: true,
                event: {
                  select: {
                    id: true,
                    name: true,
                    date: true,
                    imageUrl: true,
                    location: true,
                  }
                }
              }
            }
          },
          orderBy: {
            group: {
              event: {
                date: 'desc'
              }
            }
          }
        },
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
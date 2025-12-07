import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        groupsMemberOf: {
          include: {
            group: {
              include: {
                event: {
                  select: {
                    id: true,
                    name: true,
                    date: true,
                    imageUrl: true,
                    location: true,
                  },
                },
              },
            },
          },
          orderBy: { assignedAt: "desc" },
        },
        eventsOrganized: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            date: true,
            isVerified: true,
            createdAt: true,
            _count: {
              select: { groups: true }
            }, deletionRequests: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                id: true,
                status: true,
                reason: true,
                createdAt: true
              }
            }
          },
        },
      },
    });

    if (!userData) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({
      myGroups: userData.groupsMemberOf.map((membership) => membership.group),
      myEvents: userData.eventsOrganized,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

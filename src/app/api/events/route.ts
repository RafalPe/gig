import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("search");

    const whereCondition = query
      ? {
          AND: [
            { isVerified: true },
            {
              OR: [
                {
                  name: { contains: query, mode: Prisma.QueryMode.insensitive },
                },
                {
                  artist: {
                    contains: query,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  location: {
                    contains: query,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ],
            },
          ],
        }
      : { isVerified: true };

    const events = await prisma.event.findMany({
      where: whereCondition,
      orderBy: { date: "asc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, artist, date, location, description, imageUrl } = body;

    if (!name || !artist || !date || !location) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        name,
        artist,
        date: new Date(date),
        location,
        description,
        imageUrl,
        organizerId: userId,
        eventType: "USER_SUBMITTED",
        isVerified: false,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Failed to create event:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

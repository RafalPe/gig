import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const events = await prisma.event.findMany({
      where: {
        isVerified: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { artist: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        artist: true,
        date: true,
        location: true,
        imageUrl: true,
      },
      take: 5,
      orderBy: { date: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

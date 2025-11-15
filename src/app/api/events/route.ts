import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("search");

    const whereCondition = query
      ? {
          OR: [
            { name: { contains: query } },
            { artist: { contains: query } },
            { location: { contains: query } },
          ],
        }
      : {};

    const events = await prisma.event.findMany({
      where: whereCondition,
      orderBy: {
        date: "asc",
      },
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

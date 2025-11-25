import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
const eventCreateSchema = z.object({
  name: z.string().min(3, "Nazwa wydarzenia musi mieć co najmniej 3 znaki"),
  artist: z.string().min(1, "Artysta jest wymagany"),
  date: z.coerce.date({
    message: "Nieprawidłowy format daty",
  }),
  location: z.string().min(1, "Lokalizacja jest wymagana"),
  description: z.string().optional(),
 imageUrl: z.url({ message: "Nieprawidłowy link do zdjęcia" })
    .or(z.literal(""))
    .optional(),
 sourceUrl: z.url({ message: "Nieprawidłowy link do źródła" }),
});

export async function GET(request: NextRequest) {
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
 const result = eventCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: "Błąd walidacji danych", 
          details: result.error.format() 
        }, 
        { status: 400 }
      );
    }

const { name, artist, date, location, description, imageUrl, sourceUrl } = result.data;

  const newEvent = await prisma.event.create({
      data: {
        name,
        artist,
        date,
        location,
        description: description || null,
        imageUrl: imageUrl || null,
        sourceUrl,
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

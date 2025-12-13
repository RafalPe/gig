import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const DEFAULT_LIMIT = 9;

const eventCreateSchema = z.object({
  name: z.string().min(3, "Nazwa wydarzenia musi mieć co najmniej 3 znaki"),
  artist: z.string().min(1, "Artysta jest wymagany"),
  date: z.coerce.date({
    message: "Nieprawidłowy format daty",
  }),
  location: z.string().min(1, "Lokalizacja jest wymagana"),
  description: z.string().optional(),
  imageUrl: z
    .url({ message: "Nieprawidłowy link do zdjęcia" })
    .or(z.literal(""))
    .optional(),
  sourceUrl: z.url({ message: "Nieprawidłowy link do źródła" }),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("search");

    const page = parseInt(searchParams.get("page") || "1");
    const limitParam = parseInt(searchParams.get("limit") || "");
    const limit =
      !isNaN(limitParam) && limitParam > 0 ? limitParam : DEFAULT_LIMIT;
    const filter = searchParams.get("filter") || "upcoming";

    const skip = (page - 1) * limit;
    const now = new Date();

    const dateCondition: Prisma.DateTimeFilter =
      filter === "past" ? { lt: now } : { gte: now };
    const whereCondition: Prisma.EventWhereInput = {
      AND: [
        { isVerified: true },
        { date: dateCondition },
        ...(query
          ? [
              {
                OR: [
                  {
                    name: {
                      contains: query,
                      mode: Prisma.QueryMode.insensitive,
                    },
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
            ]
          : []),
      ],
    };

    const [events, totalCount] = await prisma.$transaction([
      prisma.event.findMany({
        where: whereCondition,
        orderBy: { date: filter === "past" ? "desc" : "asc" },
        take: limit,
        skip: skip,
      }),
      prisma.event.count({ where: whereCondition }),
    ]);

    return NextResponse.json({
      events,
      pagination: {
        total: totalCount,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();

    const result = eventCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Błąd walidacji danych",
          details: result.error.issues,
        },
        { status: 400 }
      );
    }

    const {
      name,
      artist,
      date,
      location,
      description,
      imageUrl,
      sourceUrl,
      lat,
      lng,
    } = result.data;

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
        lat: lat || null,
        lng: lng || null,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

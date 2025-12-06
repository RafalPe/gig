import { EventType, Prisma } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
const TICKETMASTER_API_URL =
  "https://app.ticketmaster.com/discovery/v2/events.json";
const API_KEY = process.env.TICKETMASTER_API_KEY;

type TicketmasterImage = {
  ratio: string;
  url: string;
  width: number;
  height: number;
};

type TicketmasterEvent = {
  id: string;
  name: string;
  dates?: {
    start?: {
      dateTime?: string;
      localDate?: string;
    };
  };
  _embedded?: {
    attractions?: Array<{ name: string }>;
    venues?: Array<{ name: string }>;
  };
  info?: string;
  images?: TicketmasterImage[];
  url?: string;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");
  const countryCode = searchParams.get("countryCode") || "PL";

  if (!API_KEY) {
    return NextResponse.json(
      { error: "Brak klucza API Ticketmaster" },
      { status: 500 }
    );
  }
  if (!keyword) {
    return NextResponse.json(
      { error: "Słowo kluczowe jest wymagane" },
      { status: 400 }
    );
  }

  try {
    const ticketmasterUrl = `${TICKETMASTER_API_URL}?apikey=${API_KEY}&keyword=${keyword}&countryCode=${countryCode}&size=20`;
    const tmResponse = await fetch(ticketmasterUrl);

    if (!tmResponse.ok) {
      throw new Error("Błąd podczas pobierania danych z Ticketmaster");
    }

    const tmData = await tmResponse.json();
    const events: TicketmasterEvent[] = tmData._embedded?.events || [];

    const upsertOperations = events
      .map((event) => {
        const dateString =
          event.dates?.start?.dateTime || event.dates?.start?.localDate;

        if (!dateString) return null;

        const eventDate = new Date(dateString);
        if (isNaN(eventDate.getTime())) return null;

        // Wybierz obraz o najwyższej rozdzielczości w formacie 16:9
        const bestImage = event.images
          ?.filter((img) => img.ratio === "16_9")
          .sort((a, b) => b.width - a.width)[0];

        const eventData: Prisma.EventCreateInput = {
          name: event.name,
          artist: event._embedded?.attractions?.[0]?.name || "Różni artyści",
          date: eventDate,
          location: event._embedded?.venues?.[0]?.name || "Do ustalenia",
          description: event.info || null,
          imageUrl: bestImage?.url || null,
          externalId: event.id,
          eventType: EventType.OFFICIAL,
          isVerified: true,
          sourceUrl: event.url || "https://www.ticketmaster.com",
        };

        return prisma.event.upsert({
          where: { externalId: event.id },
          update: eventData,
          create: eventData,
        });
      })
      .filter((op) => op !== null);

    if (upsertOperations.length > 0) {
      await prisma.$transaction(upsertOperations);
    }

    return NextResponse.json({
      message: `Pomyślnie przetworzono i zaimportowano ${upsertOperations.length} wydarzeń.`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
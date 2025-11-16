import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { EventType } from "@prisma/client";

const TICKETMASTER_API_URL =
  "https://app.ticketmaster.com/discovery/v2/events.json";
const API_KEY = process.env.TICKETMASTER_API_KEY;

type TicketmasterImage = {
  ratio: string;
  url: string;
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
    const events = tmData._embedded?.events || [];

    let importedCount = 0;
    for (const event of events) {
      const dateString =
        event.dates?.start?.dateTime || event.dates?.start?.localDate;

      if (!dateString) {
        console.warn(
          `Pominięto wydarzenie "${event.name}" z powodu braku daty.`
        );
        continue;
      }

      const eventDate = new Date(dateString);

      if (isNaN(eventDate.getTime())) {
        console.warn(
          `Pominięto wydarzenie "${event.name}" z powodu nieprawidłowej daty: ${dateString}`
        );
        continue;
      }

      const eventData = {
        name: event.name,
        artist: event._embedded?.attractions?.[0]?.name || "Różni artyści",
        date: eventDate,
        location: event._embedded?.venues?.[0]?.name || "Do ustalenia",
        description: event.info || null,
        imageUrl:
          event.images?.find((img: TicketmasterImage) => img.ratio === "16_9")
            ?.url || null,
        externalId: event.id,
        eventType: EventType.OFFICIAL,
        isVerified: true,
      };

      await prisma.event.upsert({
        where: { externalId: event.id },
        update: eventData,
        create: eventData,
      });
      importedCount++;
    }

    return NextResponse.json({
      message: `Pomyślnie zaimportowano ${importedCount} wydarzeń.`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

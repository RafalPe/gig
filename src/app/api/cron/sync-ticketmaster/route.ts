import { EventType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
const TICKETMASTER_API_URL =
  "https://app.ticketmaster.com/discovery/v2/events.json";
const API_KEY = process.env.TICKETMASTER_API_KEY;

const MAX_PAGES_TO_FETCH = 15;

const FILTRED_KEYWORDS = ["vip", "packages", "meet & greet", "premium"];

export async function GET(request: NextRequest) {
  const cronSecret = request.headers.get("authorization");
  if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const allEvents = [];
    for (let page = 0; page < MAX_PAGES_TO_FETCH; page++) {
      const url = `${TICKETMASTER_API_URL}?apikey=${API_KEY}&countryCode=PL&sort=date,asc&size=20&page=${page}`;
      const tmResponse = await fetch(url);

      if (!tmResponse.ok) break;

      const tmData = await tmResponse.json();
      const events = tmData._embedded?.events;

      if (!events || events.length === 0) {
        break;
      }
      allEvents.push(...events);
    }

    let importedCount = 0;
    for (const event of allEvents) {
      const eventNameLower = event.name.toLowerCase();
      if (
        FILTRED_KEYWORDS.some((keyword) => eventNameLower.includes(keyword))
      ) {
        console.warn(`Pominięto (fluff): ${event.name}`);
        continue;
      }

      const dateString =
        event.dates?.start?.dateTime || event.dates?.start?.localDate;
      if (!dateString) continue;

      const eventDate = new Date(dateString);
      if (isNaN(eventDate.getTime())) continue;

      const eventData = {
        name: event.name,
        artist: event._embedded?.attractions?.[0]?.name || "Różni artyści",
        date: eventDate,
        location: event._embedded?.venues?.[0]?.name || "Do ustalenia",
        description: event.info || null,
        imageUrl:
          event.images?.find(
            (img: { ratio?: string; url?: string }) => img.ratio === "16_9"
          )?.url || null,
        externalId: event.id,
        sourceUrl: event.url || "https://www.ticketmaster.com",
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
      message: `Synchronizacja zakończona. Zaimportowano/zaktualizowano ${importedCount} wydarzeń.`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

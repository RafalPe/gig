import { TicketmasterEvent } from "@/types";
import { EventType, Prisma, Event as EventModel } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const TICKETMASTER_API_URL =
  "https://app.ticketmaster.com/discovery/v2/events.json";
const API_KEY = process.env.TICKETMASTER_API_KEY;

const MAX_PAGES_TO_FETCH = 15;
const FILTRED_KEYWORDS = ["vip", "packages", "meet & greet", "premium"];

export async function GET(request: Request) {
  const cronSecret = request.headers.get("authorization");
  if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const allEvents: TicketmasterEvent[] = [];

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

    const upsertOperations = allEvents
      .map((event) => {
        const eventNameLower = event.name.toLowerCase();
        if (
          FILTRED_KEYWORDS.some((keyword) => eventNameLower.includes(keyword))
        ) {
          return null;
        }

        const dateString =
          event.dates?.start?.dateTime || event.dates?.start?.localDate;
        if (!dateString) return null;

        const eventDate = new Date(dateString);
        if (isNaN(eventDate.getTime())) return null;

        const bestImage = event.images
          ?.filter((img) => img.ratio === "16_9")
          .sort((a, b) => b.width - a.width)[0];

        const venue = event._embedded?.venues?.[0];
        const venueName = venue?.name;
        const cityName = venue?.city?.name;

        const latitude = venue?.location?.latitude
          ? parseFloat(venue.location.latitude)
          : null;
        const longitude = venue?.location?.longitude
          ? parseFloat(venue.location.longitude)
          : null;

        let locationString = "Do ustalenia";
        if (venueName && cityName) {
          locationString = `${venueName}, ${cityName}`;
        } else if (venueName) {
          locationString = venueName;
        } else if (cityName) {
          locationString = cityName;
        }

        const eventData: Prisma.EventCreateInput = {
          name: event.name,
          artist: event._embedded?.attractions?.[0]?.name || "Różni artyści",
          date: eventDate,
          location: locationString,
          description: event.info || null,
          imageUrl: bestImage?.url || null,
          externalId: event.id,
          sourceUrl: event.url || "https://www.ticketmaster.com",
          eventType: EventType.OFFICIAL,
          isVerified: true,
          lat: latitude,
          lng: longitude,
        };

        return prisma.event.upsert({
          where: { externalId: event.id },
          update: eventData,
          create: eventData,
        });
      })
      .filter(
        (op): op is Prisma.Prisma__EventClient<EventModel, never> => op !== null
      );

    if (upsertOperations.length > 0) {
      await prisma.$transaction(upsertOperations);
    }

    return NextResponse.json({
      message: `Synchronizacja zakończona. Przetworzono ${allEvents.length}, zapisano/zaktualizowano ${upsertOperations.length} wydarzeń.`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

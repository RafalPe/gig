import { PrismaClient, EventType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  console.log("Cleaning old data...");
  await prisma.membersOnGroups.deleteMany();
  await prisma.message.deleteMany();
  await prisma.group.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.event.deleteMany();

  await prisma.user.deleteMany({
    where: { email: "test-organizer@eventmates.com" },
  });

  console.log("Creating seed organizer...");
  const organizer = await prisma.user.create({
    data: {
      email: "test-organizer@gig.com",
      name: "Testowy Organizator",
    },
  });

  console.log("Creating seed events...");
  const events = await prisma.event.createMany({
    data: [
      {
        name: "Koncert Dawida Podsiadło (Seed)",
        artist: "Dawid Podsiadło",
        date: new Date("2025-11-15T20:00:00Z"),
        location: "Stadion Narodowy, Warszawa",
        description: "Wielki koncert na zakończenie trasy.",
        imageUrl: "https://picsum.photos/seed/podsiadlo/400/200",
        organizerId: organizer.id,
        eventType: EventType.USER_SUBMITTED,
        isVerified: true,
      },
      {
        name: "Open'er Festival (Seed)",
        artist: "Różni artyści",
        date: new Date("2026-07-01T12:00:00Z"),
        location: "Lotnisko Gdynia-Kosakowo, Gdynia",
        description: "Największy festiwal muzyczny w Polsce.",
        imageUrl: "https://picsum.photos/seed/opener/400/200",
        organizerId: organizer.id,
        eventType: EventType.USER_SUBMITTED,
        isVerified: true,
      },
      {
        name: "SANAH NA STADIONACH",
        artist: "sanah",
        date: new Date("2025-12-05T19:00:00Z"),
        location: "Tauron Arena, Kraków",
        description: "Poezja i muzyka w jednym.",
        imageUrl: "https://picsum.photos/seed/sanah/400/200",
        organizerId: organizer.id,
        eventType: EventType.USER_SUBMITTED,
        isVerified: true,
      },
    ],
  });

  console.log(
    `Seeding finished. Created ${events.count} events for user ${organizer.name}.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

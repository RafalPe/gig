import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  await prisma.event.deleteMany();

  const events = await prisma.event.createMany({
    data: [
      {
        name: "Koncert Dawida Podsiadło",
        artist: "Dawid Podsiadło",
        date: new Date("2025-11-15T20:00:00Z"),
        location: "Stadion Narodowy, Warszawa",
        description: "Wielki koncert na zakończenie trasy.",
        imageUrl: "https://picsum.photos/seed/podsiadlo/400/200",
      },
      {
        name: "Open'er Festival",
        artist: "Różni artyści",
        date: new Date("2026-07-01T12:00:00Z"),
        location: "Lotnisko Gdynia-Kosakowo, Gdynia",
        description: "Największy festiwal muzyczny w Polsce.",
        imageUrl: "https://picsum.photos/seed/opener/400/200",
      },
      {
        name: "Koncert Sanah",
        artist: "sanah",
        date: new Date("2025-12-05T19:00:00Z"),
        location: "Tauron Arena, Kraków",
        description: "Poezja i muzyka w jednym.",
        imageUrl: "https://picsum.photos/seed/sanah/400/200",
      },
      {
        name: "Warsaw Festival",
        artist: "various artists",
        date: new Date("2025-12-05T19:00:00Z"),
        location: "Warsaw Arena, Warsaw",
        description: "The biggest music festival in Warsaw.",
      },
      {
        name: "Dni Żarowa",
        artist: "various wack artists",
        date: new Date("2025-12-05T19:00:00Z"),
        location: "Rynek, Żarów",
        description: "XD",
      },
    ],
  });

  console.log(`Seeding finished. Created ${events.count} events.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

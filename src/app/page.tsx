import { Container, Typography, Box } from "@mui/material";
import { Event } from "@/types";
import AnimatedCard from "@/components/AnimatedCard";
import SearchBar from "@/components/SearchBar";

async function getEvents(searchQuery: string | null): Promise<Event[]> {
  const searchParam = searchQuery ? `?search=${searchQuery}` : "";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/events${searchParam}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json();
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { search?: string };
}) {
  const awaitedSearchParams = await searchParams;
  const currentSearch = awaitedSearchParams?.search || null;

  const events = await getEvents(currentSearch);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nadchodzące Wydarzenia
        </Typography>

        <SearchBar />

        {events.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gap: 4,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
            }}
          >
            {events.map((event) => (
              <AnimatedCard key={event.id} event={event} />
            ))}
          </Box>
        ) : (
          <Typography sx={{ textAlign: "center", mt: 4 }}>
            Nie znaleziono wydarzeń pasujących do Twojego wyszukiwania.
          </Typography>
        )}
      </Box>
    </Container>
  );
}

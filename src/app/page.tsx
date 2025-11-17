import { Container, Typography, Box } from "@mui/material";
import AnimatedCard from "@/components/AnimatedCard";
import { getEvents } from "@/lib/api";
import SearchBar from "@/components/SearchBar";
import SuccessToastHandler from "@/components/SuccessToastHandler";

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
      <SuccessToastHandler />
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

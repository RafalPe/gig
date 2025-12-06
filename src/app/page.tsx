import { getEvents } from "@/lib/api";
import { Container, Typography, Box } from "@mui/material";
import AnimatedCard from "@/components/features/events/AnimatedCard";
import EventsPagination from "@/components/features/events/EventsPagination";
import SearchBar from "@/components/layout/SearchBar";
import SuccessToastHandler from "@/components/ui/SuccessToastHandler";
export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; page?: string }>;
}) {
  const awaitedSearchParams = await searchParams;
  const currentSearch = awaitedSearchParams?.search || null;
  const currentPage = Number(awaitedSearchParams?.page) || 1;
  
  const { events, pagination } = await getEvents(currentSearch, currentPage);

  return (
    <Container maxWidth="lg">
      <SuccessToastHandler />
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nadchodzące Wydarzenia
        </Typography>
        
        <SearchBar />

        {events.length > 0 ? (
          <>
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
                mb: 6
              }}
            >
              {events.map((event) => (
                <AnimatedCard key={event.id} event={event} />
              ))}
            </Box>

            {pagination.totalPages > 1 && (
              <EventsPagination 
                count={pagination.totalPages} 
                page={currentPage} 
                currentSearch={currentSearch} 
              />
            )}
          </>
        ) : (
          <Typography sx={{ textAlign: "center", mt: 4 }}>
            Nie znaleziono wydarzeń pasujących do Twojego wyszukiwania.
          </Typography>
        )}
      </Box>
    </Container>
  );
}
import { getEvents } from "@/lib/api";
import { Container, Typography, Box } from "@mui/material";
import AnimatedCard from "@/components/features/events/AnimatedCard";
import EventFilterTabs from "@/components/features/events/EventFilterTabs";
import EventsPagination from "@/components/features/events/EventsPagination";
import SearchBar from "@/components/layout/SearchBar";
import SuccessToastHandler from "@/components/ui/SuccessToastHandler";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    filter?: string;
  }>;
}) {
  const awaitedSearchParams = await searchParams;
  const currentSearch = awaitedSearchParams?.search || null;
  const currentPage = Number(awaitedSearchParams?.page) || 1;
  const currentLimit = Number(awaitedSearchParams?.limit) || 9;
  const currentFilter =
    awaitedSearchParams?.filter === "past" ? "past" : "upcoming";

  const { events, pagination } = await getEvents(
    currentSearch,
    currentPage,
    currentLimit,
    currentFilter
  );

  return (
    <Container maxWidth="lg">
      <SuccessToastHandler />
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          {currentFilter === "past"
            ? "Archiwum Wydarzeń"
            : "Nadchodzące Wydarzenia"}
        </Typography>
        <SearchBar />
        <EventFilterTabs />
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
                mb: 6,
              }}
            >
              {events.map((event) => (
                <AnimatedCard
                  key={event.id}
                  event={event}
                  isPast={currentFilter === "past"}
                />
              ))}
            </Box>
            {(pagination.totalPages > 1 || currentLimit !== 9) && (
              <EventsPagination
                count={pagination.totalPages}
                page={currentPage}
                limit={currentLimit}
                currentSearch={currentSearch}
                filter={currentFilter}
              />
            )}
          </>
        ) : (
          <Typography
            sx={{ textAlign: "center", mt: 8, color: "text.secondary" }}
          >
            {currentSearch
              ? "Nie znaleziono wydarzeń pasujących do wyszukiwania."
              : currentFilter === "past"
              ? "Brak archiwalnych wydarzeń."
              : "Brak nadchodzących wydarzeń."}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

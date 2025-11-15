import { Container, Typography, Box } from "@mui/material";
import { Event } from "@/types";
import AnimatedCard from "@/components/AnimatedCard";

async function getEvents(): Promise<Event[]> {
  const res = await fetch("http://localhost:3000/api/events", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json();
}

export default async function Home() {
  const events = await getEvents();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nadchodzące Wydarzenia
        </Typography>
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
      </Box>
    </Container>
  );
}

import { Container, Typography, Box, Card, CardContent } from "@mui/material";
import { Event } from "@/types";
import Link from "next/link";
import CardMedia from "@mui/material/CardMedia";

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
            <Box key={event.id} sx={{ height: "100%" }}>
              <Link
                href={`/events/${event.id}`}
                style={{
                  textDecoration: "none",
                  display: "block",
                  height: "100%",
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 360,
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={event.imageUrl ?? "/images/gig-placeholder.png"}
                    alt={`Zdjęcie dla ${event.name}`}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2">
                      {event.name}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {event.artist}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1.5 }}>
                      {new Date(event.date).toLocaleDateString("pl-PL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                    <Typography variant="body2">{event.location}</Typography>
                  </CardContent>
                </Card>
              </Link>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

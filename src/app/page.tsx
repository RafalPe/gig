import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Event } from "@/types";
import Link from "next/link";

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
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nadchodzące Wydarzenia
        </Typography>
        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid key={event.id} container spacing={2}>
              <Link
                href={`/events/${event.id}`}
                style={{ textDecoration: "none" }}
              >
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {event.name}
                    </Typography>
                    <Typography color="text.secondary">
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
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

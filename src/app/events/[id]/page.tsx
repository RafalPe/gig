import { Container, Typography, Box, Paper, Button } from "@mui/material";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Event } from "@/types";

async function getEventDetails(id: string): Promise<Event | null> {
  const res = await fetch(`http://localhost:3000/api/events/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch event details");
  }

  return res.json();
}

export default async function EventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const event = await getEventDetails(id);

  if (!event) {
    notFound();
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Button component={Link} href="/" variant="outlined" sx={{ mb: 2 }}>
          &larr; Wróć do listy
        </Button>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {event.name}
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {event.artist}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Gdzie:</strong> {event.location}
          </Typography>
          <Typography variant="body1">
            <strong>Kiedy:</strong>{" "}
            {new Date(event.date).toLocaleString("pl-PL", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </Typography>
          {event.description && (
            <Typography variant="body1" sx={{ mt: 3 }}>
              {event.description}
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

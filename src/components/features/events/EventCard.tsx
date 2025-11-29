import type { Event } from "@/types";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
export default function EventCard({ event }: { event: Event }) {
  const defaultImageUrl = "/images/gig-placeholder.png";

  return (
    <Link
      href={`/events/${event.id}`}
      style={{ textDecoration: "none", display: "block", height: "100%" }}
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
        <Box sx={{ position: "relative", height: "200px" }}>
          <Image
            src={event.imageUrl || defaultImageUrl}
            alt={`Zdjęcie dla ${event.name}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          />
        </Box>
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
  );
}

import { auth } from "@/lib/auth";
import { Event } from "@/types";
import { Typography, Box, Paper, Container } from "@mui/material";
import { notFound } from "next/navigation";
import EventBackButton from "@/components/features/events/EventBackButton";
import CreateGroupForm from "@/components/features/groups/CreateGroupForm";
import GroupsList from "@/components/features/groups/GroupsList";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Image from "next/image";

async function getEventDetails(id: string): Promise<Event | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/events/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch event details");
  }

  return res.json();
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [event, session] = await Promise.all([
    getEventDetails(id),
    auth(),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <EventBackButton />

        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 5,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            backgroundColor: "background.paper",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "40%" },
              minHeight: { xs: 300, md: 400 },
              position: "relative",
              bgcolor: "grey.100",
            }}
          >
            <Image
              src={event.imageUrl || "/images/gig-placeholder.png"}
              alt={event.name}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </Box>

          <Box
            sx={{
              width: { xs: "100%", md: "60%" },
              p: { xs: 3, md: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              {event.name}
            </Typography>
            <Typography
              variant="h4"
              color="primary.main"
              gutterBottom
              sx={{ mb: 3, fontWeight: "medium" }}
            >
              {event.artist}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CalendarTodayIcon color="action" />
                <Typography variant="h6">
                  {new Date(event.date).toLocaleString("pl-PL", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <LocationOnIcon color="action" />
                <Typography variant="h6">{event.location}</Typography>
              </Box>
            </Box>

            {event.description && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  O wydarzeniu:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {event.description}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
              pb: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h4" component="h2" fontWeight="bold">
              Ekipy na to wydarzenie
            </Typography>
            {session && <CreateGroupForm eventId={event.id} />}
          </Box>
          
          <GroupsList eventId={event.id} session={session} />
        </Box>
      </Box>
    </Container>
  );
}
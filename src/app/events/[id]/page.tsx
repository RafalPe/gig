import { EventViewProvider } from "@/components/features/events/EventViewContext";
import { auth } from "@/lib/auth";
import { Event } from "@/types";
import { Typography, Box, Paper, Container } from "@mui/material";
import { notFound } from "next/navigation";
import EventBackButton from "@/components/features/events/EventBackButton";
import EventHeaderImage from "@/components/features/events/EventHeaderImage";
import InlineMap from "@/components/features/events/InlineMap";
import CreateGroupForm from "@/components/features/groups/CreateGroupForm";
import GroupsList from "@/components/features/groups/GroupsList";
import PageTransition from "@/components/ui/PageTransition";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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

  const [event, session] = await Promise.all([getEventDetails(id), auth()]);

  if (!event) {
    notFound();
  }

  return (
    <Container maxWidth="lg">
      <PageTransition>
        <Box sx={{ my: 4 }}>
          <EventBackButton />

          <EventViewProvider>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                mb: 5,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                backgroundColor: "background.paper",
                minHeight: { md: 450 },
              }}
            >
              <Box
                sx={{
                  width: { xs: "100%", md: "45%" },
                  minHeight: { xs: 350, md: "auto" },
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <EventHeaderImage
                  src={event.imageUrl || "/images/gig-placeholder.png"}
                  alt={event.name}
                />
              </Box>

              <Box
                sx={{
                  width: { xs: "100%", md: "55%" },
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
                  sx={{
                    fontWeight: "bold",
                    color: "text.primary",
                    fontSize: { xs: "2rem", md: "3rem" },
                    lineHeight: 1.1,
                  }}
                >
                  {event.name}
                </Typography>
                <Typography
                  variant="h4"
                  color="primary.main"
                  gutterBottom
                  sx={{
                    mb: 4,
                    fontWeight: "medium",
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  {event.artist}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 4,
                  }}
                >
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

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <LocationOnIcon color="action" />
                      <Typography variant="h6">{event.location}</Typography>
                    </Box>

                    {event.lat && event.lng && (
                      <Box sx={{ pl: 4.5 }}>
                        <InlineMap
                          lat={event.lat}
                          lng={event.lng}
                          locationName={event.location}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>

                {event.description && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      O wydarzeniu:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.7,
                        display: "-webkit-box",
                        WebkitLineClamp: 4, // Ograniczamy opis do 4 linii, żeby nie rozpychał karty
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {event.description}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </EventViewProvider>

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
      </PageTransition>
    </Container>
  );
}

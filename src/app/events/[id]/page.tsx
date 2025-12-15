import { EventViewProvider } from "@/components/features/events/EventViewContext";
import { auth } from "@/lib/auth";
import { Event } from "@/types";
import { Typography, Box, Container } from "@mui/material";
import { notFound } from "next/navigation";
import EventBackButton from "@/components/features/events/EventBackButton";
import EventDetailsCard from "@/components/features/events/EventDetailsCard";
import CreateGroupForm from "@/components/features/groups/CreateGroupForm";
import GroupsList from "@/components/features/groups/GroupsList";
import PageTransition from "@/components/ui/PageTransition";

async function getEventDetails(id: string): Promise<Event | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/events/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch event details");

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
            <EventDetailsCard event={event} />
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

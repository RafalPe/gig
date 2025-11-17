import { Typography, Box, Paper, Button, Container } from "@mui/material";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Event, GroupWithMembers } from "@/types";
import CreateGroupForm from "@/components/CreateGroupForm";
import GroupsList from "@/components/GroupsList";

async function getEventDetails(id: string): Promise<Event | null> {
  const res = await fetch(`http://localhost:3000/api/events/${id}`, {
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

async function getGroupsForEvent(id: string): Promise<GroupWithMembers[]> {
  const res = await fetch(`http://localhost:3000/api/events/${id}/groups`, {
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("Failed to fetch groups");
    return [];
  }
  return res.json();
}

export default async function EventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const [event, session, groups] = await Promise.all([
    getEventDetails(id),
    getServerSession(authOptions),
    getGroupsForEvent(id),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Button component={Link} href="/" variant="outlined" sx={{ mb: 2 }}>
          &larr; Wróć do listy
        </Button>

        <Paper
          elevation={3}
          sx={{ borderRadius: 3, overflow: "hidden", mb: 4 }}
        >
          <Box
            sx={{
              height: 300,
              backgroundImage: `url(${
                event.imageUrl || "/images/gig-placeholder.png"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: 3,
              color: "white",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
              },
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {event.name}
              </Typography>
              <Typography variant="h5" color="inherit">
                {event.artist}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ my: 4 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "5fr 7fr",
              },
              gap: 4,
            }}
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                Szczegóły
              </Typography>
              <Paper elevation={1} sx={{ p: 3, height: "100%" }}>
                <Typography variant="body1">
                  <strong>Gdzie:</strong> {event.location}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Kiedy:</strong>{" "}
                  {new Date(event.date).toLocaleString("pl-PL", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </Typography>
                {event.description && (
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {event.description}
                  </Typography>
                )}
              </Paper>
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5">Ekipy na to wydarzenie</Typography>
                {session && <CreateGroupForm eventId={event.id} />}
              </Box>
              <GroupsList groups={groups} session={session} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

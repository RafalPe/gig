"use client";
import { Event } from "@/types";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import VerifyEventModal from "@/components/admin/VerifyEventModal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import toast from "react-hot-toast";

export default function VerifyPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUnverifiedEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/verify");
      if (res.status === 403) throw new Error("Brak uprawnień");
      if (!res.ok) throw new Error("Błąd pobierania");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnverifiedEvents();
  }, []);

  const handleOpenVerify = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSuccess = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const handleReject = async (eventId: string) => {
    if (!confirm("Czy na pewno chcesz trwale usunąć to zgłoszenie?")) return;
    try {
      const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Błąd usuwania");
      toast.success("Zgłoszenie odrzucone (usunięte)");
      handleSuccess(eventId);
    } catch {
      toast.error("Nie udało się usunąć");
    }
  };

  if (isLoading)
    return (
      <Container>
        <Typography sx={{ mt: 4 }}>Ładowanie...</Typography>
      </Container>
    );

  return (
    <Container maxWidth="lg">
      <Paper sx={{ my: 4, p: 4, bgcolor: "#f8f9fa" }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Panel Weryfikacji
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Poniżej znajdują się wydarzenia zgłoszone przez użytkowników. Sprawdź
          poprawność danych przed zatwierdzeniem.
        </Typography>

        {events.length === 0 ? (
          <Typography align="center" sx={{ py: 4 }}>
            Brak wydarzeń oczekujących na weryfikację. Dobra robota!
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {events.map((event) => (
              <Card
                key={event.id}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={event.imageUrl || "/images/gig-placeholder.png"}
                  alt={event.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {event.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.artist}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {new Date(event.date).toLocaleDateString("pl-PL")}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    Lokalizacja: {event.location}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{ p: 2, pt: 0, justifyContent: "space-between" }}
                >
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleReject(event.id)}
                  >
                    Odrzuć
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenVerify(event)}
                  >
                    Weryfikuj
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
      <VerifyEventModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        onSuccess={handleSuccess}
      />
    </Container>
  );
}

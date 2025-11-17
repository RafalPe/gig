"use client";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Link as MuiLink,
} from "@mui/material";
import toast from "react-hot-toast";

type EventToVerify = {
  id: string;
  name: string;
  artist: string;
  sourceUrl: string;
};

export default function VerifyPage() {
  const [events, setEvents] = useState<EventToVerify[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUnverifiedEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/verify");
      if (!res.ok) {
        throw new Error("Nie masz uprawnień lub wystąpił błąd");
      }
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

  const handleApprove = async (eventId: string) => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (!res.ok) {
        throw new Error("Nie udało się zatwierdzić wydarzenia");
      }

      toast.success("Wydarzenie zatwierdzone!");
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Typography>Ładowanie...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ my: 4, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Panel Weryfikacji Wydarzeń
        </Typography>
        <List>
          {events.length > 0 ? (
            events.map((event) => (
              <ListItem
                key={event.id}
                divider
                secondaryAction={
                  <Button
                    variant="contained"
                    onClick={() => handleApprove(event.id)}
                  >
                    Zatwierdź
                  </Button>
                }
              >
                <ListItemText
                  primary={`${event.name} - ${event.artist}`}
                  secondary={
                    <MuiLink
                      href={event.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Sprawdź źródło
                    </MuiLink>
                  }
                />
              </ListItem>
            ))
          ) : (
            <Typography>Brak wydarzeń do weryfikacji.</Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
}

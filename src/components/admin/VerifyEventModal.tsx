"use client";
import { EventViewProvider } from "@/components/features/events/EventViewContext";
import { Event } from "@/types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useState, useEffect } from "react";
import ImageUpload from "../ui/ImageUpload";
import EventDetailsCard from "@/components/features/events/EventDetailsCard";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  onClose: () => void;
  event: Event | null;
  onSuccess: (eventId: string) => void;
};

export default function VerifyEventModal({
  open,
  onClose,
  event,
  onSuccess,
}: Props) {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Reset formularza po otwarciu
  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        date: event.date,
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setFormData({ ...formData, date: newDate.toISOString() });
    }
  };

  const handleSaveAndVerify = async () => {
    if (!event?.id) return;
    setIsSaving(true);

    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isVerified: true,
        }),
      });

      if (!res.ok) throw new Error("Błąd zapisu");

      toast.success("Wydarzenie zaktualizowane i zatwierdzone!");
      onSuccess(event.id);
      onClose();
    } catch {
      toast.error("Nie udało się zapisać zmian.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Weryfikacja: {event.name}</DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Edycja Danych" />
          <Tab label="Podgląd na żywo" />
        </Tabs>
      </Box>

      <DialogContent dividers>
        {tabValue === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                label="Nazwa"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Artysta"
                name="artist"
                value={formData.artist || ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>

            <DateTimePicker
              label="Data"
              value={formData.date ? new Date(formData.date) : null}
              onChange={handleDateChange}
              sx={{ width: "100%" }}
            />

            <TextField
              label="Lokalizacja"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Opis"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />

            <Box sx={{ mt: 1 }}>
              <ImageUpload
                label="Plakat / Zdjęcie Wydarzenia"
                value={formData.imageUrl || ""}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              />
            </Box>

            <TextField
              label="Link źródłowy"
              name="sourceUrl"
              value={formData.sourceUrl || ""}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        ) : (
          <Box sx={{ p: 2, bgcolor: "#fafafa", borderRadius: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 2, display: "block" }}
            >
              Tak wydarzenie będzie wyglądać na stronie szczegółów:
            </Typography>
            <EventViewProvider>
              <EventDetailsCard event={formData as Event} />
            </EventViewProvider>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">
          Anuluj
        </Button>
        <Button
          onClick={handleSaveAndVerify}
          variant="contained"
          color="success"
          disabled={isSaving}
        >
          {isSaving ? "Zapisywanie..." : "Zapisz i Zatwierdź"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

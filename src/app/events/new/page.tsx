"use client";
import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    artist: "",
    location: "",
    description: "",
    imageUrl: "",
    sourceUrl: "",
  });
  const [date, setDate] = useState<Date | null>(new Date());
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.name || !formData.artist || !formData.location || !date) {
      setError("Proszę wypełnić wszystkie wymagane pola.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: date.toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error("Nie udało się utworzyć wydarzenia. Spróbuj ponownie.");
      }
      toast.success("Wydarzenie wysłane do weryfikacji!");
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ my: 4, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stwórz nowe wydarzenie
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Wydarzenie zostanie sprawdzone przez administratora przed publikacją.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nazwa wydarzenia (np. Open'er Festival)"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="artist"
            label="Główny artysta (lub 'Różni artyści')"
            id="artist"
            value={formData.artist}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="location"
            label="Lokalizacja (np. Tauron Arena, Kraków)"
            id="location"
            value={formData.location}
            onChange={handleChange}
          />
          <DateTimePicker
            label="Data i godzina rozpoczęcia"
            value={date}
            onChange={setDate}
            sx={{ width: "100%", mt: 2, mb: 1 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="sourceUrl"
            label="Link do źródła (np. strona wydarzenia)"
            id="sourceUrl"
            value={formData.sourceUrl}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="description"
            label="Krótki opis (opcjonalnie)"
            id="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="imageUrl"
            label="Link do zdjęcia (opcjonalnie)"
            id="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? "Wysyłanie..." : "Wyślij do weryfikacji"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

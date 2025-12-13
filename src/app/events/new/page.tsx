"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { getGeocode } from "@/lib/mapbox";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControlLabel,
  Checkbox,
  Collapse,
  Alert,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import DynamicEventMap from "@/components/features/events/DynamicEventMap";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import toast from "react-hot-toast";

export default function NewEventPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    artist: "",
    location: "",
    exactAddress: "",
    description: "",
    imageUrl: "",
    sourceUrl: "",
  });

  const [date, setDate] = useState<Date | null>(new Date());
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showExactAddress, setShowExactAddress] = useState(false);

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const queryToGeocode = showExactAddress
    ? formData.exactAddress
    : formData.location;
  const debouncedLocation = useDebounce(queryToGeocode, 1000);

  useEffect(() => {
    const fetchCoords = async () => {
      if (!debouncedLocation || debouncedLocation.length < 3) {
        setCoordinates(null);
        return;
      }

      setIsGeocoding(true);
      const coords = await getGeocode(debouncedLocation);
      setCoordinates(coords);
      setIsGeocoding(false);
    };

    fetchCoords();
  }, [debouncedLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (
      !formData.name ||
      !formData.artist ||
      !formData.location ||
      !date ||
      !formData.sourceUrl
    ) {
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
          lat: coordinates?.lat,
          lng: coordinates?.lng,
        }),
      });

      if (!res.ok) {
        throw new Error("Nie udało się utworzyć wydarzenia.");
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
    <Container maxWidth="md">
      {" "}
      <Paper sx={{ my: 4, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Stwórz nowe wydarzenie
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Wydarzenie zostanie sprawdzone przez administratora przed publikacją.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              required
              fullWidth
              label="Nazwa wydarzenia"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="np. Open'er Festival"
            />
            <TextField
              required
              fullWidth
              name="artist"
              label="Główny artysta"
              value={formData.artist}
              onChange={handleChange}
            />
          </Box>

          <DateTimePicker
            label="Data i godzina"
            value={date}
            onChange={setDate}
            sx={{ width: "100%", mt: 3 }}
          />

          <Paper variant="outlined" sx={{ p: 3, mt: 3, bgcolor: "grey.50" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <LocationOnIcon color="primary" /> Lokalizacja
            </Typography>

            <TextField
              required
              fullWidth
              name="location"
              label="Miejsce wydarzenia (Nazwa wyświetlana)"
              id="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="np. Klub Stodoła, Warszawa"
              helperText="Wpisz nazwę klubu i miasto. Mapa zaktualizuje się automatycznie."
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={showExactAddress}
                  onChange={(e) => setShowExactAddress(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Znacznik na mapie jest w złym miejscu? Chcę podać dokładny
                  adres.
                </Typography>
              }
              sx={{ mt: 1 }}
            />

            <Collapse in={showExactAddress}>
              <Box sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Wpisz tutaj dokładny adres (ulica i numer, miasto), który
                  pozwoli mapie znaleźć właściwy punkt. Użytkownicy nadal będą
                  widzieć nazwę wpisaną powyżej.
                </Alert>
                <TextField
                  fullWidth
                  name="exactAddress"
                  label="Dokładny adres techniczny"
                  value={formData.exactAddress}
                  onChange={handleChange}
                  placeholder="np. ul. Batorego 10, 02-591 Warszawa"
                />
              </Box>
            </Collapse>

            <Box
              sx={{
                mt: 3,
                height: 300,
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {isGeocoding ? (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.200",
                  }}
                >
                  <Typography>Szukam na mapie...</Typography>
                </Box>
              ) : coordinates ? (
                <DynamicEventMap
                  lat={coordinates.lat}
                  lng={coordinates.lng}
                  locationName={
                    showExactAddress ? formData.exactAddress : formData.location
                  }
                />
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.200",
                    border: "1px dashed grey",
                  }}
                >
                  <Typography color="text.secondary">
                    Wpisz lokalizację, aby zobaczyć podgląd mapy
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          <TextField
            margin="normal"
            required
            fullWidth
            name="sourceUrl"
            label="Link do wydarzenia"
            value={formData.sourceUrl}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="description"
            label="Opis"
            multiline
            rows={3}
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
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? "Wysyłanie..." : "Wyślij do weryfikacji"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

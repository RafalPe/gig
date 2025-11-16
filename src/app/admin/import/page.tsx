"use client";
import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

export default function ImportPage() {
  const [keyword, setKeyword] = useState("koncert");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImport = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        `/api/import/ticketmaster?keyword=${keyword}&countryCode=PL`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Nieznany błąd");
      }

      setMessage(data.message);
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ my: 4, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Importuj Wydarzenia
        </Typography>
        <Typography gutterBottom>
          Użyj tego panelu, aby zaimportować wydarzenia z API Ticketmaster (dla
          Polski).
        </Typography>
        <TextField
          label="Słowo kluczowe"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? "Importowanie..." : "Uruchom Import"}
        </Button>
        {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
      </Paper>
    </Container>
  );
}

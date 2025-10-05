"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function CreateGroupForm({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!name) {
      setError("Nazwa ekipy jest wymagana.");
      return;
    }

    const response = await fetch(`/api/events/${eventId}/groups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (response.ok) {
      handleClose();
      router.refresh();
    } else {
      const data = await response.json();
      setError(data.message || "Nie udało się stworzyć ekipy.");
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={handleClickOpen} sx={{ mt: 2 }}>
        Stwórz nową ekipę
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nowa ekipa na wydarzenie</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nazwa ekipy"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="description"
            label="Krótki opis (opcjonalnie)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Anuluj</Button>
          <Button onClick={handleSubmit}>Stwórz</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

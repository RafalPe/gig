"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  onClose: () => void;
  id: string | null;
  type: "event" | "group";
};

export default function RequestDeleteModal({ open, onClose, id, type }: Props) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEvent = type === "event";

  const title = isEvent
    ? "Zgłoś prośbę o usunięcie wydarzenia"
    : "Zgłoś prośbę o usunięcie grupy";
  const description = isEvent
    ? "To wydarzenie ma już aktywne ekipy. Aby nie psuć im planów, usunięcie musi zostać zatwierdzone przez administratora."
    : "W tej grupie toczą się aktywne rozmowy innych użytkowników. Usunięcie grupy wymaga zatwierdzenia przez administratora.";

  const handleSubmit = async () => {
    if (!reason.trim() || !id) return;

    setIsSubmitting(true);
    try {
      const endpointBase = isEvent ? "events" : "groups";
      const res = await fetch(`/api/${endpointBase}/${id}/request-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) throw new Error("Błąd wysyłania");

      toast.success(
        `Prośba o usunięcie ${
          isEvent ? "wydarzenia" : "grupy"
        } wysłana do administratora.`
      );
      setReason("");
      onClose();
    } catch {
      toast.error("Wystąpił błąd podczas wysyłania prośby.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {description}
          <br />
          <br />
          Opisz powód usunięcia:
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Powód usunięcia"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting || !reason.trim()}
        >
          {isSubmitting ? "Wysyłanie..." : "Wyślij Prośbę"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

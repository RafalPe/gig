'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import toast from 'react-hot-toast';

type Props = {
  open: boolean;
  onClose: () => void;
  eventId: string | null;
};

export default function RequestDeleteModal({ open, onClose, eventId }: Props) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim() || !eventId) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/events/${eventId}/request-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) throw new Error('Błąd wysyłania');

      toast.success('Prośba o usunięcie została wysłana do administratora.');
      setReason(''); 
      onClose();
    } catch {
      toast.error('Wystąpił błąd podczas wysyłania prośby.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Zgłoś prośbę o usunięcie</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          To wydarzenie ma już aktywne ekipy. Wymagane jest podanie powodu usunięcia.
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
          disabled={isSubmitting || !reason}
        >
          {isSubmitting ? 'Wysyłanie...' : 'Wyślij Prośbę'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
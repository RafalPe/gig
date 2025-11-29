'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
  isDestructive?: boolean; 
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Potwierdź',
  cancelText = 'Anuluj',
  onConfirm,
  onClose,
  isLoading = false,
  isDestructive = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading} color="primary">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          color={isDestructive ? 'error' : 'primary'}
          variant="contained"
          autoFocus
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? 'Przetwarzanie...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
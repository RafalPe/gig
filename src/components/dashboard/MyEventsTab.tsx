"use client";
import { useDeleteEventMutation } from "@/lib/redux/userApi";
import { DashboardEvent } from "@/types";
import {
  Box,
  Button,
  Paper,
  Typography,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import RequestDeleteModal from "@/components/ui/RequestDeleteModal";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Link from "next/link";
import toast from "react-hot-toast";

export default function MyEventsTab({ events }: { events: DashboardEvent[] }) {
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const [requestModalEventId, setRequestModalEventId] = useState<string | null>(
    null
  );
  const [confirmModalEventId, setConfirmModalEventId] = useState<string | null>(
    null
  );

  const handleDeleteClick = (eventId: string, groupsCount: number) => {
    if (groupsCount > 0) {
      setRequestModalEventId(eventId);
    } else {
      setConfirmModalEventId(eventId);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmModalEventId) return;

    try {
      await deleteEvent(confirmModalEventId).unwrap();
      toast.success("Zgłoszenie usunięte.");
      setConfirmModalEventId(null);
    } catch {
      toast.error("Nie udało się usunąć zgłoszenia.");
    }
  };

  const renderDeleteStatus = (event: DashboardEvent) => {
    const latestRequest = event.deletionRequests?.[0];

    if (!latestRequest) return null;

    if (latestRequest.status === "PENDING") {
      return (
        <Chip
          icon={<HourglassEmptyIcon />}
          label="Weryfikacja usuwania"
          color="warning"
          variant="outlined"
          size="small"
        />
      );
    }

    if (latestRequest.status === "REJECTED") {
      return (
        <Tooltip title="Administrator odrzucił poprzednią prośbę. Możesz spróbować ponownie.">
          <Chip
            icon={<CancelIcon />}
            label="Odmowa usunięcia"
            color="error"
            variant="outlined"
            size="small"
          />
        </Tooltip>
      );
    }

    return null;
  };

  if (events.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Nie zgłosiłeś jeszcze żadnych wydarzeń.
        </Typography>
        <Button
          component={Link}
          href="/events/new"
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Dodaj pierwsze wydarzenie
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {events.map((event) => {
          const latestRequest = event.deletionRequests?.[0];
          const isPendingDelete = latestRequest?.status === "PENDING";

          return (
            <Paper
              key={event.id}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h6">{event.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Data: {new Date(event.date).toLocaleDateString("pl-PL")}
                  {event._count.groups > 0 && (
                    <Box
                      component="span"
                      sx={{
                        ml: 2,
                        color: "warning.main",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <GroupIcon fontSize="small" /> {event._count.groups}{" "}
                      aktywnych ekip
                    </Box>
                  )}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    alignItems: "flex-end",
                  }}
                >
                  <Chip
                    icon={
                      event.isVerified ? (
                        <CheckCircleIcon />
                      ) : (
                        <AccessTimeIcon />
                      )
                    }
                    label={
                      event.isVerified
                        ? "Zatwierdzone"
                        : "Oczekuje na weryfikację"
                    }
                    color={event.isVerified ? "success" : "warning"}
                    variant="outlined"
                    size="small"
                  />
                  {renderDeleteStatus(event)}
                </Box>

                <Tooltip
                  title={
                    isPendingDelete
                      ? "Oczekiwanie na decyzję administratora"
                      : event._count.groups > 0
                      ? "Poproś o usunięcie"
                      : "Usuń zgłoszenie"
                  }
                >
                  <span>
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDeleteClick(event.id, event._count.groups)
                      }
                      disabled={isDeleting || isPendingDelete}
                    >
                      {event._count.groups > 0 ? (
                        <ReportProblemIcon />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Paper>
          );
        })}
      </Box>

      <RequestDeleteModal
        open={!!requestModalEventId}
        id={requestModalEventId}
        type="event"
        onClose={() => setRequestModalEventId(null)}
      />

      <ConfirmDialog
        open={!!confirmModalEventId}
        title="Usuwanie zgłoszenia"
        description="Czy na pewno chcesz trwale usunąć to wydarzenie? Tej operacji nie można cofnąć."
        confirmText="Usuń trwale"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmModalEventId(null)}
      />
    </>
  );
}

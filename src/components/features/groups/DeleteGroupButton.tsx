"use client";
import { useDeleteGroupMutation } from "@/lib/redux/groupsApi";
import { IconButton } from "@mui/material";
import { useState } from "react";
import RequestDeleteModal from "@/components/ui/RequestDeleteModal";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import toast from "react-hot-toast";

export default function DeleteGroupButton({
  groupId,
  eventId,
}: {
  groupId: string;
  eventId: string;
}) {
  const [deleteGroup, { isLoading }] = useDeleteGroupMutation();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Czy na pewno chcesz usunąć tę ekipę?")) return;

    try {
      await deleteGroup({ groupId, eventId }).unwrap();
      toast.success("Grupa usunięta.");
    } catch (err) {
      const error = err as { status?: number; data?: unknown };
      if (error.status === 409) {
        setIsRequestModalOpen(true);
      } else {
        toast.error("Nie udało się usunąć grupy.");
      }
    }
  };

  return (
    <>
      <IconButton
        onClick={handleDelete}
        size="small"
        aria-label="delete"
        color="error"
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <DeleteIcon fontSize="inherit" />
        )}
      </IconButton>

      <RequestDeleteModal
        open={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        id={groupId}
        type="group"
      />
    </>
  );
}

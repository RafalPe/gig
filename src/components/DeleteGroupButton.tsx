'use client';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import { useDeleteGroupMutation } from '@/lib/redux/groupsApi';

export default function DeleteGroupButton({
  groupId,
  eventId,
}: {
  groupId: string;
  eventId: string;
}) {
  const [deleteGroup, { isLoading }] = useDeleteGroupMutation();

  const handleDelete = () => {
    if (confirm('Czy na pewno chcesz usunąć tę ekipę?')) {

      deleteGroup({ groupId, eventId });
    }
  };

  return (
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
  );
}
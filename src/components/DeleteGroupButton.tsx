"use client";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch } from "@/lib/redux/hooks";
import { deleteGroup } from "@/lib/redux/groupsSlice";

export default function DeleteGroupButton({ groupId }: { groupId: string }) {
  const dispatch = useAppDispatch();
  const handleDelete = () => dispatch(deleteGroup(groupId));

  return (
    <IconButton onClick={handleDelete} size="small" aria-label="delete">
      <DeleteIcon fontSize="small" />
    </IconButton>
  );
}

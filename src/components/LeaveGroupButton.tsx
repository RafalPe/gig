"use client";

import { Button } from "@mui/material";
import { useAppDispatch } from "@/lib/redux/hooks";
import { leaveGroup } from "@/lib/redux/groupsSlice";

export default function LeaveGroupButton({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  const dispatch = useAppDispatch();

  const handleLeave = () => {
    dispatch(leaveGroup({ groupId, userId }));
  };

  return (
    <Button size="small" variant="outlined" color="error" onClick={handleLeave}>
      Opuść
    </Button>
  );
}

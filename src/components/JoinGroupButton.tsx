"use client";

import { Button } from "@mui/material";
import { useAppDispatch } from "@/lib/redux/hooks";
import { joinGroup } from "@/lib/redux/groupsSlice";

export default function JoinGroupButton({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  const dispatch = useAppDispatch();

  const handleJoin = () => {
    dispatch(joinGroup({ groupId, userId }));
  };

  return (
    <Button size="small" variant="outlined" onClick={handleJoin}>
      Dołącz
    </Button>
  );
}

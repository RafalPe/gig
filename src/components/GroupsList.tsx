"use client";

import { useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { GroupWithMembers } from "@/types";
import { Session } from "next-auth";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setGroups } from "@/lib/redux/groupsSlice";
import JoinGroupButton from "./JoinGroupButton";
import LeaveGroupButton from "./LeaveGroupButton";

export default function GroupsList({
  groups: initialGroups,
  session,
}: {
  groups: GroupWithMembers[];
  session: Session | null;
}) {
  const dispatch = useAppDispatch();

  const groups = useAppSelector((state) => state.groups.groups);

  useEffect(() => {
    dispatch(setGroups(initialGroups));
  }, [dispatch, initialGroups]);

  if (groups.length === 0) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>
        Nikt jeszcze nie stworzył ekipy na to wydarzenie. Bądź pierwszy!
      </Typography>
    );
  }

  const userId = (session?.user as { id?: string })?.id;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Ekipy na to wydarzenie
      </Typography>
      <Paper>
        <List>
          {groups.map((group) => {
            const isMember =
              userId &&
              group.members.some((member) => member.user.id === userId);

            return (
              <ListItem
                key={group.id}
                secondaryAction={
                  session && userId ? (
                    isMember ? (
                      <LeaveGroupButton groupId={group.id} userId={userId} />
                    ) : (
                      <JoinGroupButton groupId={group.id} userId={userId} />
                    )
                  ) : null
                }
              >
                <ListItemText
                  primary={group.name}
                  secondary={`Założyciel: ${group.owner.name} | Członkowie: ${group.members.length}`}
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}

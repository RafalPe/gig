"use client";
import { useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { GroupWithMembers } from "@/types";
import { Session } from "next-auth";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setGroups } from "@/lib/redux/groupsSlice";
import JoinGroupButton from "./JoinGroupButton";
import LeaveGroupButton from "./LeaveGroupButton";
import DeleteGroupButton from "./DeleteGroupButton";
import MessageBoard from "./MessageBoard";

export default function GroupsList({
  groups: initialGroups,
  session,
}: {
  groups: GroupWithMembers[];
  session: Session | null;
}) {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state) => state.groups.groups);
  const pendingAction = useAppSelector((state) => state.groups.pendingAction);

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

  const renderActionButton = (group: GroupWithMembers) => {
    const isMember =
      userId && group.members.some((member) => member.user.id === userId);
    const isLoading = pendingAction?.groupId === group.id;

    if (!session || !userId) {
      return null;
    }

    if (isLoading) {
      return (
        <Button size="small" variant="outlined" disabled>
          {pendingAction?.type === "join" ? "Dołączanie..." : "Opuszczanie..."}
        </Button>
      );
    }

    if (isMember) {
      return <LeaveGroupButton groupId={group.id} userId={userId} />;
    }

    return <JoinGroupButton groupId={group.id} userId={userId} />;
  };

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
                secondaryAction={renderActionButton(group)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {group.name}
                      {userId === group.owner.id && (
                        <DeleteGroupButton groupId={group.id} />
                      )}
                    </Box>
                  }
                  secondary={`Założyciel: ${group.owner.name} | Członkowie: ${group.members.length}`}
                  sx={{ width: "100%" }}
                />
                {isMember && <MessageBoard groupId={group.id} />}
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}

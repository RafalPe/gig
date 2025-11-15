"use client";
import { useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
} from "@mui/material";
import { GroupWithMembers } from "@/types";
import { Session } from "next-auth";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setGroups } from "@/lib/redux/groupsSlice";
import JoinGroupButton from "./JoinGroupButton";
import LeaveGroupButton from "./LeaveGroupButton";
import DeleteGroupButton from "./DeleteGroupButton";
import MessageBoard from "./MessageBoard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";

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
      {groups.map((group) => {
        const isMember =
          userId && group.members.some((member) => member.user.id === userId);

        return (
          <Paper sx={{ mb: 2, overflow: "hidden" }} key={group.id}>
            <Accordion sx={{ backgroundImage: "none", boxShadow: "none" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${group.id}-content`}
                id={`panel-${group.id}-header`}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      {group.name}
                      {userId === group.owner.id && (
                        <DeleteGroupButton groupId={group.id} />
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Założyciel: {group.owner.name} | Członkowie:{" "}
                      {group.members.length}
                    </Typography>
                  </Box>
                  <Box sx={{ pr: 1 }}>{renderActionButton(group)}</Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails
                sx={{ borderTop: 1, borderColor: "divider", p: 0 }}
              >
                <List dense>
                  {group.members.map((member) => (
                    <Link
                      href={`/profile/${member.user.id}`}
                      key={member.user.id}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar
                            src={member.user.image || undefined}
                            sx={{ width: 24, height: 24 }}
                          />
                        </ListItemAvatar>
                        <ListItemText primary={member.user.name} />
                      </ListItemButton>
                    </Link>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>

            {isMember && <MessageBoard groupId={group.id} />}
          </Paper>
        );
      })}
    </Box>
  );
}

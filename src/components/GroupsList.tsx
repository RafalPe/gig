"use client";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  ListItemText,
  Button,
  ListItem,
} from "@mui/material";
import Link from "next/link";
import { GroupWithMembers } from "@/types";
import { Session } from "next-auth";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setGroups } from "@/lib/redux/groupsSlice";
import JoinGroupButton from "./JoinGroupButton";
import LeaveGroupButton from "./LeaveGroupButton";
import DeleteGroupButton from "./DeleteGroupButton";
import MessageBoard from "./MessageBoard";
import MembersListModal from "./MembersListModal";

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

  const [modalState, setModalState] = useState<{
    open: boolean;
    members: GroupWithMembers["members"];
  }>({ open: false, members: [] });

  const handleOpenModal = (members: GroupWithMembers["members"]) => {
    setModalState({ open: true, members });
  };

  const handleCloseModal = () => {
    setModalState({ open: false, members: [] });
  };

  useEffect(() => {
    dispatch(setGroups(initialGroups));
  }, [dispatch, initialGroups]);

  if (groups.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography>
          Nikt jeszcze nie stworzył ekipy na to wydarzenie. Bądź pierwszy!
        </Typography>
      </Paper>
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
            <ListItem
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
              secondaryAction={
                <Box sx={{ mt: { xs: 2, sm: 0 }, pl: 1 }}>
                  {renderActionButton(group)}
                </Box>
              }
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
                secondary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                      mt: 0.5,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Założyciel:
                      <Link
                        href={`/profile/${group.owner.id}`}
                        style={{
                          color: "inherit",
                          fontWeight: "bold",
                          margin: "0 4px",
                        }}
                      >
                        {group.owner.name}
                      </Link>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      |
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => handleOpenModal(group.members)}
                      sx={{
                        p: 0,
                        m: 0,
                        height: "auto",
                        minWidth: "auto",
                        textTransform: "none",
                      }}
                    >
                      Członkowie: {group.members.length}
                    </Button>
                  </Box>
                }
                slotProps={{
                  secondary: { component: "div" },
                }}
              />
            </ListItem>

            {isMember && (
              <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
                <MessageBoard groupId={group.id} />
              </Box>
            )}
          </Paper>
        );
      })}

      <MembersListModal
        open={modalState.open}
        onClose={handleCloseModal}
        members={modalState.members}
      />
    </Box>
  );
}

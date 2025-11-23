"use client";
import { useState } from "react";
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
  ListItem,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { GroupWithMembers } from "@/types";
import { Session } from "next-auth";
import { useGetGroupsQuery } from "@/lib/redux/groupsApi";
import JoinGroupButton from "./JoinGroupButton";
import LeaveGroupButton from "./LeaveGroupButton";
import DeleteGroupButton from "./DeleteGroupButton";
import MessageBoard from "./MessageBoard";
import MembersListModal from "./MembersListModal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function GroupsList({
  eventId,
  session,
}: {
  eventId: string;
  session: Session | null;
}) {

  const { data: groups = [], isLoading, isError } = useGetGroupsQuery(eventId);

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

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center", color: "error.main" }}>
        Wystąpił błąd podczas pobierania ekip.
      </Typography>
    );
  }

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
    if (!session || !userId) {
      return null;
    }

    const isMember = group.members.some((member) => member.user.id === userId);

    if (isMember) {
      return (
        <LeaveGroupButton
          groupId={group.id}
          userId={userId}
          eventId={eventId}
        />
      );
    }

    return (
      <JoinGroupButton groupId={group.id} userId={userId} eventId={eventId} />
    );
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
                      <DeleteGroupButton
                        groupId={group.id}
                        eventId={eventId}
                      />
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

            <Accordion
              sx={{
                backgroundImage: "none",
                boxShadow: "none",
                "&:before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${group.id}-content`}
                id={`panel-${group.id}-header`}
                sx={{
                  borderTop: 1,
                  borderColor: "divider",
                  minHeight: "auto",
                  "&.Mui-expanded": {
                    minHeight: "auto",
                  },
                  "& .MuiAccordionSummary-content": {
                    my: 1.5,
                    "&.Mui-expanded": {
                      my: 1.5,
                    },
                  },
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {group.members.length > 0
                    ? `Pokaż ${group.members.length} członków`
                    : "Nikt jeszcze nie dołączył"}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ borderTop: 1, borderColor: "divider", p: 0 }}
              >
                <List sx={{ width: "100%", p: 0 }}>
                  {group.members.map((member) => (
                    <ListItemButton
                      key={member.user.id}
                      component={Link}
                      href={`/profile/${member.user.id}`}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={member.user.image || undefined}
                          sx={{ width: 24, height: 24 }}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={member.user.name} />
                    </ListItemButton>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>

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
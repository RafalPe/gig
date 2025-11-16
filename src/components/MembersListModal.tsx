"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";
import Link from "next/link";
import { GroupWithMembers } from "@/types";

type MembersListModalProps = {
  open: boolean;
  onClose: () => void;
  members: GroupWithMembers["members"];
};

export default function MembersListModal({
  open,
  onClose,
  members,
}: MembersListModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Członkowie Ekipy</DialogTitle>
      <DialogContent>
        <List dense sx={{ width: "100%", p: 0 }}>
          {members.map((member) => (
            <ListItemButton
              key={member.user.id}
              component={Link}
              href={`/profile/${member.user.id}`}
              onClick={onClose}
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
      </DialogContent>
    </Dialog>
  );
}

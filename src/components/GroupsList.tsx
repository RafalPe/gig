import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { GroupWithMembers } from "@/types";
import { Session } from "next-auth";
import JoinGroupButton from "./JoinGroupButton";

export default function GroupsList({
  groups,
  session,
}: {
  groups: GroupWithMembers[];
  session: Session | null;
}) {
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
                  session && !isMember ? (
                    <JoinGroupButton groupId={group.id} />
                  ) : null
                }
              >
                <ListItemText
                  primary={group.name}
                  secondary={`Założyciel: ${group.owner.name} | Członkowie: ${group.members.length}`}
                />
                {isMember && (
                  <Chip
                    label="Jesteś w tej ekipie"
                    color="success"
                    size="small"
                  />
                )}
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}

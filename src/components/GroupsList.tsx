import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { GroupWithMembers } from "@/types";

export default function GroupsList({ groups }: { groups: GroupWithMembers[] }) {
  if (groups.length === 0) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>
        Nikt jeszcze nie stworzył ekipy na to wydarzenie. Bądź pierwszy!
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Ekipy na to wydarzenie
      </Typography>
      <Paper>
        <List>
          {groups.map((group, index) => (
            <div key={group.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={group.name}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Założyciel: {group.owner.name}
                      </Typography>
                      <br />
                      {group.description}
                    </>
                  }
                />
              </ListItem>
              {index < groups.length - 1 && <Divider component="li" />}
            </div>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { notFound } from "next/navigation";

type Group = {
  id: string;
  name: string;
};

type GroupMembership = {
  group: Group;
};

type UserProfile = {
  id: string;
  name: string;
  image?: string | null;
  createdAt: string;
  groupsMemberOf: GroupMembership[];
};

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data as UserProfile;
}

export default async function UserProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await getUserProfile(params.userId);

  if (!user) {
    notFound();
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper sx={{ p: 4, width: "100%" }}>
          <Avatar
            src={user.image || undefined}
            sx={{ width: 120, height: 120, mb: 2, mx: "auto" }}
          />
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Dołączył {new Date(user.createdAt).toLocaleDateString("pl-PL")}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Ekipy, do których należy:
            </Typography>
            <List>
              {user.groupsMemberOf.map((membership: GroupMembership) => (
                <ListItem key={membership.group.id}>
                  <ListItemText primary={membership.group.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

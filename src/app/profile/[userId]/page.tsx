import { Container, Typography, Box, Paper, Avatar, List, ListItem, ListItemText } from '@mui/material';
import { notFound } from 'next/navigation';

type UserProfile = {
  id: string;
  name: string | null;
  image: string | null;
  createdAt: string;
  groupsMemberOf: {
    group: {
      id: string;
      name: string;
    };
  }[];
};

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/users/${userId}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) return null;
  return res.json();
}

export default async function UserProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  
  const user = await getUserProfile(userId);

  if (!user) {
    notFound();
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
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
            {user.groupsMemberOf.length > 0 ? (
              <List>
                {user.groupsMemberOf.map((membership) => (
                  <ListItem key={membership.group.id} divider>
                    <ListItemText primary={membership.group.name} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" align="center">Brak aktywnych ekip.</Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
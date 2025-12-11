import { Container, Typography, Box, Paper, Avatar, Chip, Divider } from '@mui/material';
import { notFound } from 'next/navigation';
import ProfileGroupCard from '@/components/features/profile/ProfileGroupCard';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';

type UserProfile = {
  id: string;
  name: string | null;
  image: string | null;
  createdAt: string;
  groupsMemberOf: {
    group: {
      id: string;
      name: string;
      event: {
        id: string;
        name: string;
        date: string;
        imageUrl: string | null;
        location: string;
      };
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

 const now = new Date();
  const upcomingGroups = user.groupsMemberOf.filter(
    (m) => new Date(m.group.event.date) >= now
  );
  const pastGroups = user.groupsMemberOf.filter(
    (m) => new Date(m.group.event.date) < now
  );

  return (
  <Container maxWidth="md">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', mb: 4, borderRadius: 3, textAlign: 'center' }}>
          <Avatar
            src={user.image || undefined}
            sx={{ width: 120, height: 120, mb: 2, mx: 'auto', border: '4px solid white', boxShadow: 3 }}
          />
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            {user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Dołączył {new Date(user.createdAt).toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Chip label={`${user.groupsMemberOf.length} Wydarzeń`} color="primary" variant="outlined" />
          </Box>
        </Paper>

        <Box sx={{ width: '100%', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <EventIcon color="primary" />
            <Typography variant="h5" fontWeight="bold">Nadchodzące Plany</Typography>
          </Box>
          
          {upcomingGroups.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
              }}
            >
              {upcomingGroups.map((membership) => (
                <ProfileGroupCard
                  key={membership.group.id}
                  groupName={membership.group.name}
                  eventId={membership.group.event.id}
                  eventName={membership.group.event.name}
                  eventDate={membership.group.event.date}
                  imageUrl={membership.group.event.imageUrl}
                  isPast={false}
                />
              ))}
            </Box>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
              <Typography color="text.secondary">Użytkownik nie ma obecnie zaplanowanych wydarzeń.</Typography>
            </Paper>
          )}
        </Box>

        <Divider sx={{ width: '100%', mb: 6 }} />

        {pastGroups.length > 0 && (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <HistoryIcon color="action" />
              <Typography variant="h5" fontWeight="bold" color="text.secondary">Historia Koncertowa</Typography>
            </Box>
            
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
              }}
            >
              {pastGroups.map((membership) => (
                <ProfileGroupCard
                  key={membership.group.id}
                  groupName={membership.group.name}
                  eventId={membership.group.event.id}
                  eventName={membership.group.event.name}
                  eventDate={membership.group.event.date}
                  imageUrl={membership.group.event.imageUrl}
                  isPast={true}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
}
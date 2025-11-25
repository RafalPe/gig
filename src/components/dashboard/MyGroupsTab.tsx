'use client';
import { DashboardGroup } from '@/types';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from '@mui/material';
import Link from 'next/link';

export default function MyGroupsTab({ groups }: { groups: DashboardGroup[] }) {
  if (groups.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Nie należysz jeszcze do żadnej ekipy.
        </Typography>
        <Button component={Link} href="/" variant="contained" sx={{ mt: 2 }}>
          Znajdź wydarzenie
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
      }}
    >
      {groups.map((group) => (
        <Card key={group.id} sx={{ height: '100%' }}>
          <CardActionArea
            component={Link}
            href={`/events/${group.event.id}`}
            sx={{ height: '100%' }}
          >
            <CardMedia
              component="img"
              height="140"
              image={group.event.imageUrl || '/images/gig-placeholder.png'}
              alt={group.event.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div" noWrap>
                {group.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Wydarzenie: <strong>{group.event.name}</strong>
              </Typography>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                {new Date(group.event.date).toLocaleDateString('pl-PL')} •{' '}
                {group.event.location}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
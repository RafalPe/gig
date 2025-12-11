'use client';

import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  groupName: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  imageUrl: string | null;
  isPast?: boolean;
};

export default function ProfileGroupCard({ groupName, eventId, eventName, eventDate, imageUrl, isPast }: Props) {
  return (
    <Card sx={{ height: '100%', opacity: isPast ? 0.7 : 1, filter: isPast ? 'grayscale(80%)' : 'none' }}>
      <CardActionArea 
        component={Link} 
        href={`/events/${eventId}`} 
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
        <Box sx={{ position: 'relative', width: '100%', height: 120 }}>
          <Image
            src={imageUrl || '/images/gig-placeholder.png'}
            alt={eventName}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 600px) 100vw, 300px"
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              bgcolor: 'rgba(0,0,0,0.6)',
              color: 'white',
              p: 1,
            }}
          >
            <Typography variant="caption" noWrap display="block" fontWeight="bold">
              {eventName}
            </Typography>
          </Box>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, width: '100%', pt: 1.5, pb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2} gutterBottom>
            {groupName}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mt: 'auto' }}>
            <CalendarTodayIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption">
              {new Date(eventDate).toLocaleDateString('pl-PL')}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
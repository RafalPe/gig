'use client';
import type { Event } from '@/types';
import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AnimatedCard({ event }: { event: Event }) {
  const defaultImageUrl = '/images/gig-placeholder.png';
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -50px 0px" }} 
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ height: '100%' }}
    >
      <Link
        href={`/events/${event.id}`}
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      >
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 360,
            position: 'relative',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 8,
            },
          }}
        >
          <Box sx={{ position: 'relative', height: '200px', backgroundColor: '#f0f0f0' }}>
            
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height="100%" 
              animation="wave" 
              sx={{ position: 'absolute', top: 0, left: 0 }}
            />

            <Image
              src={event.imageUrl || defaultImageUrl}
              alt={`Zdjęcie dla ${event.name}`}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              onLoad={() => setIsImageLoaded(true)}
              style={{
                objectFit: 'cover',
                opacity: isImageLoaded ? 1 : 0, 
                transition: 'opacity 0.5s ease-in-out', 
              }}
            />
          </Box>

          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
              {event.name}
            </Typography>
            <Typography color="primary.main" gutterBottom sx={{ fontWeight: 'medium' }}>
              {event.artist}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {new Date(event.date).toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {event.location}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
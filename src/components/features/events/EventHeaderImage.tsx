'use client';
import { Skeleton } from '@mui/material';
import { useState } from 'react';
import Image from 'next/image';

export default function EventHeaderImage({ src, alt }: { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
        sx={{ position: 'absolute', top: 0, left: 0 }}
      />
      
      <Image
        src={src}
        alt={alt}
        fill
        style={{
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.7s ease-in-out', 
        }}
        priority
        sizes="(max-width: 768px) 100vw, 40vw"
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
}
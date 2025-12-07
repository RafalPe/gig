'use client';

import { Button } from '@mui/material';
import Link from 'next/link';

export default function EventBackButton() {
  return (
    <Button component={Link} href="/" variant="outlined" sx={{ mb: 3 }}>
      &larr; Wróć do listy
    </Button>
  );
}
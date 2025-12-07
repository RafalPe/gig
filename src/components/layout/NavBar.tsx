'use client';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Session } from 'next-auth';
import AuthButtons from '../features/auth/AuthButtons';
import NotificationsBell from './NotificationsBell';
import Image from 'next/image';
import Link from 'next/link';

export default function NavBar({ session }: { session: Session | null }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link href="/" style={{ marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
          <Image
            src="/images/gig-logo.png"
            alt="EventMates Logo"
            width={100}
            height={100}
            priority
          />
        </Link>

        {session && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              component={Link}
              href="/events/new"
              variant="contained"
              color="secondary"
            >
              Dodaj wydarzenie
            </Button>
            <NotificationsBell />
          </Box>
        )}
        
        <Box sx={{ ml: session ? 2 : 0 }}>
             <AuthButtons />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
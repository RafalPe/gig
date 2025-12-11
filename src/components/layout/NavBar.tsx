'use client';

import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
} from '@mui/material';
import { Session } from 'next-auth';
import NotificationsBell from './NotificationsBell';
import UserNavMenu from './UserNavMenu';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Image from 'next/image';
import Link from 'next/link';

export default function NavBar({ session }: { session: Session | null }) {
  return (
    <AppBar 
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' },
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Image
                src="/images/gig-logo-sm.png"
                alt="EventMates Logo"
                width={120} 
                height={40}
                style={{ width: 'auto', height: '36px' }}
                priority
              />
            </Box>
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            {session && (
              <>
                <Button
                  component={Link}
                  href="/events/new"
                  variant="contained" 
                  color="primary"
                  size="medium"
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{ 
                    display: { xs: 'none', md: 'flex' },
                    borderRadius: 3, 
                    textTransform: 'none', 
                    fontWeight: 600,
                    px: 3,
                    boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                    '&:hover': { 
                      boxShadow: '0 6px 20px rgba(0,118,255,0.23)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Dodaj wydarzenie
                </Button>
              </>
            )}

            {session && (
                <Box sx={{ color: 'action.active' }}>
                  <NotificationsBell />
                </Box>
            )}

            <UserNavMenu session={session} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
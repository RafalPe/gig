'use client';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
} from '@mui/material';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import AuthButtons from '../features/auth/AuthButtons';
import NotificationsBell from './NotificationsBell';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import Link from 'next/link';

export default function NavBar({ session }: { session: Session | null }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    signOut();
  };

  const handleLogin = () => {
    handleMenuClose();
    signIn('github');
  };

  return (
    <AppBar position="static">
      <Toolbar disableGutters sx={{ px: 2, justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
          <Image
            src="/images/gig-logo-sm.png"
            alt="EventMates Logo"
            width={120} 
            height={40}
            style={{ width: 'auto', height: '40px' }} 
            priority
          />
        </Link>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
          {session && (
            <>
              <Button
                component={Link}
                href="/events/new"
                variant="contained"
                color="secondary"
                startIcon={<AddCircleOutlineIcon />}
              >
                Dodaj wydarzenie
              </Button>
              <NotificationsBell />
            </>
          )}
          
          <Box sx={{ ml: session ? 0 : 2 }}>
             <AuthButtons />
          </Box>
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
          {session && <NotificationsBell />}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  minWidth: 200,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }
            }}
          >
            {session ? [
              <Box key="user" sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar src={session.user?.image || undefined} sx={{ width: 32, height: 32 }} />
                <Box>
                    <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
                      {session.user?.name}
                    </Typography>
                </Box>
              </Box>,
              <Divider key="div1" />,
              <MenuItem key="add" component={Link} href="/events/new">
                <AddCircleOutlineIcon sx={{ mr: 2, color: 'secondary.main' }} /> Dodaj wydarzenie
              </MenuItem>,
              <MenuItem key="dashboard" component={Link} href="/dashboard">
                <DashboardIcon sx={{ mr: 2, color: 'text.secondary' }} /> Mój Dashboard
              </MenuItem>,
              <Divider key="div2" />,
              <MenuItem key="logout" onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 2, color: 'error.main' }} /> Wyloguj się
              </MenuItem>
            ] : (
              <MenuItem onClick={handleLogin}>
                <LoginIcon sx={{ mr: 2 }} /> Zaloguj się
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
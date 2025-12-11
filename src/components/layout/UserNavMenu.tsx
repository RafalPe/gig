'use client';
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  Box,
  Button
} from '@mui/material';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';

interface UserNavMenuProps {
  session: Session | null;
}

export default function UserNavMenu({ session }: UserNavMenuProps) {
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

  if (!session) {
    return (
      <Button 
        onClick={handleLogin}
        variant="contained"
        color="primary"
        startIcon={<LoginIcon />}
        sx={{ borderRadius: 2, textTransform: 'none' }}
      >
        Zaloguj się
      </Button>
    );
  }

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        sx={{ 
          p: 0,
          ml: { xs: 0, md: 1 },
          border: '2px solid',
          borderColor: 'transparent',
          transition: 'border-color 0.2s',
          '&:hover': { borderColor: 'primary.light' }
        }}
      >
        <Avatar 
          src={session.user?.image || undefined} 
          alt={session.user?.name || 'User'}
          sx={{ width: 40, height: 40 }} 
        />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        disableScrollLock={true}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1.5,
              minWidth: 240,
              borderRadius: 3,
              overflow: 'visible',
              filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))',
              border: '1px solid',
              borderColor: 'divider',
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
                borderLeft: '1px solid',
                borderTop: '1px solid',
                borderColor: 'divider',
              },
            },
          }
        }}
      >
        <MenuItem 
          component={Link} 
          href={`/profile/${session.user.id}`} 
          onClick={handleMenuClose}
          sx={{ 
            px: 2.5, 
            py: 2, 
            gap: 2, 
            bgcolor: 'grey.50',
            '&:hover': { bgcolor: 'grey.100' } 
          }}
        >
          <Avatar src={session.user?.image || undefined} sx={{ width: 44, height: 44 }} />
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, color: 'text.primary' }}>
              {session.user?.name}
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: 'text.secondary', display: 'block' }}>
              Zobacz swój profil
            </Typography>
          </Box>
        </MenuItem>
        
        <Divider />
        
        <Box sx={{ py: 1 }}>
          <MenuItem 
            component={Link} 
            href="/events/new" 
            onClick={handleMenuClose}
            sx={{ 
              display: { xs: 'flex', md: 'none' },
              py: 1.5, 
              px: 2.5 
            }}
          >
            <AddCircleOutlineIcon sx={{ mr: 2, color: 'primary.main', fontSize: 20 }} /> 
            <Typography variant="body2" fontWeight={500}>Utwórz wydarzenie</Typography>
          </MenuItem>

          <MenuItem component={Link} href="/dashboard" onClick={handleMenuClose} sx={{ py: 1.5, px: 2.5 }}>
            <DashboardIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} /> 
            <Typography variant="body2" fontWeight={500}>Mój Dashboard</Typography>
          </MenuItem>
        </Box>
        
        <Divider variant="middle" sx={{ my: 0.5 }} />
        
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2.5, color: 'error.main' }}>
          <LogoutIcon sx={{ mr: 2, fontSize: 20 }} /> 
          <Typography variant="body2" fontWeight={600}>Wyloguj się</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

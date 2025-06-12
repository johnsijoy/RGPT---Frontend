import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Topbar = () => {
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : '?');

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#122E3E',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left: Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={require('../../assets/images/rgpt-logo.jpeg')}
            alt="RGPT Logo"
            sx={{ height: 40, width: 'auto', mr: 2 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
            RGPT ERP AI
          </Typography>
        </Box>

        {/* Right: User Avatar + Name */}
        <Box
          onClick={handleMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: 2,
            px: 1,
            py: 0.5,
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: '#fff',
              color: '#122E3E',
              width: 36,
              height: 36,
              fontSize: '1rem',
              mr: 1
            }}
          >
            {getInitial(currentUser?.name)}
          </Avatar>
          <Typography
            variant="body2"
            sx={{
              maxWidth: 100,
              fontSize: '0.9rem',
              color: '#fff',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {currentUser?.name || 'User'}
          </Typography>
        </Box>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 160,
              borderRadius: 1,
              boxShadow: 3,
              py: 1,
            },
          }}
        >
          <MenuItem sx={{ fontSize: '0.95rem' }} onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem sx={{ fontSize: '0.95rem' }} onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;

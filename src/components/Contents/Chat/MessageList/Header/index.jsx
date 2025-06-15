import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMediaQuery, useTheme } from '@mui/material';
import { useThemeMode } from '../../../../../Themes/ThemeContext';

// Create a simple avatar utility function here instead of importing
const stringToColor = (string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

const getInitials = (name) => {
  if ( typeof name === "number" ) {
    return name
  }
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Function to get avatar props based on name
const stringAvatar = (name) => {
  return {
    sx: {
      bgcolor: stringToColor(name || 'User'),
      color: '#ffffff',
      fontWeight: 600,
    },
    children: getInitials(name),
  };
};

export default function Header(props) {
  const { selected, onBack,select } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mode } = useThemeMode();

  // Dynamic styles based on mode
  const appBarStyles = {
    backgroundColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
    color: mode === 'dark' ? '#ffffff' : '#000000',
    borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
    boxShadow: mode === 'dark' 
      ? '0 2px 8px rgba(0,0,0,0.3)' 
      : '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: "16px",
    transition: 'all 0.2s ease-in-out',
  };

  const iconButtonStyles = {
    color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
    '&:hover': {
      backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
      color: mode === 'dark' ? '#ffffff' : '#000000',
    },
    transition: 'all 0.2s ease-in-out',
  };

  const menuStyles = {
    '& .MuiPaper-root': {
      backgroundColor: mode === 'dark' ? '#2a2a2a' : '#ffffff',
      border: mode === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
      boxShadow: mode === 'dark' 
        ? '0 8px 32px rgba(0,0,0,0.5)' 
        : '0 8px 32px rgba(0,0,0,0.15)',
    },
    '& .MuiMenuItem-root': {
      color: mode === 'dark' ? '#ffffff' : '#000000',
      '&:hover': {
        backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
      },
    },
  };

  const avatarStyles = {
    position: 'relative',
    border: mode === 'dark' ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease-in-out',
    width: 40, 
    height: 40,
  };

  const onlineIndicatorStyles = {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: selected.status === "online" ? '#44b700' : (mode === 'dark' ? '#666666' : '#cccccc'),
    border: `2px solid ${mode === 'dark' ? '#1a1a1a' : '#ffffff'}`,
    position: 'absolute',
    bottom: 0,
    right: 0,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Extract name and avatar info
  const contactName = selected.name || (selected.type === "group" ? selected.groupId : selected.userId);
  const isOnline = selected.status === "online";
  
  return (
    <Box >
      <AppBar 
        position="static" 
        elevation={0}
        sx={appBarStyles}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {isMobile && (  
            <IconButton
              edge="start"
              aria-label="go back"
              onClick={onBack}
              sx={{ ...iconButtonStyles, mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          
          <Box sx={{ position: 'relative', mr: 2 }}>
            <Avatar 
              {...stringAvatar(contactName)}
              src={selected.avatar}
              sx={avatarStyles}
            />
            <Box sx={onlineIndicatorStyles} />
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Typography 
              variant="subtitle1" 
              component="div" 
              fontWeight="600"
              sx={{ 
                color: mode === 'dark' ? '#ffffff' : '#000000',
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              {contactName}
            </Typography>
            {isOnline ? (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#44b700',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              >
                Online
              </Typography>
            ) : selected.lastSeen ? (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  fontSize: '0.75rem'
                }}
              >
                Last seen {selected.lastSeen}
              </Typography>
            ) : null}
          </Box>
          
          <IconButton
            size="large"
            edge="end"
            aria-label="menu options"
            aria-controls="contact-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            sx={iconButtonStyles}
          >
            <MoreVertIcon />
          </IconButton>
          
          <Menu
            id="contact-menu"
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
            sx={menuStyles}
          >
            <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Mute Notifications</MenuItem>
            <MenuItem onClick={handleMenuClose}>Search</MenuItem>
            {selected.type === "groupId" ? (
              <MenuItem onClick={handleMenuClose}>Group Info</MenuItem>
            ) : null}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
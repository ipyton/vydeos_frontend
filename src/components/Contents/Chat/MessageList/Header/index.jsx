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
    },
    children: getInitials(name),
  };
};

export default function Header(props) {
  const { selected, onBack } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mode } = useThemeMode();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Extract name and avatar info
  const contactName = selected.name || (selected.type === "groupId" ? selected.groupId : "Chat");
  const isOnline = selected.status === "online";
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        color="primary" 
        elevation={0}
        sx={{ 
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
          backgroundColor: mode === 'dark' ? '#1e1e1e' : 'white',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          {isMobile && (  
            <IconButton
              edge="start"
              color="inherit"
              aria-label="go back"
              onClick={onBack}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          
          <Avatar 
            {...stringAvatar(contactName)}
            src={selected.avatar}
            sx={{ 
              width: 40, 
              height: 40,
              mr: 2,
              border: isOnline ? '2px solid #44b700' : 'none'
            }} 
          />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Typography variant="subtitle1" component="div" fontWeight="500">
              {contactName}
            </Typography>
            {isOnline ? (
              <Typography variant="caption" color="text.secondary">
                Online
              </Typography>
            ) : selected.lastSeen ? (
              <Typography variant="caption" color="text.secondary">
                Last seen {selected.lastSeen}
              </Typography>
            ) : null}
          </Box>
          
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu options"
            aria-controls="contact-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
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
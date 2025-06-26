import React from 'react';
import {
  Drawer,
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';
import ImageIcon from '@mui/icons-material/Image';
import DashboardIcon from '@mui/icons-material/Dashboard';

// Constants
const DRAWER_WIDTH = 240;

const MiniDrawer = styled(Drawer)(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    width: DRAWER_WIDTH,
    '& .MuiDrawer-paper': {
      width: DRAWER_WIDTH,
      boxSizing: 'border-box',
      boxShadow: '0 10px 30px -12px rgba(0, 0, 0, 0.42)',
      borderRight: '0',
      backgroundImage: 'linear-gradient(180deg, rgba(5, 41, 78, 0.9) 0%, rgba(2, 18, 34, 0.95) 100%)',
      color: '#ffffff',
    },
  }),
  ...(!open && {
    width: theme.spacing(8.5),
    '& .MuiDrawer-paper': {
      width: theme.spacing(8.5),
      boxSizing: 'border-box',
      boxShadow: '0 10px 30px -12px rgba(0, 0, 0, 0.42)',
      borderRight: '0',
      backgroundImage: 'linear-gradient(180deg, rgba(5, 41, 78, 0.9) 0%, rgba(2, 18, 34, 0.95) 100%)',
      color: '#ffffff',
    },
  }),
  '& .MuiListItemButton-root': {
    margin: '8px 16px',
    borderRadius: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.14)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(255, 255, 255, 0.16)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      },
    },
  },
  '& .MuiListItemIcon-root': {
    color: '#ffffff',
    opacity: 0.7,
  },
}));

export default function FunctionDrawer({ open, toggleDrawer }) {
  const router = useRouter();
  
  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Blog Posts', icon: <ArticleIcon />, path: '/posts' },
    { text: 'Media Gallery', icon: <ImageIcon />, path: '/gallery' },
    { text: 'Analytics', icon: <DashboardIcon />, path: '/analytics' },
    { text: 'Chat', icon: <ChatIcon />, path: '/chat' },
    { text: 'Profile', icon: <PersonIcon />, path: '/userinfo' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'About', icon: <InfoIcon />, path: '/about' }
  ];
  
  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <MiniDrawer
      variant="permanent"
      open={open}
    >
      <Toolbar />
      <Box sx={{ overflow: 'hidden' }}>
        <List>
          {menuItems.slice(0, 4).map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                selected={router.pathname === item.path}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', my: 1, mx: 2 }} />
        <List>
          {menuItems.slice(4).map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                selected={router.pathname === item.path}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </MiniDrawer>
  );
} 
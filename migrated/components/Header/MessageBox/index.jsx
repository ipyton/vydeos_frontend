import React from 'react';
import {
  Menu,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Button,
  Badge,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { useRouter } from 'next/router';

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    width: 350,
    maxHeight: 500,
    borderRadius: 8,
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
    padding: theme.spacing(1),
  },
}));

const NotificationHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const EmptyNotifications = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

export default function MessageBox({ open, anchorEl, handleClose, notifications }) {
  const router = useRouter();
  
  // Mock notifications for demo
  const demoNotifications = [
    {
      id: '1',
      title: 'New Comment',
      message: 'John Doe commented on your post',
      time: '5 minutes ago',
      read: false,
      avatar: 'https://mui.com/static/images/avatar/1.jpg'
    },
    {
      id: '2',
      title: 'Post Liked',
      message: 'Jane Smith liked your recent post',
      time: '30 minutes ago',
      read: true,
      avatar: 'https://mui.com/static/images/avatar/2.jpg'
    }
  ];

  const allNotifications = notifications?.length ? notifications : demoNotifications;
  
  const handleNotificationClick = (notification) => {
    // Handle click on notification
    handleClose();
    
    // Navigate based on notification type
    router.push('/');
  };

  return (
    <StyledMenu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <NotificationHeader>
        <Typography variant="h6" fontWeight={600}>
          Notifications
        </Typography>
        <Box>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </NotificationHeader>
      
      {allNotifications.length > 0 ? (
        <>
          <List sx={{ pt: 0 }}>
            {allNotifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  alignItems="flex-start" 
                  sx={{ 
                    py: 1.5, 
                    backgroundColor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                    borderRadius: 1,
                    mb: 0.5,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <ListItemAvatar>
                    <Badge
                      variant="dot"
                      color="error"
                      invisible={notification.read}
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <Avatar alt="User" src={notification.avatar} />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: 'block' }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {notification.time}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
          
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Button 
              fullWidth 
              variant="text"
              onClick={() => router.push('/notifications')}
            >
              View All Notifications
            </Button>
          </Box>
        </>
      ) : (
        <EmptyNotifications>
          <NotificationsOffIcon sx={{ fontSize: 48, mb: 2, opacity: 0.6 }} />
          <Typography variant="body1" gutterBottom>
            No new notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You're all caught up!
          </Typography>
        </EmptyNotifications>
      )}
    </StyledMenu>
  );
} 
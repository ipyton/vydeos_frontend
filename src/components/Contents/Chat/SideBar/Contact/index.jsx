import * as React from 'react';
import { ListItem, ListItemText, ListItemAvatar, Avatar, ListItemButton, Badge, Typography, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';

export default function Contact(props) {
  const { userId, name, avatar, unreadCount, lastMessage, lastMessageTime } = props.content;
  const { selected, onClick, isMobile } = props;
  
  const isSelected = React.useMemo(() => {
    if (!selected) {
      return false;
    }
    if (selected.type === "userId") {
      return userId === selected.userId;
    } else if (selected.type === "groupId") {
      return userId === selected.groupId;
    }
    return userId === selected.userId;
  }, [selected, userId]);

  const getTimeString = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <ListItemButton
      onClick={onClick}
      selected={isSelected}
      sx={{
        transition: 'all 0.2s ease',
        borderRadius: isMobile ? '0' : '12px',
        my: 0,
        mx: 0,
        '&:hover': {
          backgroundColor: 'rgba(25, 118, 210, 0.08)',
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(25, 118, 210, 0.12)',
          borderLeft: isMobile ? '4px solid #1976d2' : 'none',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.18)',
          }
        }
      }}
    >
      <ListItem alignItems="flex-start" disableGutters sx={{ py: isMobile ? 1 : 1.5 }}>
        <ListItemAvatar>
          <Badge
            color="error"
            badgeContent={unreadCount || 0}
            invisible={!unreadCount}
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            sx={{
              '& .MuiBadge-badge': {
                boxShadow: '0 0 0 2px #fff',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.6rem' : '0.75rem',
                height: isMobile ? '16px' : '20px',
                minWidth: isMobile ? '16px' : '20px',
              }
            }}
          >
            <Avatar 
              src={avatar}
              sx={{ 
                width: isMobile ? 40 : 48, 
                height: isMobile ? 40 : 48,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {props.content.type === "groupId" ? <GroupIcon /> : <PersonIcon />}
            </Avatar>
          </Badge>
        </ListItemAvatar>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          ml: 1, 
          flexGrow: 1, 
          overflow: 'hidden',
          minWidth: 0
        }}>
          <Typography 
            variant={isMobile ? "body1" : "subtitle1"}
            component="span"
            noWrap
            sx={{ 
              fontWeight: unreadCount ? 700 : 500,
              color: isSelected ? 'primary.main' : 'text.primary',
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}
          >
            {name || userId}
          </Typography>
          
          <Typography 
            variant="body2" 
            component="span"
            noWrap
            sx={{ 
              color: unreadCount ? 'text.primary' : 'text.secondary',
              fontWeight: unreadCount ? 500 : 400,
              opacity: 0.85,
              mt: 0.5,
              fontSize: isMobile ? '0.8rem' : '0.875rem'
            }}
          >
            {lastMessage || "No messages yet"}
          </Typography>
        </Box>
        
        {lastMessageTime && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end', 
            minWidth: isMobile ? '50px' : '70px',
            ml: 1
          }}>
            <Typography
              variant="caption"
              sx={{
                color: unreadCount ? 'primary.main' : 'text.secondary',
                fontWeight: unreadCount ? 600 : 400,
                whiteSpace: 'nowrap',
                fontSize: isMobile ? '0.7rem' : '0.75rem'
              }}
            >
              {getTimeString(lastMessageTime)}
            </Typography>
            
            {unreadCount > 0 && (
              <Box
                sx={{
                  mt: 0.5,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  borderRadius: '50%',
                  width: isMobile ? 18 : 22,
                  height: isMobile ? 18 : 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '0.65rem' : '0.75rem',
                  fontWeight: 'bold'
                }}
              >
                {unreadCount}
              </Box>
            )}
          </Box>
        )}
      </ListItem>
    </ListItemButton>
  );
}
import * as React from 'react';
import { ListItem, ListItemText, ListItemAvatar, Avatar, ListItemButton, Badge, Divider, Typography, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';

export default function Contact(props) {
  const { userId, name, avatar, unreadCount, lastMessage, lastMessageTime } = props.content;
  const { selected, onClick } = props;
  
  const isSelected = React.useMemo(() => {
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
    <>
      <ListItemButton
        onClick={onClick}
        selected={isSelected}
        sx={{
          transition: 'all 0.3s ease',
          borderRadius: '12px',
          my: 0.5,
          mx: 1,
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            transform: 'translateX(4px)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.12)',
            borderLeft: '4px solid #1976d2',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.18)',
            }
          }
        }}
      >
        <ListItem alignItems="flex-start" disableGutters sx={{ py: 1.5 }}>
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
                }
              }}
            >
              <Avatar 
                src={avatar}
                sx={{ 
                  width: 48, 
                  height: 48,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {props.content.type === "groupId" ? <GroupIcon /> : <PersonIcon />}
              </Avatar>
            </Badge>
          </ListItemAvatar>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1, flexGrow: 1, overflow: 'hidden' }}>
            <Typography 
              variant="subtitle1" 
              component="span"
              noWrap
              sx={{ 
                fontWeight: unreadCount ? 700 : 500,
                color: isSelected ? 'primary.main' : 'text.primary',
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
                mt: 0.5
              }}
            >
              {lastMessage || "No messages yet"}
            </Typography>
          </Box>
          
          {lastMessageTime && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '70px' }}>
              <Typography
                variant="caption"
                sx={{
                  color: unreadCount ? 'primary.main' : 'text.secondary',
                  fontWeight: unreadCount ? 600 : 400,
                  whiteSpace: 'nowrap'
                }}
              >
                {getTimeString(lastMessageTime)}
              </Typography>
              
              {unreadCount > 0 && (
                <Box
                  sx={{
                    mt: 1,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
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
      <Divider component="li" variant="inset" sx={{ ml: 7, opacity: 0.6 }} />
    </>
  );
}
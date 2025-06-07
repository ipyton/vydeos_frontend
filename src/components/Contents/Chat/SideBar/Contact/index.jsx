import * as React from 'react';
import { ListItem, ListItemText, ListItemAvatar, Avatar, ListItemButton, Badge, Typography, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import { useThemeMode } from '../../../../../Themes/ThemeContext';

export default function Contact(props) {
  const { userId, name, avatar, count, timestamp,content } = props.content;
  const { selected, onClick, isMobile } = props;
  const { mode } = useThemeMode();
  
  console.log("Contact", props.content);

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
          backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(25, 118, 210, 0.08)',
        },
        '&.Mui-selected': {
          backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(25, 118, 210, 0.08)',
          borderLeft: isMobile ? `4px solid ${mode === 'dark' ? '#90caf9' : '#1976d2'}` : 'none',
          '&:hover': {
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(25, 118, 210, 0.18)',
          }
        }
      }}
    >
      <ListItem alignItems="flex-start" disableGutters sx={{ py: isMobile ? 1 : 1.5 }}>
        <ListItemAvatar>
          <Badge
            color="error"
            invisible={!count}
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            sx={{
              '& .MuiBadge-badge': {
                boxShadow: mode === 'dark' ? '0 0 0 2px #1e1e1e' : '0 0 0 2px #fff',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.6rem' : '0.75rem',
                height: isMobile ? '16px' : '20px',
                minWidth: isMobile ? '16px' : '20px',
                backgroundColor: mode === 'dark' ? '#f44336' : '#d32f2f',
                color: '#ffffff'
              }
            }}
          >
            <Avatar 
              src={avatar}
              sx={{ 
                width: isMobile ? 40 : 48, 
                height: isMobile ? 40 : 48,
                boxShadow: mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              }}
            >
              {props.content.type === "groupId" ? 
                <GroupIcon sx={{ color: mode === 'dark' ? '#ffffff' : 'inherit' }} /> : 
                <PersonIcon sx={{ color: mode === 'dark' ? '#ffffff' : 'inherit' }} />
              }
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
              fontWeight: count ? 700 : 500,
              color: isSelected 
                ? (mode === 'dark' ? '#90caf9' : '#1976d2') 
                : (mode === 'dark' ? '#ffffff' : '#000000'),
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
              color: count 
                ? (mode === 'dark' ? '#e0e0e0' : '#424242')
                : (mode === 'dark' ? '#b0b0b0' : '#757575'),
              fontWeight: count ? 500 : 400,
              opacity: 0.85,
              mt: 0.5,
              fontSize: isMobile ? '0.8rem' : '0.875rem'
            }}
          >
            {content || "No messages yet"}
          </Typography>        
        </Box>
        
        {timestamp && (
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
                color: count 
                  ? (mode === 'dark' ? '#90caf9' : '#1976d2') 
                  : (mode === 'dark' ? '#b0b0b0' : '#757575'),
                fontWeight: count ? 600 : 400,
                whiteSpace: 'nowrap',
                fontSize: isMobile ? '0.7rem' : '0.75rem'
              }}
            >
              {getTimeString(timestamp)}
            </Typography>
            
            {count > 0 && (
              <Box
                sx={{
                  mt: 0.5,
                  backgroundColor: mode === 'dark' ? '#90caf9' : '#1976d2',
                  color: mode === 'dark' ? '#000000' : '#ffffff',
                  borderRadius: '50%',
                  width: isMobile ? 18 : 22,
                  height: isMobile ? 18 : 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '0.65rem' : '0.75rem',
                  fontWeight: 'bold',
                  boxShadow: mode === 'dark' ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {count}
              </Box>
            )}
          </Box>
        )}
      </ListItem>
    </ListItemButton>
  );
}
import * as React from 'react';
import { 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  ListItemButton, 
  Badge, 
  Typography, 
  Box,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useThemeMode } from '../../../../../Themes/ThemeContext';

export default function Contact(props) {
  const { userId, name, avatar, count, timestamp, content } = props.content;
  const { selected, onClick, isMobile, onDelete, markAsRead } = props;
  const { mode } = useThemeMode();
  
  // Touch and swipe handling
  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);
  const [swipeOffset, setSwipeOffset] = React.useState(0);
  const [isSwipeActive, setIsSwipeActive] = React.useState(false);
  const [swipeDirection, setSwipeDirection] = React.useState(null);
  
  // Context menu handling
  const [contextMenu, setContextMenu] = React.useState(null);
  
  // Refs
  const containerRef = React.useRef(null);
  const animationRef = React.useRef(null);
  

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

  // Swipe gesture constants
  const minSwipeDistance = 50;
  const maxSwipeOffset = 100;
  const actionThreshold = 80;

  // Touch event handlers
  const onTouchStart = (e) => {
    if (!isMobile) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwipeActive(true);
  };

  const onTouchMove = (e) => {
    if (!isMobile || !isSwipeActive) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;
    
    // Limit swipe offset
    const limitedOffset = Math.max(-maxSwipeOffset, Math.min(maxSwipeOffset, -diff));
    setSwipeOffset(limitedOffset);
    
    // Determine swipe direction
    if (Math.abs(limitedOffset) > 10) {
      setSwipeDirection(limitedOffset > 0 ? 'right' : 'left');
    }
    
    setTouchEnd(currentTouch);
  };

  const onTouchEnd = () => {
    if (!isMobile || !isSwipeActive) return;
    
    setIsSwipeActive(false);
    
    if (!touchStart || !touchEnd) {
      resetSwipe();
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (Math.abs(swipeOffset) > actionThreshold) {
      if (isLeftSwipe && onDelete) {
        // Left swipe - delete
        onDelete(userId);
      } else if (isRightSwipe && markAsRead) {
        // Right swipe - mark as read
        markAsRead(props.content.type, userId);
      }
    }
    
    resetSwipe();
  };

  const resetSwipe = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    animationRef.current = setTimeout(() => {
      setSwipeOffset(0);
      setSwipeDirection(null);
    }, 100);
  };

  // Context menu handlers
  const handleContextMenu = (event) => {
    if (isMobile) return;
    
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null,
    );
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const handleDelete = () => {
    handleContextMenuClose();
    if (onDelete) {
      onDelete(userId);
    }
  };


  // Cleanup animation on unmount
  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const getSwipeActionColor = () => {
    if (!swipeDirection) return 'transparent';
    
    if (swipeDirection === 'left') {
      // Delete action - red
      return mode === 'dark' ? '#d32f2f' : '#f44336';
    } else {
      // Mark as read action - green
      return mode === 'dark' ? '#388e3c' : '#4caf50';
    }
  };

  const getSwipeActionIcon = () => {
    if (!swipeDirection) return null;
    
    if (swipeDirection === 'left') {
      return <DeleteIcon sx={{ color: 'white' }} />;
    } else {
      return <MarkEmailReadIcon sx={{ color: 'white' }} />;
    }
  };

  return (
    <>
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          // Removed the backgroundColor change - keep it transparent always
          backgroundColor: 'transparent',
          transition: isSwipeActive ? 'none' : 'all 0.3s ease',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onContextMenu={handleContextMenu}
      >
        {/* Swipe action background */}
        {isSwipeActive && swipeDirection && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: swipeDirection === 'left' ? 'auto' : 0,
              right: swipeDirection === 'left' ? 0 : 'auto',
              bottom: 0,
              width: Math.abs(swipeOffset),
              backgroundColor: getSwipeActionColor(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: swipeDirection === 'left' ? 'flex-end' : 'flex-start',
              paddingX: 2,
              zIndex: 1,
            }}
          >
            {getSwipeActionIcon()}
          </Box>
        )}
        
        <ListItemButton
          onClick={onClick}
          selected={isSelected}
          sx={{
            transition: isSwipeActive ? 'none' : 'all 0.2s ease',
            transform: `translateX(${swipeOffset}px)`,
            borderRadius: isMobile ? '0' : '12px',
            my: 0,
            mx: 0,
            position: 'relative',
            zIndex: 2,
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#fff',
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
      </Box>

      {/* Context Menu for Desktop */}
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        PaperProps={{
          sx: {
            backgroundColor: mode === 'dark' ? '#2d2d2d' : '#ffffff',
            boxShadow: mode === 'dark' 
              ? '0 8px 32px rgba(0,0,0,0.4)' 
              : '0 8px 32px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            minWidth: '160px',
          }
        }}
      >
        <MenuItem 
          onClick={()=>{markAsRead(props.content.type,userId)}}
          disabled={!count || !markAsRead}
          sx={{
            color: mode === 'dark' ? '#ffffff' : '#000000',
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
            }
          }}
        >
          <MarkEmailReadIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          Mark as Read
        </MenuItem>
        <MenuItem 
          onClick={handleDelete}
          disabled={!onDelete}
          sx={{
            color: mode === 'dark' ? '#f44336' : '#d32f2f',
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(244,67,54,0.1)' : 'rgba(211,47,47,0.1)',
            }
          }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
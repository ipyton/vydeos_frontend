import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Paper,
  Slider,
  useTheme,
  Chip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DownloadIcon from '@mui/icons-material/Download';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

const MessageBubble = ({ 
  message, 
  isOwn = false, 
  timestamp, 
  senderName,
  darkMode = false,
  onDelete,
  onWithdraw
}) => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [contextMenu, setContextMenu] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);
  
  senderName = senderName || 'Unknown Sender';
  
//message.type = "status"

  const formatDateAndTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const timeStr = messageDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (messageDate.toDateString() === today.toDateString()) {
      return `Today ${timeStr}`;
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${timeStr}`;
    } else {
      const dateStr = messageDate.toLocaleDateString([], { 
        year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
        month: 'short', 
        day: 'numeric'
      });
      return `${dateStr} ${timeStr}`;
    }
  };

  const getAbsoluteTime = (timestamp) => {
    return new Date(timestamp).toLocaleString([], { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAudioPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleContextMenu = (event) => {
    // Don't show context menu for status messages
    if (message.type === 'status') return;
    
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

  const handleTouchStart = (e) => {
    // Don't show context menu for status messages
    if (message.type === 'status') return;
    
    const timer = setTimeout(() => {
      const touch = e.touches[0];
      setContextMenu({
        mouseX: touch.clientX + 2,
        mouseY: touch.clientY - 6,
      });
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const getStatusIcon = (severity) => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon fontSize="small" />;
      case 'warning':
        return <WarningIcon fontSize="small" />;
      case 'error':
        return <ErrorIcon fontSize="small" />;
      case 'info':
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const getStatusColor = (severity) => {
    switch (severity) {
      case 'success':
        return theme.palette.success;
      case 'warning':
        return theme.palette.warning;
      case 'error':
        return theme.palette.error;
      case 'info':
      default:
        return theme.palette.info;
    }
  };

  const renderMessageContent = () => {
    if (message.withdrawn) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontStyle: 'italic', opacity: 0.6 }}>
          <UndoIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2">This message was withdrawn</Typography>
        </Box>
      );
    }

    switch (message.type) {
      case 'status':
        const statusColor = getStatusColor(message.severity);
        return (
          <Chip
            icon={getStatusIcon(message.severity)}
            label={message.content}
            variant="outlined"
            size="small"
            sx={{
              borderColor: statusColor.main,
              color: statusColor.main,
              backgroundColor: darkMode 
                ? `${statusColor.main}15` 
                : `${statusColor.main}10`,
              '& .MuiChip-icon': {
                color: statusColor.main
              }
            }}
          />
        );

      case 'text':
      case 'single':
        return (
          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
            {message.content}
          </Typography>
        );

      case 'image':
        return (
          <Box sx={{ maxWidth: 300 }}>
            <Box
              component="img"
              src={message.url}
              alt="Shared image"
              sx={{
                borderRadius: 2,
                width: '100%',
                height: 'auto',
                maxHeight: 256,
                objectFit: 'cover',
                cursor: 'pointer',
                '&:hover': { opacity: 0.9 },
                transition: 'opacity 0.2s'
              }}
              onClick={() => window.open(message.url, '_blank')}
            />
            {message.caption && (
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                {message.caption}
              </Typography>
            )}
          </Box>
        );

      case 'video':
        return (
          <Box sx={{ maxWidth: 300 }}>
            <Box
              component="video"
              src={message.url}
              controls
              sx={{
                borderRadius: 2,
                width: '100%',
                height: 'auto',
                maxHeight: 256
              }}
              preload="metadata"
            />
            {message.caption && (
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                {message.caption}
              </Typography>
            )}
          </Box>
        );

      case 'audio':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
            <IconButton
              onClick={handleAudioPlay}
              sx={{
                bgcolor: isOwn ? 'rgba(255,255,255,0.2)' : theme.palette.action.hover,
                '&:hover': {
                  bgcolor: isOwn ? 'rgba(255,255,255,0.3)' : theme.palette.action.selected,
                }
              }}
              size="small"
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            
            <Box sx={{ flex: 1 }}>
              <Slider
                value={(audioCurrentTime / audioDuration) * 100 || 0}
                size="small"
                sx={{
                  color: isOwn ? 'rgba(255,255,255,0.7)' : theme.palette.primary.main,
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {formatDuration(audioCurrentTime)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {formatDuration(message.duration || 0)}
                </Typography>
              </Box>
            </Box>

            <VolumeUpIcon sx={{ fontSize: 16, opacity: 0.7 }} />
          </Box>
        );

      default:
        return <Typography>Unsupported message type</Typography>;
    }
  };

  // Special rendering for status messages
  if (message.type === 'status') {
    return (
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        {renderMessageContent()}
        
        {timestamp && (
          <Typography 
            variant="caption" 
            component="div"
            title={getAbsoluteTime(timestamp)}
            sx={{ 
              mt: 0.5,
              cursor: 'help',
              color: darkMode ? theme.palette.grey[500] : theme.palette.grey[400]
            }}
          >
            {formatDateAndTime(timestamp)}
          </Typography>
        )}
      </Box>
    );
  }

  // Regular message rendering
  return (
    <Box sx={{ mb: 2, textAlign: isOwn ? 'right' : 'left' }}>
      {!isOwn && senderName && !message.withdrawn && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block',
            px: 1,
            mb: 0.5,
            color: darkMode ? theme.palette.grey[400] : theme.palette.grey[600]
          }}
        >
          {senderName}
        </Typography>
      )}
      
      <Paper
        elevation={1}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        sx={{
          display: 'inline-block',
          maxWidth: { xs: '85%', sm: '70%', md: '60%' },
          borderRadius: 3,
          px: 2,
          py: 1.5,
          cursor: 'context-menu',
          userSelect: 'none',
          transition: 'box-shadow 0.2s',
          '&:hover': {
            boxShadow: theme.shadows[2]
          },
          ...(isOwn ? {
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            ml: 'auto'
          } : {
            bgcolor: darkMode ? theme.palette.grey[700] : theme.palette.background.paper,
            color: darkMode ? theme.palette.common.white : theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
            mr: 'auto'
          })
        }}
      >
        {renderMessageContent()}
      </Paper>
      
      <Box sx={{ 
        mt: 0.5,
        px: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOwn ? 'flex-end' : 'flex-start',
        gap: 0.25
      }}>
        <Typography 
          variant="caption" 
          component="div"
          title={getAbsoluteTime(timestamp)}
          sx={{ 
            cursor: 'help',
            color: darkMode ? theme.palette.grey[500] : theme.palette.grey[400]
          }}
        >
          {formatDateAndTime(timestamp)}
        </Typography>

      </Box>

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {isOwn && !message.withdrawn && (
          <MenuItem onClick={() => { onWithdraw(); handleClose(); }}>
            <ListItemIcon>
              <UndoIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Withdraw</ListItemText>
          </MenuItem>
        )}
        <MenuItem 
          onClick={() => { onDelete(); handleClose(); }}
          sx={{ color: theme.palette.error.main }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MessageBubble;
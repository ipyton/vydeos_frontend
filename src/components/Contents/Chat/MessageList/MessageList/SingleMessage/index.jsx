import 'react-chat-elements/dist/main.css';
import { MessageBox } from 'react-chat-elements';
import * as React from 'react';
import { Stack, Box, Typography, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import format from 'date-fns/format';
import { useThemeMode } from '../../../../../../Themes/ThemeContext';
const MessageItem = styled(Paper)(({ theme, position }) => ({
  padding: theme.spacing(1.5),
  borderRadius: position === 'right' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
  maxWidth: '80%',
  wordBreak: 'break-word',
  position: 'relative',
  boxShadow: 'none',
  backgroundColor: position === 'right' 
  ? (theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light) 
  : (theme.palette.mode === 'dark' ? '#2d2d2d' : theme.palette.grey[100]),
  color: position === 'right' ? theme.palette.primary.contrastText : theme.palette.text.primary,
}));

const TimeStamp = styled(Typography)(({ theme, position }) => ({
  fontSize: '0.7rem',
  color: position === 'right' 
  ? 'rgba(255, 255, 255, 0.7)' 
  : theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
  display: 'inline-block',
  marginRight: position === 'right' ? 0 : theme.spacing(1),
  marginLeft: position === 'right' ? theme.spacing(1) : 0,
}));

export default function SingleMessage(props) {
  const { content, select } = props;
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const isFromCurrentUser = content.senderId !== select.userId;
  const position = isFromCurrentUser ? 'right' : 'left';
  
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(content.content);
    handleMenuClose();
  };

  const handleDeleteMessage = () => {
    // Add logic to delete message
    handleMenuClose();
  };

  // Format timestamp if available
  const formattedTime = content.timestamp 
    ? format(new Date(content.timestamp), 'h:mm a')
    : '';

  return (
    <Stack 
      direction="row" 
      spacing={1} 
      sx={{ 
        mb: 1.5, 
        justifyContent: isFromCurrentUser ? 'flex-end' : 'flex-start',
        px: 2
      }}
    >
      {!isFromCurrentUser && (
        <Avatar 
          alt={content.senderName || "User"}
          src={content.avatar}
          sx={{ width: 32, height: 32, mt: 1 }}
        />
      )}
      
      <Box sx={{ maxWidth: '80%' }}>
        <Stack direction="column" spacing={0.5}>
          {!isFromCurrentUser && (
            <Typography 
              variant="caption" 
              sx={{ ml: 1, color: 'text.secondary', fontWeight: 500 }}
            >
              {content.senderName || "User"}
            </Typography>
          )}
          
          <Box sx={{ position: 'relative' }}>
            <MessageItem position={position} elevation={0}>
              {content.content}
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  alignItems: 'center',
                  mt: 0.5
                }}
              >
                <TimeStamp position={position} variant="caption">
                  {formattedTime}
                </TimeStamp>
                
                {isFromCurrentUser && (
                  <DoneAllIcon 
                    sx={{ 
                      fontSize: '0.8rem', 
                      ml: 0.5,
                      color: content.read 
                      ? (theme.palette.mode === 'dark' ? '#90caf9' : '#34b7f1') 
                      : 'rgba(255, 255, 255, 0.7)'                                        }} 
                  />
                )}
              </Box>
            </MessageItem>
            
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                top: -8,
                [isFromCurrentUser ? 'left' : 'right']: -8,
                opacity: 0,
                '&:hover': { opacity: 1, backgroundColor: 'rgba(0,0,0,0.04)' },
                '.message-wrapper:hover &': { opacity: 0.7 }
              }}
              onClick={handleMenuOpen}
            >
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          </Box>
        </Stack>
      </Box>
      
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleCopyMessage}>Copy</MenuItem>
        <MenuItem onClick={handleMenuClose}>Reply</MenuItem>
        <MenuItem onClick={handleMenuClose}>Forward</MenuItem>
        {isFromCurrentUser && (
          <MenuItem onClick={handleDeleteMessage} sx={{ color: 'error.main' }}>
            Delete
          </MenuItem>
        )}
      </Menu>
    </Stack>
  );
}
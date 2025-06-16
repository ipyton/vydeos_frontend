import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Paper,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import VideoUtil from '../../../../util/io_utils/VideoUtil';
import { useNotification } from '../../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../../Themes/ThemeContext';

const CommentSendComponent = ({ movieIdentifier, comments, setComments }) => {
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();
  
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userAvatar, setUserAvatar] = useState('https://example.com/user-avatar.png');

  // Dark mode theme styles
  const isDarkMode = mode === 'dark';
  
  const themeStyles = {
    paper: {
      backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
      borderColor: isDarkMode ? '#404040' : '#e0e0e0',
    },
    textField: {
      '& .MuiOutlinedInput-root': {
        backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        '& fieldset': {
          borderColor: isDarkMode ? '#555555' : '#e0e0e0',
        },
        '&:hover fieldset': {
          borderColor: isDarkMode ? '#777777' : '#b0b0b0',
        },
        '&.Mui-focused fieldset': {
          borderColor: isDarkMode ? '#90caf9' : '#1976d2',
        },
      },
      '& .MuiInputLabel-root': {
        color: isDarkMode ? '#b0b0b0' : '#666666',
      },
      '& .MuiInputBase-input': {
        color: isDarkMode ? '#ffffff' : '#000000',
      },
      '& .MuiInputBase-input::placeholder': {
        color: isDarkMode ? '#888888' : '#999999',
        opacity: 1,
      },
    },
    iconButton: {
      color: isDarkMode ? '#b0b0b0' : '#666666',
      '&:hover': {
        backgroundColor: isDarkMode ? '#404040' : '#f5f5f5',
      },
    },
    sendButton: {
      backgroundColor: isDarkMode ? '#1976d2' : '#1976d2',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: isDarkMode ? '#1565c0' : '#1565c0',
      },
      '&:disabled': {
        backgroundColor: isDarkMode ? '#555555' : '#e0e0e0',
        color: isDarkMode ? '#888888' : '#999999',
      },
    },
  };

  const handleCommentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const comment = {
        content: content,
        resourceId: movieIdentifier.resource_id,
        type: movieIdentifier.type
      };
      
      VideoUtil.send_comment(comment);
      setComments([comment, ...comments]);
      setContent('');
    } catch (error) {
      console.error('Failed to send comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        border: 1,
        ...themeStyles.paper,
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar 
            src={userAvatar} 
            alt="User Avatar" 
            sx={{ 
              width: 40, 
              height: 40,
              border: isDarkMode ? '2px solid #555555' : '2px solid #e0e0e0',
            }} 
          />
          
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Write a comment..."
              value={content}
              onChange={handleCommentChange}
              variant="outlined"
              sx={themeStyles.textField}
            />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mt: 2 
            }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Attach file">
                  <IconButton size="small" sx={themeStyles.iconButton}>
                    <AttachFileIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Add emoji">
                  <IconButton size="small" sx={themeStyles.iconButton}>
                    <EmojiEmotionsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                disabled={!content.trim() || isSubmitting}
                type="submit"
                sx={{
                  borderRadius: 6,
                  ...themeStyles.sendButton,
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CommentSendComponent;
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

const CommentSendComponent = ({ movieIdentifier,comments, setComments}) => {

    const { showNotification } = useNotification();
  
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userAvatar, setUserAvatar] = useState('https://example.com/user-avatar.png'); // Replace with actual user avatar URL
  const handleCommentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
        const comment = {content:content, "resourceId":movieIdentifier.resource_id, "type":movieIdentifier.type}
        // Assuming VideoUtil.send_comment is a function that sends the comment
        VideoUtil.send_comment(comment);
        setComments([comment, ...comments])
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
        borderRadius: 2
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Box display="flex" alignItems="flex-start" gap={1.5}>
          <Avatar 
            src={userAvatar} 
            alt="User Avatar"
            sx={{ width: 40, height: 40 }}
          />
          
          <Box flexGrow={1}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              placeholder="Write a comment..."
              value={content}
              onChange={handleCommentChange}
              variant="outlined"
              sx={{ mb: 1 }}
            />
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Tooltip title="Attach file">
                  <IconButton color="primary" size="small">
                    <AttachFileIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Add emoji">
                  <IconButton color="primary" size="small">
                    <EmojiEmotionsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary" 
                endIcon={<SendIcon />}
                disabled={!content.trim() || isSubmitting}
                type="submit"
                sx={{ borderRadius: 6 }}
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
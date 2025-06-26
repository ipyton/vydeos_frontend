import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
  Box,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Image as ImageIcon,
  Videocam as VideocamIcon,
  AttachFile as AttachFileIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useNotification } from '../../../../contexts/NotificationProvider';
import { useThemeMode } from '../../../../contexts/ThemeContext';

// CSS Modules
import styles from '../../../../styles/AddPostDialog.module.css';

const AddPostDialog = ({ open, setOpen, articles, setArticles }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState('');
  const { showNotification } = useNotification();
  const { mode } = useThemeMode();

  const handleClose = () => {
    setOpen(false);
    // Reset the form
    setTitle('');
    setContent('');
    setMedia(null);
    setPreview('');
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      showNotification('Please enter content for your post', 'warning');
      return;
    }

    try {
      // Only import on client-side
      if (typeof window !== 'undefined') {
        const { default: PostUtil } = await import('../../../../utils/PostUtil');
        
        // Create form data for media upload
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (media) {
          formData.append('media', media);
        }
        
        const response = await PostUtil.createPost(formData);
        
        if (response && response.data && response.data.code === 0) {
          // Add new post to the list
          const newPost = {
            id: response.data.postId || Date.now().toString(),
            title,
            content,
            authorName: localStorage.getItem('userName') || 'You',
            authorAvatar: localStorage.getItem('userAvatar') || '',
            publishDate: new Date().toISOString(),
            likeCount: 0,
            commentCount: 0,
            imageUrl: preview || null
          };
          
          setArticles([newPost, ...articles]);
          showNotification('Post created successfully', 'success');
          handleClose();
        } else {
          showNotification('Failed to create post', 'error');
        }
      }
    } catch (error) {
      console.error('Error creating post:', error);
      showNotification('Error creating post', 'error');
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setMedia(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      className={styles.dialog}
      PaperProps={{
        style: {
          borderRadius: '16px',
          backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          padding: '8px'
        }
      }}
    >
      <DialogTitle className={styles.dialogTitle}>
        Create Post
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Title (Optional)"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
        />
        
        <TextField
          margin="dense"
          id="content"
          label="What's on your mind?"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.contentInput}
        />
        
        {preview && (
          <Box className={styles.previewContainer}>
            <img 
              src={preview} 
              alt="Preview" 
              className={styles.mediaPreview} 
            />
            <IconButton 
              className={styles.removePreview}
              onClick={() => {
                setPreview('');
                setMedia(null);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions className={styles.dialogActions}>
        <Box className={styles.mediaButtons}>
          <input
            accept="image/*"
            className={styles.input}
            id="icon-button-image"
            type="file"
            onChange={handleMediaChange}
            hidden
          />
          <label htmlFor="icon-button-image">
            <IconButton 
              color="primary" 
              component="span" 
              className={styles.mediaButton}
            >
              <ImageIcon />
            </IconButton>
          </label>
          
          <input
            accept="video/*"
            className={styles.input}
            id="icon-button-video"
            type="file"
            onChange={handleMediaChange}
            hidden
          />
          <label htmlFor="icon-button-video">
            <IconButton 
              color="primary" 
              component="span"
              className={styles.mediaButton}
            >
              <VideocamIcon />
            </IconButton>
          </label>
          
          <input
            accept="*/*"
            className={styles.input}
            id="icon-button-file"
            type="file"
            onChange={handleMediaChange}
            hidden
          />
          <label htmlFor="icon-button-file">
            <IconButton 
              color="primary" 
              component="span"
              className={styles.mediaButton}
            >
              <AttachFileIcon />
            </IconButton>
          </label>
        </Box>
        
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          endIcon={<SendIcon />}
          className={styles.submitButton}
        >
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPostDialog; 
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useThemeMode } from '../../../../contexts/ThemeContext';

// Material UI imports
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  CardActionArea,
  IconButton,
  Typography,
  Box,
  Collapse,
  Divider,
  Grid
} from '@mui/material';

// Material UI icons
import {
  MoreVert as MoreVertIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

// Import styles
import styles from '../../../../styles/Article.module.css';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

const Article = ({ content }) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const router = useRouter();
  const { mode } = useThemeMode();
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLikeClick = () => {
    setLiked(!liked);
    // Here you would typically call an API to record the like
    if (typeof window !== 'undefined') {
      // Import dynamically to avoid SSR issues
      import('../../../../utils/PostUtil').then(({ default: PostUtil }) => {
        PostUtil.likePost(content.id);
      });
    }
  };

  const handleCommentClick = () => {
    // Open comments section
    setExpanded(true);
  };

  const handleShareClick = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: content.title || 'Shared post',
        text: content.snippet || 'Check out this post',
        url: window.location.href
      }).catch(error => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      console.log('Web Share API not supported');
    }
  };

  // If content is not provided, render placeholder
  if (!content) {
    return (
      <Card className={styles.articleCard} elevation={3}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Post unavailable
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={styles.articleCard} 
      elevation={3}
      sx={{
        borderRadius: '16px',
        boxShadow: mode === 'dark' 
          ? '0 8px 24px rgba(0,0,0,0.3)' 
          : '0 8px 24px rgba(0,0,0,0.1)',
        backgroundColor: mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={content.authorAvatar || ''}
            alt={content.authorName || 'Author'}
            sx={{ width: 48, height: 48 }}
          />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography variant="h6" component="div" className={styles.authorName}>
            {content.authorName || 'Unknown Author'}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            {formatDate(content.publishDate)}
          </Typography>
        }
      />
      
      {content.title && (
        <CardContent className={styles.titleContent}>
          <Typography variant="h5" gutterBottom>
            {content.title}
          </Typography>
        </CardContent>
      )}

      {content.imageUrl && (
        <Box className={styles.mediaContainer}>
          <CardMedia
            component="img"
            image={content.imageUrl}
            alt={content.title || 'Post image'}
            className={styles.media}
          />
        </Box>
      )}

      <CardContent>
        <Typography variant="body1" className={styles.content}>
          {content.content || content.snippet || 'No content'}
        </Typography>
      </CardContent>
      
      <CardActions disableSpacing className={styles.actions}>
        <IconButton 
          aria-label="like" 
          onClick={handleLikeClick}
          color={liked ? 'primary' : 'default'}
        >
          <FavoriteIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {content.likeCount || 0}
        </Typography>
        
        <IconButton aria-label="comment" onClick={handleCommentClick}>
          <CommentIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {content.commentCount || 0}
        </Typography>
        
        <IconButton aria-label="share" onClick={handleShareClick}>
          <ShareIcon />
        </IconButton>
        
        <IconButton
          className={expanded ? styles.expandOpen : styles.expand}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent>
          <Typography paragraph variant="h6">Comments:</Typography>
          {content.comments && content.comments.length > 0 ? (
            content.comments.map((comment, index) => (
              <Box key={index} className={styles.comment}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar
                      src={comment.authorAvatar}
                      alt={comment.authorName || 'Commenter'}
                      sx={{ width: 32, height: 32 }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle2">
                      {comment.authorName || 'Anonymous'}
                    </Typography>
                    <Typography variant="body2">
                      {comment.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(comment.date)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default Article; 
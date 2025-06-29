import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red, pink, blue, green, purple } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack, Box, Grid, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, CircularProgress } from '@mui/material';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useThemeMode } from '../../../../contexts/ThemeContext';
import styles from '../../../../styles/Article.module.css';
import { API_URL } from '../../../../utils/URL';

// Dynamically import PostUtil to avoid SSR issues
const PostUtil = dynamic(() => import('../../../../utils/PostUtil'), { ssr: false });

const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: 12,
    },
    body1: {
      fontWeight: 500,
    },
    button: {
      fontStyle: 'italic',
    },
  },
});

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: "auto",
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

// Avatar color generator
const getAvatarColor = (name, mode) => {
  const colors = mode === 'dark' 
    ? [blue[400], green[400], purple[400], pink[400], red[400]]
    : [blue[500], green[500], purple[500], pink[500], red[500]];
  const index = name ? name.charCodeAt(0) % colors.length : 0;
  return colors[index];
};

const getGridItemSize = (index, total) => {
  if (total <= 3) return 4; // 3 columns for 1-3 images
  if (total <= 6) return 4; // 3 columns for 4-6 images
  return 4; // 3 columns for 7-9 images (3x3 grid)
};

// Custom hook for fetching images with auth headers
const useAuthImage = (url) => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!url || !isClient) {
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            "token": localStorage.getItem("token")
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageData(imageUrl);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching image:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    // Cleanup function to revoke object URL
    return () => {
      if (imageData && imageData.startsWith('blob:')) {
        URL.revokeObjectURL(imageData);
      }
    };
  }, [url, isClient]);

  return { imageData, loading, error };
};

const AuthImage = ({ src, alt, mode, ...props }) => {
  const { imageData, loading, error } = useAuthImage(src);

  if (loading) {
    return (
      <Box 
        className={`${styles.imageContainer} ${mode === 'dark' ? styles.imageContainerDark : styles.imageContainerLight}`}
        {...props}
      >
        <CircularProgress size={24} className={styles.imageContent} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        className={`${styles.imageContainer} ${mode === 'dark' ? styles.imageContainerDark : styles.imageContainerLight}`}
        {...props}
      >
        <Typography 
          variant="caption" 
          color="error" 
          sx={{ textAlign: 'center', p: 2 }}
          className={styles.imageContent}
        >
          Failed to load image
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={imageData}
      alt={alt}
      className={`${styles.cardMedia} ${mode === 'dark' ? styles.cardMediaDark : styles.cardMediaLight}`}
      {...props}
    />
  );
};

export default function Article(props) {
  const { content } = props;
  const { mode } = useThemeMode();
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const menuOpen = Boolean(anchorEl);
  
  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLikeClick = () => {
    if (isClient) {
      setLiked(!liked);
      PostUtil.likePost(content.id);
    }
  };

  const handleCommentSubmit = () => {
    if (!comment.trim() || !isClient) return;
    
    PostUtil.commentPost(content.id, comment)
      .then(response => {
        if (response.success) {
          // Add comment to UI
          if (content.comments) {
            content.comments.push({
              id: Date.now(),
              text: comment,
              author: localStorage.getItem("userId") || "User",
              timestamp: new Date().toISOString()
            });
          }
          setComment("");
        }
      })
      .catch(error => {
        console.error("Error posting comment:", error);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleCommentSubmit();
    }
  };

  const handleMoreMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeletePost = () => {
    handleMenuClose();
    if (isClient) {
      PostUtil.deletePost(content.id)
        .then(response => {
          if (response.success) {
            // Handle successful deletion (e.g., remove from UI)
            console.log("Post deleted successfully");
          }
        })
        .catch(error => {
          console.error("Error deleting post:", error);
        });
    }
  };

  const renderImages = () => {
    if (!content.images || content.images.length === 0) return null;
    
    return (
      <Grid container spacing={1} className={styles.imageGrid}>
        {content.images.slice(0, 9).map((image, index) => (
          <Grid item xs={getGridItemSize(index, content.images.length)} key={index}>
            <AuthImage 
              src={`${API_URL}${image}`} 
              alt={`Post image ${index + 1}`}
              mode={mode}
              sx={{ width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'cover' }}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  // Don't render anything during server-side rendering
  if (!isClient) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Card 
        className={`${styles.card} ${mode === 'dark' ? styles.cardDark : styles.cardLight}`}
      >
        <CardHeader
          avatar={
            <Avatar 
              className={styles.avatar}
              sx={{ bgcolor: getAvatarColor(content.authorName, mode) }}
              aria-label="author avatar"
            >
              {content.authorName ? content.authorName.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          }
          action={
            <IconButton 
              aria-label="settings"
              onClick={handleMoreMenuClick}
              className={styles.actionButton}
            >
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <Typography className={styles.authorName}>
              {content.authorName || 'Unknown User'}
            </Typography>
          }
          subheader={
            <Typography className={styles.postDate}>
              {content.createdAt ? new Date(content.createdAt).toLocaleString() : 'Unknown date'}
            </Typography>
          }
        />
        
        {renderImages()}
        
        <CardContent>
          <Typography variant="body1" className={styles.postContent}>
            {content.content}
          </Typography>
        </CardContent>
        
        <CardActions disableSpacing>
          <IconButton 
            aria-label={liked ? "unlike" : "like"}
            onClick={handleLikeClick}
            className={`
              ${styles.likeButton} 
              ${liked ? 
                (mode === 'dark' ? styles.likedDark : styles.likedLight) : 
                (mode === 'dark' ? styles.notLikedDark : styles.notLikedLight)
              }
              ${mode === 'dark' ? styles.likeButtonDark : styles.likeButtonLight}
            `}
          >
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          
          <IconButton 
            aria-label="share"
            className={styles.actionButton}
          >
            <ShareIcon />
          </IconButton>
          
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show comments"
            className={`${styles.expandMore} ${expanded ? styles.expandOpen : ''}`}
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            
            <FormControl 
              fullWidth 
              variant="standard" 
              className={`${styles.commentInput} ${mode === 'dark' ? styles.commentInputDark : styles.commentInputLight}`}
              sx={{ mb: 3 }}
            >
              <InputLabel 
                htmlFor="comment-input"
                className={styles.inputLabel}
              >
                Add a comment
              </InputLabel>
              <Input
                id="comment-input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={handleKeyPress}
                className={styles.input}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="send comment"
                      onClick={handleCommentSubmit}
                      edge="end"
                      disabled={!comment.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            
            <List>
              {content.comments && content.comments.length > 0 ? (
                content.comments.map((comment, index) => (
                  <ListItem 
                    key={index}
                    className={`${styles.commentItem} ${mode === 'dark' ? styles.commentItemDark : styles.commentItemLight}`}
                    alignItems="flex-start"
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ bgcolor: getAvatarColor(comment.author, mode) }}
                      >
                        {comment.author ? comment.author.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={comment.author || 'Unknown User'}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ display: 'block', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                          >
                            {comment.text}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ opacity: 0.7 }}
                          >
                            {comment.timestamp ? new Date(comment.timestamp).toLocaleString() : 'Unknown time'}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" sx={{ textAlign: 'center', py: 2, opacity: 0.7 }}>
                  No comments yet. Be the first to comment!
                </Typography>
              )}
            </List>
          </CardContent>
        </Collapse>
      </Card>
      
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleDeletePost}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </ThemeProvider>
  );
} 
import * as React from 'react';
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
import { API_BASE_URL } from '../../../../util/io_utils/URL';
import { useThemeMode } from '../../../../Themes/ThemeContext';

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

const StyledCard = styled(Card)(({ theme, mode }) => ({
  width: "100%",
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: mode === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: mode === 'dark' 
    ? 'linear-gradient(145deg, #1e1e1e, #2d2d2d)' 
    : 'linear-gradient(145deg, #ffffff, #f8f9fa)',
  border: mode === 'dark' 
    ? '1px solid rgba(255, 255, 255, 0.1)' 
    : '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: mode === 'dark' 
      ? '0 16px 48px rgba(0, 0, 0, 0.6)' 
      : '0 16px 48px rgba(0, 0, 0, 0.15)',
  }
}));

const StyledCardMedia = styled(CardMedia)(({ theme, mode }) => ({
  borderRadius: theme.spacing(1),
  filter: mode === 'dark' ? 'brightness(0.85) contrast(1.1)' : 'brightness(1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    filter: mode === 'dark' ? 'brightness(1) contrast(1.2)' : 'brightness(1.1)',
    transform: 'scale(1.02)',
  }
}));

const CommentInput = styled(FormControl)(({ theme, mode }) => ({
  '& .MuiInputLabel-root': {
    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
  },
  '& .MuiInput-root': {
    color: mode === 'dark' ? '#ffffff' : '#000000',
    '&:before': {
      borderBottomColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
    },
    '&:hover:before': {
      borderBottomColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    },
    '&:after': {
      borderBottomColor: mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
    }
  }
}));

const LikeButton = styled(IconButton)(({ theme, mode, liked }) => ({
  color: liked 
    ? (mode === 'dark' ? pink[300] : red[500])
    : (mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'),
  transition: 'all 0.2s ease',
  '&:hover': {
    color: mode === 'dark' ? pink[200] : red[400],
    transform: 'scale(1.1)',
  }
}));

const CommentItem = styled(ListItem)(({ theme, mode }) => ({
  backgroundColor: mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.02)',
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  border: mode === 'dark' 
    ? '1px solid rgba(255, 255, 255, 0.1)' 
    : '1px solid rgba(0, 0, 0, 0.05)',
}));

const ImageContainer = styled(Box)(({ theme, mode }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.spacing(1),
  aspectRatio: '1/1',
  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '150px',
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
const useAuthImage = (url, headers = {}) => {
  const [imageData, setImageData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!url) {
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
            "token":localStorage.getItem("token")
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
  }, [url, JSON.stringify(headers)]);

  return { imageData, loading, error };
};

// Auth Image Component
const AuthImage = ({ src, alt, authHeaders, mode, sx, ...props }) => {
  const { imageData, loading, error } = useAuthImage(src, authHeaders);

  if (loading) {
    return (
      <ImageContainer mode={mode} sx={sx}>
        <CircularProgress size={24} />
      </ImageContainer>
    );
  }

  if (error) {
    return (
      <ImageContainer mode={mode} sx={sx}>
        <Typography 
          variant="caption" 
          color="error" 
          sx={{ textAlign: 'center', p: 2 }}
        >
          Failed to load image
        </Typography>
      </ImageContainer>
    );
  }

  return (
    <StyledCardMedia
      component="img"
      image={imageData}
      alt={alt}
      mode={mode}
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...sx,
      }}
      {...props}
    />
  );
};

export default function Article(props) {
  const { mode } = useThemeMode();



  const [expanded, setExpanded] = React.useState(false);
  const [likes, setLikes] = React.useState(props?.content?.likes || 0);
  const [liked, setLiked] = React.useState(false);
  const [comments, setComments] = React.useState(props?.content?.comments || []);
  const [commentText, setCommentText] = React.useState('');
  const [images] = React.useState(props?.content?.images || [
    {
      url: "https://picsum.photos/400/400?random=1",
      alt: "Sample image 1"
    },
  ]);
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [deletePostDialogOpen, setDeletePostDialogOpen] = React.useState(false);

  // Auth headers for protected images
  const authHeaders = props?.authHeaders || {};

  // Mock current user - in real app this would come from authentication context
  const currentUser = props?.currentUser || 'Current User';
  const postOwner = props?.content?.authorID || props?.content?.authorName || 'User';
  const isOwner = currentUser === postOwner;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLikeClick = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now(),
        author: currentUser,
        text: commentText,
        timestamp: new Date().toLocaleString()
      };
      setComments(prev => [...prev, newComment]);
      setCommentText('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleCommentSubmit();
    }
  };

  const handleMoreMenuClick = (event) => {
    if (isOwner) {
      setMenuAnchor(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleDeletePost = () => {
    console.log('Deleting post...');
    setDeletePostDialogOpen(false);
    if (props.onDeletePost) {
      props.onDeletePost(props.content?.id);
    }
  };

  const renderImages = () => {
    const maxImages = 9;
    const displayImages = images.slice(0, maxImages);

    return (
      <Box sx={{ px: 2, pb: 2 }}>
        <Grid container spacing={1}>
          {displayImages.map((image, index) => {
            // Support both string URLs and objects with url/alt properties
            const imageUrl = API_BASE_URL + "/post/fetch_pictures/" + image
            const imageAlt = typeof image === 'string' ? `Image ${index + 1}` : (image.alt || `Image ${index + 1}`);
            
            return (
              <Grid item xs={getGridItemSize(index, displayImages.length)} key={index}>
                <AuthImage
                  src={imageUrl}
                  alt={imageAlt}
                  authHeaders={authHeaders}
                  mode={mode}
                  sx={{
                    borderRadius: 1,
                    aspectRatio: '1/1',
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledCard mode={mode}>
        <CardHeader
          avatar={
            <Avatar 
              sx={{ 
                bgcolor: getAvatarColor(props?.content?.authorName, mode),
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              {props?.content?.authorName?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
          }
          action={
            isOwner ? (
              <IconButton 
                aria-label="settings" 
                onClick={handleMoreMenuClick}
                sx={{
                  bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  color: mode === 'dark' ? 'white' : 'inherit',
                  '&:hover': {
                    bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <MoreVertIcon />
              </IconButton>
            ) : null
          }
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 500,
                color: mode === 'dark' ? 'white' : 'inherit'
              }}>
                {postOwner}
              </Typography>
              {isOwner && (
                <Chip 
                  label="You" 
                  size="small" 
                  color="primary"
                  sx={{ fontSize: '0.7rem', height: '20px' }}
                />
              )}
            </Box>
          }
          subheader={
            <Chip 
              label={props?.content?.lastModified || new Date().toLocaleDateString()} 
              size="small" 
              variant="outlined"
              sx={{
                fontSize: '0.75rem',
                height: '24px',
                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
              }}
            />
          }
        />


        {images.length > 0 && renderImages()}

        <CardActions disableSpacing sx={{ px: 2 }}>
          <LikeButton 
            aria-label="add to favorites"
            liked={liked}
            mode={mode}
            onClick={handleLikeClick}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {likes}
              </Typography>
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </Box>
          </LikeButton>
          
          <IconButton 
            aria-label="share"
            sx={{
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              '&:hover': {
                color: mode === 'dark' ? 'white' : 'black',
                transform: 'scale(1.1)',
              }
            }}
          >
            <ShareIcon />
          </IconButton>
          
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show comments"
            sx={{
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              '&:hover': {
                color: mode === 'dark' ? 'white' : 'black',
              }
            }}
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Stack spacing={3}>
              {/* Comment Input */}
              <Stack direction="row" spacing={2} alignItems="flex-end">
                <CommentInput 
                  fullWidth 
                  variant="standard" 
                  mode={mode}
                >
                  <InputLabel htmlFor="comment-input">
                    Share your thoughts...
                  </InputLabel>
                  <Input
                    id="comment-input"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    multiline
                    maxRows={3}
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountCircle sx={{ 
                          color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' 
                        }} />
                      </InputAdornment>
                    }
                  />
                </CommentInput>
                
                <Button 
                  variant="contained" 
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
                  startIcon={<SendIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    minWidth: 'auto'
                  }}
                >
                  Send
                </Button>
              </Stack>

              {/* Comments List */}
              {comments.length > 0 && (
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      color: mode === 'dark' ? 'white' : 'black'
                    }}
                  >
                    Comments ({comments.length})
                  </Typography>
                  
                  <List sx={{ width: '100%', p: 0 }}>
                    {comments.map((comment, index) => (
                      <React.Fragment key={comment.id || index}>
                        <CommentItem mode={mode}>
                          <ListItemAvatar>
                            <Avatar 
                              sx={{ 
                                bgcolor: getAvatarColor(comment.author || 'Anonymous', mode),
                                width: 36,
                                height: 36,
                                fontSize: '0.9rem'
                              }}
                            >
                              {(comment.author || 'A').charAt(0).toUpperCase()}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: mode === 'dark' ? 'white' : 'black'
                                }}
                              >
                                {comment.author || 'Anonymous'}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    mt: 0.5,
                                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                                    lineHeight: 1.5
                                  }}
                                >
                                  {comment.text || 'Great post! Thanks for sharing.'}
                                </Typography>
                                {comment.timestamp && (
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                                      mt: 1,
                                      display: 'block'
                                    }}
                                  >
                                    {comment.timestamp}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </CommentItem>
                        {index < comments.length - 1 && (
                          <Divider 
                            sx={{ 
                              my: 1,
                              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Collapse>

        {/* Delete Post Menu */}
        {isOwner && (
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem 
              onClick={() => {
                setDeletePostDialogOpen(true);
                handleMenuClose();
              }} 
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon sx={{ mr: 1 }} /> 
              Delete Post
            </MenuItem>
          </Menu>
        )}

        {/* Delete Post Confirmation Dialog */}
        <Dialog 
          open={deletePostDialogOpen} 
          onClose={() => setDeletePostDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Delete Post
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this post? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeletePostDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeletePost} 
              color="error"
              variant="contained"
            >
              Delete Post
            </Button>
          </DialogActions>
        </Dialog>
      </StyledCard>
    </ThemeProvider>
  );
}
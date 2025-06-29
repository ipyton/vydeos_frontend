import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  IconButton,
  Button,
  Avatar,
  Grid,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Skeleton
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  FullscreenRounded,
  MoreVert,
  Favorite,
  FavoriteBorder,
  Share,
  Bookmark,
  BookmarkBorder,
  Delete,
  Edit,
  Report
} from '@mui/icons-material';
import { useThemeMode } from '../../../../contexts/ThemeContext';
import styles from '../../../../styles/Video.module.css';
import { API_URL } from '../../../../utils/URL';

// Dynamically import VideoUtil to avoid SSR issues
const VideoUtil = dynamic(() => import('../../../../utils/VideoUtil'), { ssr: false });

// Format view count
const formatViewCount = (count) => {
  if (!count && count !== 0) return '0 views';
  if (count < 1000) return `${count} views`;
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K views`;
  return `${(count / 1000000).toFixed(1)}M views`;
};

// Format duration
const formatDuration = (seconds) => {
  if (!seconds) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

export default function Video({ content }) {
  const router = useRouter();
  const { mode } = useThemeMode();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoData, setVideoData] = useState(content || {
    id: '',
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    author: {
      id: '',
      name: '',
      avatar: ''
    },
    views: 0,
    likes: 0,
    duration: 0,
    uploadDate: new Date().toISOString(),
    tags: []
  });
  
  const menuOpen = Boolean(anchorEl);
  
  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Initialize video data when component mounts
  useEffect(() => {
    if (!isClient) return;
    
    const initializeVideo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If content is provided, use it
        if (content && content.id) {
          setVideoData(content);
          setLoading(false);
          return;
        }
        
        // Otherwise fetch video data
        // This is a placeholder - in a real app, you would fetch from an API
        setTimeout(() => {
          const mockVideoData = {
            id: 'video-123',
            title: 'Amazing Nature Scenes',
            description: 'Explore the beauty of nature in this stunning compilation.',
            videoUrl: 'https://example.com/videos/nature.mp4',
            thumbnailUrl: 'https://example.com/thumbnails/nature.jpg',
            author: {
              id: 'author-456',
              name: 'Nature Explorer',
              avatar: 'https://example.com/avatars/explorer.jpg'
            },
            views: 12500,
            likes: 1250,
            duration: 180, // seconds
            uploadDate: '2023-06-15T12:00:00Z',
            tags: ['nature', 'wildlife', 'relaxation']
          };
          
          setVideoData(mockVideoData);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error initializing video:', err);
        setError('Failed to load video data');
        setLoading(false);
      }
    };
    
    initializeVideo();
  }, [content, isClient]);
  
  // Video event handlers
  useEffect(() => {
    if (!isClient || !videoRef.current) return;
    
    const videoElement = videoRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };
    
    const handleEnded = () => {
      setPlaying(false);
    };
    
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('ended', handleEnded);
    
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [isClient, videoRef.current]);
  
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setPlaying(!playing);
  };
  
  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };
  
  const handleFullscreen = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    }
  };
  
  const handleProgressClick = (e) => {
    if (!videoRef.current || !duration) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleLike = () => {
    if (!isClient) return;
    
    setLiked(!liked);
    // In a real app, you would call an API
    if (VideoUtil) {
      VideoUtil.likeVideo(videoData.id);
    }
  };
  
  const handleSave = () => {
    if (!isClient) return;
    
    setSaved(!saved);
    // In a real app, you would call an API
    if (VideoUtil) {
      VideoUtil.saveVideo(videoData.id);
    }
  };
  
  const handleShare = () => {
    if (!isClient || !navigator.share) return;
    
    navigator.share({
      title: videoData.title,
      text: videoData.description,
      url: `${window.location.origin}/video/${videoData.id}`
    }).catch(err => console.error('Error sharing:', err));
  };
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleVideoClick = () => {
    if (!isClient || !videoData.id) return;
    
    router.push(`/video/${videoData.id}`);
  };
  
  const handleAuthorClick = (e) => {
    e.stopPropagation();
    if (!isClient || !videoData.author?.id) return;
    
    router.push(`/profile?id=${videoData.author.id}`);
  };
  
  // Don't render anything during server-side rendering
  if (!isClient) {
    return null;
  }
  
  if (error) {
    return (
      <Card className={`${styles.card} ${mode === 'dark' ? styles.cardDark : styles.cardLight}`}>
        <CardContent>
          <Typography color="error">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  if (loading) {
    return (
      <Card className={`${styles.card} ${mode === 'dark' ? styles.cardDark : styles.cardLight}`}>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={240} 
          animation="wave"
          className={styles.thumbnailSkeleton}
        />
        <CardContent>
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box width="100%">
              <Skeleton variant="text" width="70%" height={28} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card 
      className={`${styles.card} ${mode === 'dark' ? styles.cardDark : styles.cardLight}`}
      onClick={handleVideoClick}
    >
      <Box className={styles.videoContainer}>
        {videoData.videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={videoData.videoUrl}
              poster={videoData.thumbnailUrl}
              className={styles.video}
              muted={muted}
              preload="metadata"
            />
            
            <Box className={styles.videoOverlay}>
              <Box className={styles.videoControls}>
                <IconButton 
                  className={styles.controlButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause();
                  }}
                >
                  {playing ? <Pause /> : <PlayArrow />}
                </IconButton>
                
                <Box 
                  className={styles.progressBar}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProgressClick(e);
                  }}
                >
                  <Box 
                    className={styles.progress}
                    sx={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </Box>
                
                <Box className={styles.timeDisplay}>
                  {formatDuration(currentTime)} / {formatDuration(duration)}
                </Box>
                
                <IconButton 
                  className={styles.controlButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMuteToggle();
                  }}
                >
                  {muted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
                
                <IconButton 
                  className={styles.controlButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFullscreen();
                  }}
                >
                  <FullscreenRounded />
                </IconButton>
              </Box>
            </Box>
            
            <Box className={styles.durationBadge}>
              {formatDuration(videoData.duration)}
            </Box>
          </>
        ) : (
          <Box
            className={styles.thumbnailContainer}
            sx={{
              backgroundImage: `url(${videoData.thumbnailUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Box className={styles.playButtonOverlay}>
              <IconButton className={styles.largePlayButton}>
                <PlayArrow fontSize="large" />
              </IconButton>
            </Box>
            
            <Box className={styles.durationBadge}>
              {formatDuration(videoData.duration)}
            </Box>
          </Box>
        )}
      </Box>
      
      <CardContent className={styles.content}>
        <Box display="flex" alignItems="flex-start">
          <Avatar 
            src={videoData.author?.avatar} 
            alt={videoData.author?.name}
            className={styles.avatar}
            onClick={handleAuthorClick}
          />
          
          <Box ml={2} flex={1}>
            <Typography variant="h6" className={styles.title}>
              {videoData.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              className={styles.authorName}
              onClick={handleAuthorClick}
            >
              {videoData.author?.name}
            </Typography>
            
            <Box display="flex" alignItems="center" mt={0.5}>
              <Typography variant="caption" className={styles.viewCount}>
                {formatViewCount(videoData.views)}
              </Typography>
              
              <Typography variant="caption" className={styles.uploadDate}>
                • {formatDate(videoData.uploadDate)}
              </Typography>
            </Box>
            
            {videoData.tags && videoData.tags.length > 0 && (
              <Box display="flex" flexWrap="wrap" mt={1} gap={0.5}>
                {videoData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    className={`${styles.tag} ${mode === 'dark' ? styles.tagDark : styles.tagLight}`}
                  />
                ))}
              </Box>
            )}
          </Box>
          
          <IconButton
            aria-label="more"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick(e);
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </CardContent>
      
      <CardActions className={styles.actions}>
        <Button
          startIcon={liked ? <Favorite color="error" /> : <FavoriteBorder />}
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          className={`${styles.actionButton} ${liked ? styles.likedButton : ''}`}
        >
          {liked ? 'Liked' : 'Like'}
        </Button>
        
        <Button
          startIcon={saved ? <Bookmark /> : <BookmarkBorder />}
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
          className={`${styles.actionButton} ${saved ? styles.savedButton : ''}`}
        >
          {saved ? 'Saved' : 'Save'}
        </Button>
        
        <Button
          startIcon={<Share />}
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className={styles.actionButton}
        >
          Share
        </Button>
      </CardActions>
      
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={(e) => {
          e.stopPropagation();
          handleMenuClose();
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleMenuClose}>
          <Report fontSize="small" sx={{ mr: 1 }} />
          Report
        </MenuItem>
        
        {/* Show edit/delete options only if user is the author */}
        {isClient && localStorage.getItem('userId') === videoData.author?.id && (
          <>
            <Divider />
            <MenuItem onClick={handleMenuClose}>
              <Edit fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Delete fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </Card>
  );
} 
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Avatar, 
  Box, 
  Typography, 
  Button, 
  Chip, 
  Card, 
  CardContent, 
  IconButton, 
  Tooltip,
  Skeleton
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Cake as CakeIcon,
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useThemeMode } from '../../../../contexts/ThemeContext';
import styles from '../../../../styles/Author.module.css';

export default function Author({ authorId, authorName, authorAvatar, authorBio, isCurrentUser }) {
  const router = useRouter();
  const { mode } = useThemeMode();
  const [isClient, setIsClient] = useState(false);
  const [authorData, setAuthorData] = useState({
    id: authorId,
    name: authorName,
    avatar: authorAvatar,
    bio: authorBio,
    location: '',
    occupation: '',
    education: '',
    joinDate: '',
    followers: 0,
    following: 0,
    isFollowing: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch author data when component mounts
  useEffect(() => {
    if (!isClient || !authorId) {
      return;
    }

    const fetchAuthorData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call with timeout
        // In a real app, replace this with an actual API call
        setTimeout(() => {
          // Mock data - replace with actual API call
          const mockData = {
            id: authorId,
            name: authorName || 'User Name',
            avatar: authorAvatar || '/images/default-avatar.png',
            bio: authorBio || 'No bio available',
            location: 'San Francisco, CA',
            occupation: 'Software Engineer',
            education: 'Computer Science',
            joinDate: '2023-01-15',
            followers: 1250,
            following: 350,
            isFollowing: false
          };

          setAuthorData(mockData);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching author data:', err);
        setError('Failed to load author data');
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorId, authorName, authorAvatar, authorBio, isClient]);

  const handleFollow = () => {
    if (!isClient) return;
    
    setAuthorData(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1
    }));
    
    // Here you would typically call an API to follow/unfollow
    // Example: AuthorUtil.toggleFollow(authorId);
  };

  const handleEditProfile = () => {
    if (!isClient) return;
    router.push('/settings');
  };

  const handleViewProfile = () => {
    if (!isClient) return;
    router.push(`/profile?id=${authorData.id}`);
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

  return (
    <Card className={`${styles.card} ${mode === 'dark' ? styles.cardDark : styles.cardLight}`}>
      {loading ? (
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Skeleton variant="circular" width={80} height={80} />
            <Box ml={2} width="100%">
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={24} />
            </Box>
          </Box>
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Skeleton variant="rounded" width="45%" height={36} />
            <Skeleton variant="rounded" width="45%" height={36} />
          </Box>
        </CardContent>
      ) : (
        <>
          <CardContent>
            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              <Avatar 
                src={authorData.avatar} 
                alt={authorData.name}
                className={styles.avatar}
              />
              
              <Box ml={{ xs: 0, sm: 2 }} mt={{ xs: 2, sm: 0 }} textAlign={{ xs: 'center', sm: 'left' }} width="100%">
                <Typography variant="h5" className={styles.authorName}>
                  {authorData.name}
                </Typography>
                
                <Typography variant="body2" className={styles.authorBio} gutterBottom>
                  {authorData.bio}
                </Typography>
                
                <Box 
                  display="flex" 
                  flexDirection={{ xs: 'column', sm: 'row' }} 
                  alignItems={{ xs: 'center', sm: 'flex-start' }}
                  mt={1}
                >
                  {authorData.location && (
                    <Box display="flex" alignItems="center" mr={2} mb={{ xs: 1, sm: 0 }}>
                      <LocationIcon fontSize="small" className={styles.infoIcon} />
                      <Typography variant="body2" className={styles.infoText}>
                        {authorData.location}
                      </Typography>
                    </Box>
                  )}
                  
                  {authorData.occupation && (
                    <Box display="flex" alignItems="center" mr={2} mb={{ xs: 1, sm: 0 }}>
                      <WorkIcon fontSize="small" className={styles.infoIcon} />
                      <Typography variant="body2" className={styles.infoText}>
                        {authorData.occupation}
                      </Typography>
                    </Box>
                  )}
                  
                  {authorData.joinDate && (
                    <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 0 }}>
                      <CakeIcon fontSize="small" className={styles.infoIcon} />
                      <Typography variant="body2" className={styles.infoText}>
                        Joined {new Date(authorData.joinDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <Box 
                  display="flex" 
                  justifyContent={{ xs: 'center', sm: 'flex-start' }}
                  mt={2}
                >
                  <Box mr={3} className={styles.statsBox}>
                    <Typography variant="h6" className={styles.statsNumber}>
                      {authorData.followers.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" className={styles.statsLabel}>
                      Followers
                    </Typography>
                  </Box>
                  
                  <Box className={styles.statsBox}>
                    <Typography variant="h6" className={styles.statsNumber}>
                      {authorData.following.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" className={styles.statsLabel}>
                      Following
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            
            <Box 
              display="flex" 
              justifyContent="center" 
              mt={3}
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={2}
            >
              {isCurrentUser ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}
                  fullWidth
                  className={`${styles.button} ${styles.editButton} ${mode === 'dark' ? styles.editButtonDark : styles.editButtonLight}`}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant={authorData.isFollowing ? "outlined" : "contained"}
                    startIcon={authorData.isFollowing ? null : <AddIcon />}
                    onClick={handleFollow}
                    fullWidth
                    className={`${styles.button} ${authorData.isFollowing ? 
                      (mode === 'dark' ? styles.unfollowButtonDark : styles.unfollowButtonLight) : 
                      (mode === 'dark' ? styles.followButtonDark : styles.followButtonLight)}`}
                  >
                    {authorData.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={handleViewProfile}
                    fullWidth
                    className={`${styles.button} ${styles.viewButton} ${mode === 'dark' ? styles.viewButtonDark : styles.viewButtonLight}`}
                  >
                    View Profile
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </>
      )}
    </Card>
  );
} 
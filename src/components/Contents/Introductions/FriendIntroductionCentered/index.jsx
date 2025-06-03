import React, { useState, useEffect } from 'react';
import {
  ImageList,
  ImageListItem,
  Avatar,
  Stack,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  TextField,
  Button,
  ButtonGroup,
  Paper,
  Box,
  Chip,
  Divider,
  Card,
  CardContent,
  Skeleton,
  useTheme,
  Fade,
  Zoom,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import ChatIcon from '@mui/icons-material/Chat';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import VerifiedIcon from '@mui/icons-material/Verified';

import SocialMediaUtil from '../../../../util/io_utils/SocialMediaUtil';
import MessageUtil from '../../../../util/io_utils/MessageUtil';
import AccountUtil from '../../../../util/io_utils/AccountUtil';
import DatabaseManipulator from '../../../../util/io_utils/DatabaseManipulator';
import { update } from '../../../redux/refresh';
import { useNotification } from '../../../../Providers/NotificationProvider';
import { useThemeMode } from '../../../../Themes/ThemeContext';

export default function UserInformation(props) {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State management
  const [details, setDetails] = useState({});
  const [userID, setUserID] = useState(0);
  const [contactButtonText, setContactButtonText] = useState('');
  const [followButtonText, setFollowButtonText] = useState('');
  const [extraInformation, setExtraInformation] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const { userId, isMobile, position = 'center' } = props;

  // Enhanced dark mode color system
  const colors = {
    background: mode === 'dark' ? '#121212' : '#ffffff',
    paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
    surface: mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
    border: mode === 'dark' ? '#404040' : '#e0e0e0',
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#000000',
      secondary: mode === 'dark' ? '#b3b3b3' : '#666666',
      muted: mode === 'dark' ? '#808080' : '#999999',
    },
    accent: mode === 'dark' ? '#bb86fc' : theme.palette.primary.main,
    success: mode === 'dark' ? '#4caf50' : '#2e7d32',
    warning: mode === 'dark' ? '#ff9800' : '#ed6c02',
    error: mode === 'dark' ? '#f44336' : '#d32f2f',
  };

  // Update UI based on relationship status
  useEffect(() => {
    if (!details || details.relationship == null) {
      console.log('Updating relationship status...');
      return;
    }

    const relationship = details.relationship;
    
    // Reset states
    setFollowButtonText('');
    setContactButtonText('');
    setExtraInformation('');

    if (userID === details.userId) {
      setExtraInformation('This is your profile');
      return;
    }

    switch (relationship) {
      case 0: // No relationship
        setFollowButtonText('Follow');
        break;
      case 1: // They follow you
        setFollowButtonText('Follow');
        setExtraInformation('Following you');
        break;
      case 10: // You follow them
        setContactButtonText('Contact');
        setFollowButtonText('Unfollow');
        break;
      case 11: // Mutual following
        setExtraInformation('Following you');
        setFollowButtonText('Unfollow');
        setContactButtonText('Contact');
        break;
      default:
        console.warn('Unknown relationship status:', relationship);
    }
  }, [details, userID]);

  // Fetch user information
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        console.log('Fetching user data for:', userId);
        
        // Get current user ID
        const currentUserId = await localforage.getItem('userId');
        setUserID(currentUserId);
        
        // Request user info
        await MessageUtil.requestUserInfo(userId, setDetails);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        showNotification('Failed to load user information', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, showNotification]);

  // Handle contact action
  const handleContact = async () => {
    try {
      const currentUserId = await localforage.getItem('userId');
      
      if (details.userId === currentUserId) {
        showNotification('Cannot contact yourself', 'warning');
        return;
      }

      setActionLoading(true);
      const contact = { 
        type: 'single', 
        userId: userId, 
        name: details.userName 
      };

      await DatabaseManipulator.addRecentContact(contact);
      navigate('/chat', { ...contact });
      dispatch(update());
      showNotification(`Started conversation with ${details.userName}`, 'success');
      
    } catch (error) {
      console.error('Error starting conversation:', error);
      showNotification('Failed to start conversation', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle follow/unfollow action
  const handleFollow = async () => {
    try {
      setActionLoading(true);
      const currentUserId = await localforage.getItem('userId');
      const isFollowing = Math.floor(details.relationship / 10) === 1;

      if (isFollowing) {
        await SocialMediaUtil.unfollow(currentUserId, details.userId, details, setDetails);
        showNotification(`Unfollowed ${details.userName}`, 'info');
      } else {
        await SocialMediaUtil.follow(currentUserId, details.userId, details, setDetails);
        showNotification(`Now following ${details.userName}`, 'success');
      }
      
    } catch (error) {
      console.error('Error updating follow status:', error);
      showNotification('Failed to update follow status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Loading skeleton
  if (loading || !details) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <Stack spacing={3} alignItems="center">
          <Skeleton variant="circular" width={80} height={80} />
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="80%" height={24} />
          <Stack spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} variant="rectangular" height={56} />
            ))}
          </Stack>
        </Stack>
      </Box>
    );
  }

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          backgroundColor: colors.background,
          backgroundImage: mode === 'dark' 
            ? 'radial-gradient(circle at 20% 80%, #2d2d2d 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1a1a1a 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 80%, #f8f9fa 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 50%)',
        }}
      >
        <Stack
          direction="column"
          alignItems="center"
          spacing={3}
          sx={{ 
            width: '100%', 
            p: isMobile ? 2 : 3,
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          {/* Profile Header Card */}
          <Zoom in timeout={800}>
            <Card
              elevation={mode === 'dark' ? 0 : 3}
              sx={{
                width: '100%',
                backgroundColor: colors.paper,
                border: mode === 'dark' ? `1px solid ${colors.border}` : 'none',
                borderRadius: '20px',
                backgroundImage: mode === 'dark'
                  ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction={isMobile ? 'column' : 'row'}
                  spacing={3}
                  alignItems={isMobile ? 'center' : 'flex-start'}
                >
                  {/* Avatar Section */}
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      alt={details.userName}
                      src={details.avatar}
                      sx={{
                        width: 80,
                        height: 80,
                        border: `3px solid ${colors.accent}`,
                        boxShadow: `0 4px 20px ${colors.accent}40`,
                      }}
                    />
                    {details.verified && (
                      <VerifiedIcon
                        sx={{
                          position: 'absolute',
                          bottom: -5,
                          right: -5,
                          color: colors.accent,
                          backgroundColor: colors.paper,
                          borderRadius: '50%',
                          fontSize: 24,
                        }}
                      />
                    )}
                  </Box>

                  {/* User Info Section */}
                  <Box sx={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: colors.text.primary,
                        fontWeight: 700,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isMobile ? 'center' : 'flex-start',
                        gap: 1,
                      }}
                    >
                      {details.userName}
                      {details.nickname && (
                        <Chip
                          label={`"${details.nickname}"`}
                          size="small"
                          sx={{
                            backgroundColor: colors.surface,
                            color: colors.text.secondary,
                            fontStyle: 'italic',
                          }}
                        />
                      )}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: colors.text.secondary,
                        mb: 2,
                        lineHeight: 1.6,
                      }}
                    >
                      {details.introduction || 'No introduction available'}
                    </Typography>

                    {/* Status Chip */}
                    {extraInformation && (
                      <Chip
                        label={extraInformation}
                        color={extraInformation.includes('yourself') ? 'primary' : 'default'}
                        size="small"
                        sx={{
                          backgroundColor: extraInformation.includes('yourself') 
                            ? colors.accent 
                            : colors.surface,
                          color: extraInformation.includes('yourself') 
                            ? '#ffffff' 
                            : colors.text.secondary,
                        }}
                      />
                    )}
                  </Box>

                  {/* Action Buttons */}
                  {(followButtonText || contactButtonText) && (
                    <Stack direction={isMobile ? 'row' : 'column'} spacing={1}>
                      {followButtonText && (
                        <Button
                          variant={followButtonText === 'Unfollow' ? 'outlined' : 'contained'}
                          onClick={handleFollow}
                          disabled={actionLoading}
                          startIcon={
                            followButtonText === 'Follow' ? <PersonAddIcon /> : <PersonRemoveIcon />
                          }
                          sx={{
                            minWidth: 120,
                            borderRadius: '25px',
                            backgroundColor: followButtonText === 'Follow' 
                              ? colors.accent 
                              : 'transparent',
                            borderColor: colors.accent,
                            color: followButtonText === 'Follow' 
                              ? '#ffffff' 
                              : colors.accent,
                            '&:hover': {
                              backgroundColor: followButtonText === 'Follow' 
                                ? colors.accent + 'dd' 
                                : colors.accent + '20',
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 12px ${colors.accent}40`,
                            },
                            transition: 'all 0.3s ease-in-out',
                          }}
                        >
                          {followButtonText}
                        </Button>
                      )}

                      {contactButtonText && (
                        <Button
                          variant="contained"
                          onClick={handleContact}
                          disabled={actionLoading}
                          startIcon={<ChatIcon />}
                          sx={{
                            minWidth: 120,
                            borderRadius: '25px',
                            backgroundColor: colors.success,
                            '&:hover': {
                              backgroundColor: colors.success + 'dd',
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 12px ${colors.success}40`,
                            },
                            transition: 'all 0.3s ease-in-out',
                          }}
                        >
                          {contactButtonText}
                        </Button>
                      )}
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Zoom>

          {/* Details Card */}
          <Fade in timeout={1000}>
            <Card
              elevation={mode === 'dark' ? 0 : 2}
              sx={{
                width: '100%',
                backgroundColor: colors.paper,
                border: mode === 'dark' ? `1px solid ${colors.border}` : 'none',
                borderRadius: '16px',
                backgroundImage: mode === 'dark'
                  ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.text.primary,
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <PersonIcon sx={{ color: colors.accent }} />
                  Personal Information
                </Typography>

                <Stack spacing={3}>
                  {/* Gender */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <WcIcon sx={{ color: colors.text.secondary }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: colors.text.muted, mb: 0.5 }}>
                        Gender
                      </Typography>
                      <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 500 }}>
                        {details.gender ? 'Female' : 'Male'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: colors.border }} />

                  {/* Birthdate */}
                  {details.birthdate && (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CakeIcon sx={{ color: colors.text.secondary }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ color: colors.text.muted, mb: 0.5 }}>
                            Birthdate
                          </Typography>
                          <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 500 }}>
                            {details.birthdate}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ borderColor: colors.border }} />
                    </>
                  )}

                  {/* Location */}
                  {details.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LocationOnIcon sx={{ color: colors.text.secondary }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ color: colors.text.muted, mb: 0.5 }}>
                          Location
                        </Typography>
                        <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 500 }}>
                          {details.location}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Fade>
        </Stack>
      </Box>
    </Fade>
  );
}
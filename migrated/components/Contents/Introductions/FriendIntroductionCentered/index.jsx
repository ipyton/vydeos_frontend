import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Stack,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Divider,
  Card,
  CardContent,
  Skeleton,
  useTheme,
  Fade,
  Zoom,
  InputAdornment,
  IconButton
} from '@mui/material';

import {
  Chat as ChatIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  Cake as CakeIcon,
  Wc as WcIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import styles from '../../../../styles/Introductions.module.css';

// Dynamic imports for browser-only dependencies
const QRCodeCanvas = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeCanvas), { ssr: false });

export default function UserInformation(props) {
  const theme = useTheme();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const [invitationCode, setInvitationCode] = useState();
  // State management
  const [details, setDetails] = useState({});
  const [userID, setUserID] = useState(0);
  const [contactButtonText, setContactButtonText] = useState('');
  const [followButtonText, setFollowButtonText] = useState('');
  const [extraInformation, setExtraInformation] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { userId, isMobile, position = 'center' } = props;
  const [isOwner, setIsOwner] = useState(false);
  const [mode, setMode] = useState('light');

  // Check if we're on the client-side
  useEffect(() => {
    setIsClient(true);
    
    // Get theme mode from localStorage or system preference
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode') || 
                        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      setMode(savedMode);
    }
  }, []);

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
        setContactButtonText('');
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
    if (!isClient) return;
    
    const fetchUserData = async () => {
      try {
        setLoading(true);
        console.log('Fetching user data for:', userId);

        // Get current user ID from localStorage
        if (typeof window !== 'undefined') {
          const localforage = await import('localforage');
          const currentUserId = await localforage.default.getItem('userId');
          setUserID(currentUserId);

          // Mock user data for demo purposes
          // In a real app, you would fetch this from your API
          const mockUserData = {
            userId: userId,
            userName: 'User_' + userId,
            nickname: 'Nickname',
            introduction: 'This is a sample user introduction for the migrated component.',
            gender: Math.random() > 0.5,
            birthdate: '1990-01-01',
            location: 'New York, USA',
            verified: Math.random() > 0.7,
            relationship: Math.floor(Math.random() * 4) * 10 + Math.floor(Math.random() * 2)
          };
          
          setDetails(mockUserData);
        }
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
  }, [userId, isClient]);

  // Handle contact action
  const handleContact = async () => {
    if (!isClient) return;
    
    try {
      const localforage = await import('localforage');
      const currentUserId = await localforage.default.getItem('userId');

      if (details.userId === currentUserId) {
        showNotification('Cannot contact yourself', 'warning');
        return;
      }

      setActionLoading(true);
      const contact = {
        type: 'single',
        userId: userId,
        name: details.userName,
        count: 0
      };

      // Navigate to chat page
      router.push({
        pathname: "/chat",
        query: { ...contact }
      });
      
      showNotification(`Started conversation with ${details.userName}`, 'success');
    } catch (error) {
      console.error('Error starting conversation:', error);
      showNotification('Failed to start conversation', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const generateInvitationCode = async () => {
    try {
      // Add your invitation code generation logic here
      // For demo purposes, generate a random code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      setInvitationCode(code);
      showNotification("Invitation code generated", "success");
    } catch (error) {
      showNotification("Failed to generate invitation code", "error");
    }
  };

  const copyInvitationCode = () => {
    if (!isClient) return;
    
    if (invitationCode) {
      navigator.clipboard.writeText(invitationCode).then(() => {
        showNotification("Invitation code copied to clipboard", "success");
      }).catch(() => {
        showNotification("Failed to copy invitation code", "error");
      });
    }
  };

  // Handle follow/unfollow action
  const handleFollow = async () => {
    if (!isClient) return;
    
    try {
      setActionLoading(true);
      const localforage = await import('localforage');
      const currentUserId = await localforage.default.getItem('userId');
      const isFollowing = Math.floor(details.relationship / 10) === 1;

      // Mock follow/unfollow functionality
      // In a real app, you would call your API
      if (isFollowing) {
        setDetails({
          ...details,
          relationship: details.relationship % 10
        });
        showNotification(`Unfollowed ${details.userName}`, 'info');
      } else {
        setDetails({
          ...details,
          relationship: details.relationship + 10
        });
        showNotification(`Now following ${details.userName}`, 'success');
      }

    } catch (error) {
      console.error('Error updating follow status:', error);
      showNotification('Failed to update follow status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Mock notification function
  const showNotification = (message, severity) => {
    console.log(`[${severity}] ${message}`);
    // In a real app, you would use a notification system
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

  // Don't render on server-side
  if (!isClient) {
    return null;
  }

  return (
    <Fade in timeout={600}>
      <Box
        className={`${styles.userInfoContainer} ${mode === 'dark' ? styles.userInfoContainerDark : styles.userInfoContainerLight}`}
      >
        <Stack
          direction="column"
          alignItems="center"
          spacing={3}
          className={`${styles.userInfoStack} ${isMobile ? styles.userInfoStackMobile : styles.userInfoStackDesktop}`}
        >
          {/* Profile Header Card */}
          <Zoom in timeout={800}>
            <Card
              elevation={mode === 'dark' ? 0 : 3}
              className={`${styles.profileCard} ${mode === 'dark' ? styles.profileCardDark : styles.profileCardLight}`}
            >
              <CardContent className={styles.profileCardContent}>
                <Stack
                  direction={isMobile ? 'column' : 'row'}
                  spacing={3}
                  alignItems={isMobile ? 'center' : 'flex-start'}
                >
                  {/* Avatar Section */}
                  <Box className={styles.avatarContainer}>
                    <Avatar
                      alt={details.userName}
                      src={`/api/account/getAvatar/single_${details.userId}`}
                      className={`${styles.avatar} ${mode === 'dark' ? styles.avatarDark : styles.avatarLight}`}
                    />
                    {details.verified && (
                      <VerifiedIcon
                        className={`${styles.verifiedIcon} ${mode === 'dark' ? styles.verifiedIconDark : styles.verifiedIconLight}`}
                      />
                    )}
                  </Box>

                  {/* User Info Section */}
                  <Box className={`${styles.userInfoSection} ${isMobile ? styles.userInfoSectionMobile : styles.userInfoSectionDesktop}`}>
                    <Typography
                      variant="h5"
                      className={`${styles.userName} ${isMobile ? styles.userNameMobile : styles.userNameDesktop}`}
                    >
                      {details.userName}
                      {details.nickname && (
                        <Chip
                          label={`"${details.nickname}"`}
                          size="small"
                          className={`${styles.nicknameChip} ${mode === 'dark' ? styles.nicknameChipDark : styles.nicknameChipLight}`}
                        />
                      )}
                    </Typography>

                    <Typography
                      variant="body1"
                      className={`${styles.userIntroduction} ${mode === 'dark' ? styles.userIntroductionDark : styles.userIntroductionLight}`}
                    >
                      {details.introduction || 'No introduction available'}
                    </Typography>

                    {/* Status Chip */}
                    {extraInformation && (
                      <Chip
                        label={extraInformation}
                        color={extraInformation.includes('yourself') ? 'primary' : 'default'}
                        size="small"
                        className={`
                          ${styles.statusChip}
                          ${extraInformation.includes('yourself') ? styles.statusChipPrimary : ''}
                          ${mode === 'dark' ? styles.statusChipDark : styles.statusChipLight}
                        `}
                      />
                    )}
                  </Box>

                  {/* Action Buttons */}
                  {(followButtonText || contactButtonText) && (
                    <Stack 
                      className={`${styles.actionButtons} ${isMobile ? styles.actionButtonsMobile : styles.actionButtonsDesktop}`}
                      spacing={1}
                    >
                      {followButtonText && (
                        <Button
                          variant={followButtonText === 'Unfollow' ? 'outlined' : 'contained'}
                          onClick={handleFollow}
                          disabled={actionLoading}
                          startIcon={
                            followButtonText === 'Follow' ? <PersonAddIcon /> : <PersonRemoveIcon />
                          }
                          className={`
                            ${styles.followButton}
                            ${followButtonText === 'Follow' ? styles.followButtonContained : styles.followButtonOutlined}
                            ${followButtonText === 'Follow' 
                              ? (mode === 'dark' ? styles.followButtonContainedDark : styles.followButtonContainedLight)
                              : (mode === 'dark' ? styles.followButtonOutlinedDark : styles.followButtonOutlinedLight)
                            }
                          `}
                          sx={{
                            '&:hover': {
                              className: `
                                ${styles.followButtonHover}
                                ${followButtonText === 'Follow' 
                                  ? (mode === 'dark' ? styles.followButtonHoverContainedDark : styles.followButtonHoverContainedLight)
                                  : (mode === 'dark' ? styles.followButtonHoverOutlinedDark : styles.followButtonHoverOutlinedLight)
                                }
                              `
                            }
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
                          className={`${styles.contactButton} ${mode === 'dark' ? styles.contactButtonDark : styles.contactButtonLight}`}
                          sx={{
                            '&:hover': {
                              className: `${styles.contactButtonHover} ${mode === 'dark' ? styles.contactButtonHoverDark : styles.contactButtonHoverLight}`
                            }
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
              className={`${styles.detailsCard} ${mode === 'dark' ? styles.detailsCardDark : styles.detailsCardLight}`}
            >
              <CardContent className={styles.detailsCardContent}>
                <Typography
                  variant="h6"
                  className={`${styles.detailsTitle} ${mode === 'dark' ? styles.detailsTitleDark : styles.detailsTitleLight}`}
                >
                  <PersonIcon className={`${styles.detailsTitleIcon} ${mode === 'dark' ? styles.detailsTitleIconDark : styles.detailsTitleIconLight}`} />
                  Personal Information
                </Typography>

                <Stack spacing={3}>
                  {/* Gender */}
                  <Box className={styles.detailItem}>
                    <WcIcon className={`${styles.detailItemIcon} ${mode === 'dark' ? styles.detailItemIconDark : styles.detailItemIconLight}`} />
                    <Box className={styles.detailItemContent}>
                      <Typography 
                        variant="body2" 
                        className={`${styles.detailItemLabel} ${mode === 'dark' ? styles.detailItemLabelDark : styles.detailItemLabelLight}`}
                      >
                        Gender
                      </Typography>
                      <Typography 
                        variant="body1" 
                        className={`${styles.detailItemValue} ${mode === 'dark' ? styles.detailItemValueDark : styles.detailItemValueLight}`}
                      >
                        {details.gender ? 'Female' : 'Male'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider className={`${styles.divider} ${mode === 'dark' ? styles.dividerDark : styles.dividerLight}`} />

                  {/* Birthdate */}
                  {details.birthdate && (
                    <>
                      <Box className={styles.detailItem}>
                        <CakeIcon className={`${styles.detailItemIcon} ${mode === 'dark' ? styles.detailItemIconDark : styles.detailItemIconLight}`} />
                        <Box className={styles.detailItemContent}>
                          <Typography 
                            variant="body2" 
                            className={`${styles.detailItemLabel} ${mode === 'dark' ? styles.detailItemLabelDark : styles.detailItemLabelLight}`}
                          >
                            Birthdate
                          </Typography>
                          <Typography 
                            variant="body1" 
                            className={`${styles.detailItemValue} ${mode === 'dark' ? styles.detailItemValueDark : styles.detailItemValueLight}`}
                          >
                            {details.birthdate}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider className={`${styles.divider} ${mode === 'dark' ? styles.dividerDark : styles.dividerLight}`} />
                    </>
                  )}

                  {/* Location */}
                  {details.location && (
                    <Box className={styles.detailItem}>
                      <LocationOnIcon className={`${styles.detailItemIcon} ${mode === 'dark' ? styles.detailItemIconDark : styles.detailItemIconLight}`} />
                      <Box className={styles.detailItemContent}>
                        <Typography 
                          variant="body2" 
                          className={`${styles.detailItemLabel} ${mode === 'dark' ? styles.detailItemLabelDark : styles.detailItemLabelLight}`}
                        >
                          Location
                        </Typography>
                        <Typography 
                          variant="body1" 
                          className={`${styles.detailItemValue} ${mode === 'dark' ? styles.detailItemValueDark : styles.detailItemValueLight}`}
                        >
                          {details.location}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {invitationCode ? (
                    <TextField
                      value={invitationCode}
                      variant="outlined"
                      size="small"
                      fullWidth
                      className={`${styles.invitationField} ${mode === 'dark' ? styles.invitationFieldDark : styles.invitationFieldLight}`}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={copyInvitationCode}
                              edge="end"
                              className={`${styles.copyButton} ${mode === 'dark' ? styles.copyButtonDark : styles.copyButtonLight}`}
                            >
                              <CopyIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          '& fieldset': {
                            className: `${mode === 'dark' ? styles.invitationFieldBorderDark : styles.invitationFieldBorderLight}`
                          },
                          '&:hover fieldset': {
                            className: `${mode === 'dark' ? styles.invitationFieldHoverBorderDark : styles.invitationFieldHoverBorderLight}`
                          }
                        }
                      }}
                    />
                  ) : (
                    <Box className={`${styles.noInvitationContainer} ${mode === 'dark' ? styles.noInvitationContainerDark : styles.noInvitationContainerLight}`}>
                      {isOwner ? (
                        <Button
                          variant="outlined"
                          startIcon={<RefreshIcon />}
                          onClick={generateInvitationCode}
                          className={`${styles.generateButton} ${mode === 'dark' ? styles.generateButtonDark : styles.generateButtonLight}`}
                        >
                          Generate Code
                        </Button>
                      ) : (
                        <Typography className={`${styles.noInvitationText} ${mode === 'dark' ? styles.noInvitationTextDark : styles.noInvitationTextLight}`}>
                          No invitation code available
                        </Typography>
                      )}
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
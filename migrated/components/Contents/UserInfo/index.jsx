import React, { useState, useEffect } from 'react';
import { 
  Avatar, 
  Button, 
  TextField, 
  Select, 
  InputLabel, 
  MenuItem, 
  Grid, 
  Box, 
  Typography, 
  Container, 
  IconButton, 
  FormControl,
  Paper,
  Divider,
  Card,
  CardContent,
  FormHelperText,
  Stack,
  Tooltip
} from '@mui/material';

import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Import ThemeProvider from Material-UI
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { deepPurple, purple, grey } from '@mui/material/colors';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Material UI icons
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';

// Import context providers
import { useNotification } from '../../../contexts/NotificationProvider';
import { useThemeMode } from '../../../contexts/ThemeContext';

// Import styles
import styles from '../../../styles/UserInfo.module.css';

// API url constant
import { API_URL } from '../../../utils/URL';

// Dynamically import QR code component to avoid SSR issues
const QRCodeCanvas = dynamic(
  () => import('qrcode.react').then(mod => mod.QRCodeCanvas),
  { ssr: false }
);

// Country list moved inline for simplicity
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", 
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
  "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", 
  "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", 
  "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", 
  "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", 
  "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", 
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", 
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", 
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
  "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", 
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", 
  "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", 
  "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", 
  "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia", 
  "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", 
  "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", 
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", 
  "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", 
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", 
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function UserInfo(props) {
  const router = useRouter();
  const { login, setLogin } = props.status || {};
  const { showNotification } = useNotification();
  const [invitationCode, setInvitationCode] = useState('');
  const [userInfo, setUserInfo] = useState({
    avatar: "",
    gender: null, // null represents "prefer not to say"
    dateOfBirth: dayjs().subtract(18, 'year').format('YYYY-MM-DD'),
    userName: "",
    location: "",
    introduction: "",
    language: "",
    country: ""
  });

  const { mode } = useThemeMode();
  const [avatar, setAvatar] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Create a theme based on the current mode
  const theme = React.useMemo(() => createTheme({
    palette: {
      mode: mode,
      primary: {
        main: purple[500],
        light: purple[300],
        dark: purple[700],
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f5f5f5',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#333333',
        secondary: mode === 'dark' ? '#b0b0b0' : '#666666',
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '28px',
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 24px',
          },
          containedPrimary: {
            boxShadow: `0 8px 16px ${alpha(purple[500], 0.3)}`,
            '&:hover': {
              boxShadow: `0 12px 20px ${alpha(purple[500], 0.4)}`,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            boxShadow: mode === 'dark' 
              ? '0 8px 16px rgba(0, 0, 0, 0.4)' 
              : '0 8px 16px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            boxShadow: `0 4px 8px ${alpha('#000000', 0.2)}`,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
    },
  }), [mode]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const fetchUserData = async () => {
      try {
        setIsLoaded(true);
        // Dynamically import AccountUtil to avoid SSR issues
        const { default: AccountUtil } = await import('../../../utils/AccountUtil');
        
        // Fetch user info
        const userInfoResponse = await AccountUtil.getOwnerInfo(userInfo, setUserInfo);
        if (userInfoResponse?.data?.code !== -1) {
          const content = JSON.parse(userInfoResponse.data.message);
          setUserInfo(content);
          localStorage.setItem("userInfo", JSON.stringify(content));
        }

        // Fetch languages
        await AccountUtil.getLanguages(setLanguages);
        
        // Generate invitation code
        const userId = localStorage.getItem("userId");
        setInvitationCode(userId || '');
      } catch (error) {
        console.error("Error fetching user data:", error);
        showNotification("Failed to load profile data", "error");
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (newDate) => {
    setUserInfo(prevState => ({
      ...prevState,
      dateOfBirth: newDate ? newDate.format('YYYY-MM-DD') : prevState.dateOfBirth
    }));
  };

  const handleAvatarUpload = async (event) => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const file = event.target.files[0];
    if (file) {
      try {
        const avatarUrl = URL.createObjectURL(file);
        setAvatar(avatarUrl);
        
        // Dynamically import AccountUtil to avoid SSR issues
        const { default: AccountUtil } = await import('../../../utils/AccountUtil');
        
        // Upload avatar and wait for completion
        await AccountUtil.uploadAvatar(file);
        
        showNotification("Avatar uploaded successfully! You need at most 1 min to make effect!", "success");
      } catch (error) {
        console.error("Error uploading avatar:", error);
        showNotification("Failed to upload avatar", "error");
      }
    }
  };

  const handleSubmit = async (event) => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    event.preventDefault();
    
    // Save to local storage
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    try {
      // Dynamically import AccountUtil to avoid SSR issues
      const { default: AccountUtil } = await import('../../../utils/AccountUtil');
      
      // Update user info via API
      await AccountUtil.updateUserInfo(
        userInfo.introduction, 
        userInfo.userName, 
        userInfo.location, 
        null, 
        dayjs(userInfo.dateOfBirth).format('YYYY-MM-DD'), 
        userInfo.gender, 
        userInfo.language, 
        userInfo.country
      );
      
      showNotification("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification("Failed to update profile", "error");
    }
  };

  return (
    <>
      <Head>
        <title>User Profile</title>
        <meta name="description" content="Manage your user profile and account settings" />
      </Head>
      
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Container 
            maxWidth="md" 
            sx={{ mt: 5, mb: 5 }}
            className={styles.container}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                borderRadius: 4,
                overflow: 'hidden',
              }}
              className={styles.profilePaper}
            >
              {/* Header banner */}
              <Box
                sx={{
                  height: '120px',
                  background: `linear-gradient(45deg, ${purple[700]} 0%, ${purple[400]} 100%)`,
                  position: 'relative',
                }}
                className={styles.banner}
              />
              
              {/* Avatar section */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  mt: -8,
                  mb: 3
                }}
                className={styles.avatarSection}
              >
                <Box sx={{ position: 'relative' }}>
                  <Avatar 
                    src={typeof window !== 'undefined' ? 
                      `${API_URL}/account/getAvatar/single_${localStorage.getItem("userId")}` : 
                      undefined
                    }
                    sx={{ 
                      width: 140, 
                      height: 140, 
                      border: '5px solid',
                      borderColor: theme.palette.background.paper,
                      backgroundColor: deepPurple[500],
                      fontSize: '4rem'
                    }}
                    className={styles.avatar}
                  >
                    {userInfo.userName ? userInfo.userName[0].toUpperCase() : 'U'}
                  </Avatar>
                  <Tooltip title="Upload photo">
                    <label htmlFor="upload-avatar">
                      <input
                        style={{ display: 'none' }}
                        id="upload-avatar"
                        name="upload-avatar"
                        type="file"
                        onChange={handleAvatarUpload}
                        accept="image/*"
                      />
                      <IconButton 
                        component="span"
                        sx={{
                          position: 'absolute',
                          bottom: 5,
                          right: 5,
                          backgroundColor: theme.palette.primary.main,
                          color: '#fff',
                          '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                          },
                          width: 40,
                          height: 40,
                        }}
                        className={styles.uploadButton}
                      >
                        <PhotoCameraIcon />
                      </IconButton>
                    </label>
                  </Tooltip>
                </Box>

                <Typography variant="h4" component="h1" sx={{ mt: 2, fontWeight: 'bold' }} className={styles.title}>
                  User Profile
                </Typography>
                
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }} className={styles.subtitle}>
                  Customize your personal information
                  {isLoaded && typeof window !== 'undefined' && (
                    <>, Your ID: {localStorage.getItem("userId")}</>
                  )}
                </Typography>
              </Box>
              
              {/* QR Code section - Only render on client side */}
              {typeof window !== 'undefined' && (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mt: 2,
                  gap: 1
                }}
                className={styles.qrSection}>
                  <QRCodeCanvas
                    value={`single.${invitationCode}`}
                    size={128}
                    level="M"
                    bgColor={mode === "dark" ? "#1a1a1a" : "#ffffff"}
                    fgColor={mode === "dark" ? "#ffffff" : "#000000"}
                  />
                  <Typography variant="caption" sx={{
                    color: mode === "dark" ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                    textAlign: 'center'
                  }}
                  className={styles.qrCaption}>
                    Scan to make friends
                  </Typography>
                </Box>
              )}
              
              <Divider variant="middle" sx={{ mb: 4 }} />

              {/* Main form */}
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ px: 4, pb: 5 }} className={styles.form}>
                <Grid container spacing={3}>
                  {/* Personal Information Card */}
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ mb: 3 }} className={styles.card}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }} className={styles.sectionHeader}>
                          <PersonIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6" component="h2">
                            Personal Information
                          </Typography>
                        </Box>

                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Nickname"
                              name="userName"
                              value={userInfo.userName}
                              onChange={handleChange}
                              InputProps={{
                                startAdornment: <EditIcon color="action" sx={{ mr: 1, opacity: 0.6 }} />,
                              }}
                              variant="outlined"
                              className={styles.textField}
                            />
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth className={styles.formControl}>
                              <InputLabel id="gender-select-label">Gender</InputLabel>
                              <Select
                                labelId="gender-select-label"
                                name="gender"
                                value={userInfo.gender ?? ''}
                                onChange={handleChange}
                                label="Gender"
                              >
                                <MenuItem value={true}>Male</MenuItem>
                                <MenuItem value={false}>Female</MenuItem>
                                <MenuItem value="">Prefer not to say</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Introduction"
                              name="introduction"
                              value={userInfo.introduction}
                              onChange={handleChange}
                              multiline
                              rows={3}
                              placeholder="Tell us about yourself..."
                              InputProps={{
                                startAdornment: <InfoIcon color="action" sx={{ mr: 1, mt: 1, opacity: 0.6 }} />,
                              }}
                              variant="outlined"
                              className={styles.textField}
                            />
                            <FormHelperText>
                              A brief introduction about yourself that will be displayed on your profile
                            </FormHelperText>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Location Information Card */}
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ mb: 3 }} className={styles.card}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }} className={styles.sectionHeader}>
                          <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6" component="h2">
                            Location & Date
                          </Typography>
                        </Box>

                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Region"
                              name="location"
                              value={userInfo.location}
                              onChange={handleChange}
                              InputProps={{
                                startAdornment: <LocationOnIcon color="action" sx={{ mr: 1, opacity: 0.6 }} />,
                              }}
                              variant="outlined"
                              className={styles.textField}
                            />
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <DatePicker
                              label="Date of Birth"
                              value={dayjs(userInfo.dateOfBirth)}
                              onChange={handleDateChange}
                              slotProps={{ 
                                textField: { 
                                  fullWidth: true,
                                  InputProps: {
                                    startAdornment: <CalendarTodayIcon color="action" sx={{ mr: 1, opacity: 0.6 }} />,
                                  },
                                  className: styles.textField
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Regional Settings Card */}
                  <Grid item xs={12}>
                    <Card variant="outlined" className={styles.card}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }} className={styles.sectionHeader}>
                          <LanguageIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6" component="h2">
                            Regional Settings
                          </Typography>
                        </Box>

                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth className={styles.formControl}>
                              <InputLabel>Language</InputLabel>
                              <Select
                                name="language"
                                value={userInfo.language || ''}
                                onChange={handleChange}
                                label="Language"
                              >
                                {languages.map((lang) => (
                                  <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth className={styles.formControl}>
                              <InputLabel>Country</InputLabel>
                              <Select
                                name="country"
                                value={userInfo.country || ''}
                                onChange={handleChange}
                                label="Country"
                              >
                                {countries.map((country) => (
                                  <MenuItem key={country} value={country}>{country}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                {/* Submit Button */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }} className={styles.submitContainer}>
                  <Button 
                    type="submit"
                    variant="contained" 
                    color="primary" 
                    size="large"
                    startIcon={<SaveIcon />}
                    className={styles.submitButton}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Container>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
}
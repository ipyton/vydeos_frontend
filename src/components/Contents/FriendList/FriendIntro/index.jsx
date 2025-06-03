import { 
  ImageList, 
  ImageListItem, 
  Avatar, 
  useMediaQuery,
  Stack,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Typography,
  TextField,
  Button,
  ButtonGroup,
  Box,
  Paper,
  Chip
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from '../../../../Themes/ThemeContext';
import * as React from 'react';

export default function FriendIntro(props) {
  const { intro, name, pic, gender, birthdate, location, nickname, imageData } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mode } = useThemeMode();

  // Sample image data if not provided
  const displayImageData = imageData || [
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
    }
  ];

  // Enhanced dark mode colors
  const darkModeStyles = {
    background: mode === 'dark' ? '#121212' : 'background.paper',
    headerBg: mode === 'dark' ? '#1e1e1e' : '#f8f9fa',
    border: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    text: {
      primary: mode === 'dark' ? '#ffffff' : 'text.primary',
      secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
      muted: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'text.disabled'
    },
    input: {
      bg: mode === 'dark' ? '#2a2a2a' : '#ffffff',
      border: mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.23)'
    }
  };

  return (
    <Paper
      elevation={mode === 'dark' ? 8 : 2}
      sx={{ 
        overflow: "auto",
        width: "100%", 
        borderRadius: 3,
        bgcolor: darkModeStyles.background,
        height: '100%',
        border: `1px solid ${darkModeStyles.border}`,
      }}
    >
      {/* Enhanced User Header Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${
            mode === 'dark' 
              ? 'rgba(45, 45, 45, 0.95) 0%, rgba(30, 30, 30, 0.98) 100%'
              : 'rgba(248, 249, 250, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%'
          })`,
          backdropFilter: 'blur(10px)',
          borderBottom: `2px solid ${darkModeStyles.border}`,
          p: isMobile ? 2.5 : 3.5,
        }}
      >
        <Stack 
          direction={isMobile ? "column" : "row"} 
          justifyContent="space-between"
          alignItems={isMobile ? "center" : "flex-start"}
          spacing={isMobile ? 2 : 3}
        >
          {/* User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Avatar 
              alt={name} 
              src={pic} 
              sx={{ 
                width: isMobile ? 80 : 64, 
                height: isMobile ? 80 : 64,
                mr: 2.5,
                border: `3px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                boxShadow: mode === 'dark' 
                  ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 20px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant={isMobile ? "h5" : "h6"}
                sx={{ 
                  fontWeight: 700,
                  color: darkModeStyles.text.primary,
                  mb: 0.5,
                  letterSpacing: '0.02em'
                }}
              >
                {name}
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  color: darkModeStyles.text.secondary,
                  lineHeight: 1.5,
                  maxWidth: '400px'
                }}
              >
                {intro}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Stack 
            direction={isMobile ? "row" : "column"} 
            spacing={1.5}
            sx={{ minWidth: isMobile ? '100%' : '140px' }}
          >
            <Button 
              variant="outlined" 
              fullWidth={isMobile}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'primary.main',
                color: mode === 'dark' ? '#ffffff' : 'primary.main',
                '&:hover': {
                  borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'primary.dark',
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              Unfollow
            </Button>
            <Button 
              variant="contained" 
              fullWidth={isMobile}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: mode === 'dark' 
                  ? '0 4px 12px rgba(144, 202, 249, 0.2)' 
                  : '0 4px 12px rgba(25, 118, 210, 0.2)',
                '&:hover': {
                  boxShadow: mode === 'dark' 
                    ? '0 6px 16px rgba(144, 202, 249, 0.3)' 
                    : '0 6px 16px rgba(25, 118, 210, 0.3)'
                }
              }}
            >
              Contact
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Enhanced User Details Section */}
      <Box sx={{ p: isMobile ? 2.5 : 3.5 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2.5,
            fontWeight: 600,
            color: darkModeStyles.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          Personal Details
          <Chip 
            label="Profile" 
            size="small" 
            sx={{ 
              bgcolor: mode === 'dark' ? 'rgba(144, 202, 249, 0.15)' : 'primary.light',
              color: mode === 'dark' ? '#90caf9' : 'primary.contrastText',
              fontSize: '0.7rem'
            }} 
          />
        </Typography>

        <Stack spacing={2.5}>
          {[
            { label: "Gender", value: gender },
            { label: "Age", value: birthdate },
            { label: "Location", value: location },
            ...(nickname !== undefined ? [{ label: "Nickname", value: nickname || "Not specified" }] : [])
          ].map((field, index) => (
            <TextField
              key={index}
              label={field.label}
              value={field.value}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkModeStyles.input.bg,
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: darkModeStyles.input.border,
                    borderWidth: '1.5px'
                  },
                  '&:hover fieldset': {
                    borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: mode === 'dark' ? '#90caf9' : 'primary.main',
                  }
                },
                '& .MuiInputBase-input': {
                  color: darkModeStyles.text.primary,
                  fontWeight: 500
                },
                '& .MuiFormLabel-root': {
                  color: darkModeStyles.text.muted,
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: mode === 'dark' ? '#90caf9' : 'primary.main',
                  }
                }
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Enhanced Image Gallery Section */}
      {displayImageData && displayImageData.length > 0 && (
        <Box sx={{ px: isMobile ? 2.5 : 3.5, pb: 3.5 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2.5,
              fontWeight: 600,
              color: darkModeStyles.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Photo Gallery
            <Chip 
              label={`${displayImageData.length} photos`} 
              size="small" 
              sx={{ 
                bgcolor: mode === 'dark' ? 'rgba(76, 175, 80, 0.15)' : 'success.light',
                color: mode === 'dark' ? '#81c784' : 'success.contrastText',
                fontSize: '0.7rem'
              }} 
            />
          </Typography>
          
          <Paper
            elevation={mode === 'dark' ? 4 : 1}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#fafafa',
              border: `1px solid ${darkModeStyles.border}`
            }}
          >
            <ImageList 
              sx={{ 
                width: "100%", 
                overflowX: 'hidden',
                margin: 0
              }} 
              cols={isMobile ? 2 : 3} 
              gap={12}
            >
              {displayImageData.map((item, index) => (
                <ImageListItem 
                  key={item.img || index}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: `2px solid transparent`,
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.02)',
                      borderColor: mode === 'dark' ? 'rgba(144, 202, 249, 0.5)' : 'primary.main',
                      boxShadow: mode === 'dark' 
                        ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
                        : '0 8px 32px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <img
                    srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                    alt={item.title}
                    loading="lazy"
                    style={{ 
                      borderRadius: '6px',
                      aspectRatio: '1/1',
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                      filter: mode === 'dark' ? 'brightness(0.9) contrast(1.1)' : 'none'
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Paper>
        </Box>
      )}
    </Paper>
  );
}
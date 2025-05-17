import { ImageList, ImageListItem, Avatar, useMediaQuery } from "@mui/material";
import Stack from '@mui/material/Stack';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from '../../../../Themes/ThemeContext';
import Box from '@mui/material/Box';

export default function FriendIntro(props) {
  let { intro, name, pic, gender, birthdate, location, nickname, imageData } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mode } = useThemeMode();

  // Sample image data if not provided
  imageData = [
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
    }
  ];

  return (
    <Stack sx={{ 
      overflow: "auto",
      width: "100%", 
      boxShadow: 1,
      borderRadius: 2,
      bgcolor: mode === 'dark' ? '#1e1e1e' : 'background.paper',
      height: '100%',
    }}>
      {/* User header section */}
      <Stack 
        direction={isMobile ? "column" : "row"} 
        justifyContent={isMobile ? "center" : "space-between"}
        alignItems={isMobile ? "center" : "flex-start"}
        sx={{ 
          width: "100%", 
          p: isMobile ? 2 : 3,
          borderBottom: 1,
          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <ListItemAvatar>
            <Avatar 
              alt={name} 
              src={pic} 
              sx={{ 
                width: isMobile ? 64 : 48, 
                height: isMobile ? 64 : 48,
                mr: 2
              }} 
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography 
                variant={isMobile ? "h6" : "subtitle1"}
                sx={{ fontWeight: 'bold', color: mode === 'dark' ? '#fff' : 'inherit' }}
              >
                {name}
              </Typography>
            }
            secondary={
              <Typography
                variant="body2"
                color={mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'}
                sx={{ mt: 0.5 }}
              >
                {intro}
              </Typography>
            }
          />
        </Box>

        <ButtonGroup 
          orientation={isMobile ? "horizontal" : "vertical"} 
          sx={{ 
            mt: isMobile ? 2 : 0,
            width: isMobile ? '100%' : 'auto',
          }} 
          aria-label="Action buttons"
        >
          <Button 
            variant="outlined" 
            fullWidth={isMobile}
            sx={{ mb: isMobile ? 0 : 1 }}
          >
            Unfollow
          </Button>
          <Button 
            variant="contained" 
            fullWidth={isMobile}
          >
            Contact
          </Button>
        </ButtonGroup>
      </Stack>

      {/* User details section */}
      <Stack 
        sx={{ 
          width: isMobile ? "90%" : "80%", 
          mx: "auto",
          my: 3, 
          px: isMobile ? 1 : 2
        }}
        spacing={2}
      >
        <TextField
          label="Gender"
          defaultValue={gender}
          variant="outlined"
          size={isMobile ? "small" : "medium"}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          sx={{
            '.MuiInputBase-input': {
              color: mode === 'dark' ? '#fff' : 'inherit',
            },
            '.MuiFormLabel-root': {
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit',
            }
          }}
        />
        
        <TextField
          label="Age"
          defaultValue={birthdate}
          variant="outlined"
          size={isMobile ? "small" : "medium"}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          sx={{
            '.MuiInputBase-input': {
              color: mode === 'dark' ? '#fff' : 'inherit',
            },
            '.MuiFormLabel-root': {
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit',
            }
          }}
        />
        
        <TextField
          label="Location"
          defaultValue={location}
          variant="outlined"
          size={isMobile ? "small" : "medium"}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          sx={{
            '.MuiInputBase-input': {
              color: mode === 'dark' ? '#fff' : 'inherit',
            },
            '.MuiFormLabel-root': {
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit',
            }
          }}
        />

        {nickname !== undefined && (
          <TextField
            label="NickName"
            defaultValue={nickname || "bbbbb"}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            fullWidth
            type="search"
            sx={{
              '.MuiInputBase-input': {
                color: mode === 'dark' ? '#fff' : 'inherit',
              },
              '.MuiFormLabel-root': {
                color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit',
              }
            }}
          />
        )}
      </Stack>

      {/* Image gallery section */}
      {imageData && (
        <Box sx={{ width: "90%", mx: "auto", mb: 3 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mb: 2,
              fontWeight: 'medium',
              color: mode === 'dark' ? '#fff' : 'inherit'
            }}
          >
            Photos
          </Typography>
          <ImageList 
            sx={{ 
              width: "100%", 
              overflowX: 'hidden'
            }} 
            cols={isMobile ? 2 : 3} 
            gap={8}
          >
            {imageData.map((item) => (
              <ImageListItem 
                key={item.img}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                    transition: 'opacity 0.2s ease'
                  },
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <img
                  srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                  style={{ 
                    borderRadius: '4px',
                    aspectRatio: '1/1',
                    objectFit: 'cover'
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}
    </Stack>
  );
}
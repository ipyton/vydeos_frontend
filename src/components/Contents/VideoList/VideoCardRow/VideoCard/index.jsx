import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from '../../../../../Themes/ThemeContext';

export default function(props) {
  const content = props.content
  const navigate = useNavigate()
  const { mode } = useThemeMode();
  const handleClick = () => {
    navigate("/videoIntroduction", { state: content })
  }
  
  return (
    <Card 
      sx={{ 
        width: "25%",
        height: "auto",
        // Theme-aware colors
        backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.paper',
        color: mode === 'dark' ? '#fff' : 'text.primary',
        // Optional: Add a subtle border in dark mode
        border: mode === 'dark' ? '1px solid' : 'none',
        borderColor: mode === 'dark' ? '#2c2c2c' : 'transparent',
        // Optional: Adjust card elevation for better visibility in dark mode
        ...(mode === 'dark' && {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        })
      }}
    >
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          image={content.poster}
          alt="poster"
          sx={{
            // Optional: Maintain aspect ratio
            aspectRatio: '2/3',
            objectFit: 'cover'
          }}
        />
        <CardContent>
          <Typography 
            gutterBottom 
            variant="h5" 
            component="div"
            sx={{
              color: mode === 'dark' ? '#fff' : 'text.primary',
              fontWeight: mode === 'dark' ? 500 : 600
            }}
          >
            {content.movieName}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
            }}
          >
            {content.releaseYear}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
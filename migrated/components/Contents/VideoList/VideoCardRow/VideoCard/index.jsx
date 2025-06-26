import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from '../../../../../contexts/ThemeContext';
import styles from '../../../../../styles/VideoCard.module.css';

export default function VideoCard(props) {
  const content = props.content;
  const router = useRouter();
  const { mode } = useThemeMode();
  const theme = useTheme();
  
  const handleClick = () => {
    router.push({
      pathname: '/video/[id]',
      query: { id: content.movieId }
    });
  };
  
  return (
    <Card 
      className={`${styles.card} ${mode === 'dark' ? styles.darkCard : ''}`}
      sx={{
        // Responsive width
        width: {
          xs: '100%',        // Mobile: full width
          sm: 'calc(50% - 8px)',  // Small tablets: 2 per row
          md: 'calc(25% - 12px)', // Medium+: 4 per row
        },
        maxWidth: {
          xs: '400px',      // Prevent cards from being too wide on mobile
          sm: '300px',
          md: '280px'
        },
        height: 'auto',
        minHeight: {
          xs: '320px',      // Ensure consistent minimum height
          sm: '360px',
          md: '380px'
        },
        
        // Theme-aware colors
        backgroundColor: mode === 'dark' ? '#1e1e1e' : 'background.paper',
        color: mode === 'dark' ? '#fff' : 'text.primary',
        
        // Enhanced mobile touch targets
        '& .MuiCardActionArea-root': {
          minHeight: '48px', // Ensures touch target meets accessibility guidelines
        },
        
        // Improved borders and shadows
        border: mode === 'dark' ? '1px solid' : 'none',
        borderColor: mode === 'dark' ? '#2c2c2c' : 'transparent',
        ...(mode === 'dark' && {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }),
        
        // Hover effects for better interactivity
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: mode === 'dark' 
            ? '0 6px 16px rgba(0, 0, 0, 0.3)' 
            : '0 6px 16px rgba(0, 0, 0, 0.1)',
        },
        
        // Mobile-specific improvements
        [theme.breakpoints.down('sm')]: {
          margin: '0 auto', // Center single cards on mobile
        }
      }}
    >
      <CardActionArea 
        onClick={handleClick}
        className={styles.cardAction}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          // Improve touch feedback on mobile
          '&:active': {
            transform: 'scale(0.98)',
          }
        }}
      >
        <CardMedia
          component="img"
          image={content.poster}
          alt={`${content.movieName || 'Movie'} poster`}
          className={styles.cardMedia}
          sx={{
            aspectRatio: '2/3',
            objectFit: 'cover',
            width: '100%',
            // Ensure image loads properly on mobile
            minHeight: {
              xs: '200px',
              sm: '240px',
              md: '260px'
            }
          }}
        />
        <CardContent
          className={styles.cardContent}
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: {
              xs: theme.spacing(1.5), // Slightly less padding on mobile
              sm: theme.spacing(2),
            },
            '&:last-child': {
              paddingBottom: {
                xs: theme.spacing(1.5),
                sm: theme.spacing(2),
              }
            }
          }}
        >
          <Typography 
            gutterBottom
            variant="h6"
            component="div"
            className={styles.title}
            sx={{
              color: mode === 'dark' ? '#fff' : 'text.primary',
              fontWeight: mode === 'dark' ? 500 : 600,
              fontSize: {
                xs: '1.1rem',  // Smaller font on mobile
                sm: '1.25rem',
                md: '1.5rem'
              },
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2, // Limit to 2 lines
              WebkitBoxOrient: 'vertical',
              marginBottom: theme.spacing(1)
            }}
          >
            {content.movieName || 'Untitled Video'}
          </Typography>
          <Typography 
            variant="body2"
            className={styles.year}
            sx={{
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
              fontSize: {
                xs: '0.875rem',
                sm: '0.875rem'
              }
            }}
          >
            {content.releaseYear || ''}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
} 
import * as React from 'react';
import { 
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useThemeMode } from '../../../../../contexts/ThemeContext';
import Image from 'next/image';

// Styled components with dark mode support
const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme, variant }) => ({
  width: variant === 'square' ? 56 : 40,
  height: variant === 'square' ? 56 : 40,
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  border: `1px solid ${theme.palette.divider}`,
}));

const TruncatedText = styled(Typography)(({ theme }) => ({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export default function SearchItem({ content, type = '', setSelector, idx }) {
  const { mode } = useThemeMode();
  
  // Define color scheme based on theme mode
  const colors = {
    primary: mode === 'dark' ? '#fff' : '#000',
    secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    tertiary: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
    background: mode === 'dark' ? '#121212' : '#fff',
    divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
  };

  if (!content) return null;
  
  const handleClick = () => {
    // Use content.type if available, otherwise use type prop
    const itemType = content.type || type;
    setSelector({ ...content, type: itemType });
  };

  // Render different item layouts based on type
  const renderItem = () => {
    switch (content.type || type) {
      case 'contact':
        return (
          <>
            <ListItemAvatar>
              <StyledAvatar 
                alt={content.name || 'User'} 
                src={content.pics || '/images/avatar/1.jpg'} 
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <TruncatedText variant="subtitle1" sx={{ color: colors.primary }}>
                  {content.name}
                </TruncatedText>
              }
              secondary={
                <TruncatedText variant="body2" sx={{ color: colors.secondary }}>
                  {content.intro}
                </TruncatedText>
              }
            />
          </>
        );
        
      case 'movie':
        return (
          <>
            <ListItemAvatar>
              <StyledAvatar 
                variant="square"
                src={content.image_address || '/images/movie-placeholder.jpg'} 
                alt={content.translated_name || content.original_name || 'Video'}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <TruncatedText variant="subtitle1" sx={{ color: colors.primary }}>
                  {[content.translated_name, content.original_name].filter(Boolean).join(' - ')}
                </TruncatedText>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: colors.secondary, display: 'block' }}
                  >
                    {content.release_date}
                  </Typography>
                  <TruncatedText variant="body2" sx={{ color: colors.tertiary }}>
                    {content.introduction ? 
                      (content.introduction.length > 80 ? 
                        `${content.introduction.substring(0, 80)}...` : 
                        content.introduction) : 
                      'No description available'}
                  </TruncatedText>
                </Box>
              }
            />
          </>
        );
      
      case 'tv':
        return (
          <>
            <ListItemAvatar>
              <StyledAvatar 
                variant="square"
                src={content.image_address || '/images/movie-placeholder.jpg'} 
                alt={content.translated_name || content.original_name || 'Video'}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <TruncatedText variant="subtitle1" sx={{ color: colors.primary }}>
                  {[content.translated_name, content.original_name].filter(Boolean).join(' - ')}
                </TruncatedText>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: colors.secondary, display: 'block' }}
                  >
                    {content.release_date}
                  </Typography>
                  <TruncatedText variant="body2" sx={{ color: colors.tertiary }}>
                    {content.introduction ? 
                      (content.introduction.length > 80 ? 
                        `${content.introduction.substring(0, 80)}...` : 
                        content.introduction) : 
                      'No description available'}
                  </TruncatedText>
                </Box>
              }
            />
          </>
        );
        
      case 'music':
        return (
          <>
            <ListItemAvatar>
              <StyledAvatar 
                variant="square"
                src={content.cover || '/images/music-placeholder.jpg'} 
                alt={content.title || 'Music'}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <TruncatedText variant="subtitle1" sx={{ color: colors.primary }}>
                  {content.title}
                </TruncatedText>
              }
              secondary={
                <TruncatedText variant="body2" sx={{ color: colors.secondary }}>
                  {content.artist || 'Unknown Artist'}
                </TruncatedText>
              }
            />
          </>
        );
        
      case 'chatRecords':
        return (
          <>
            <ListItemAvatar>
              <StyledAvatar 
                alt="Chat"
                src="/images/chat-placeholder.jpg"
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <TruncatedText variant="subtitle1" sx={{ color: colors.primary }}>
                  {content.title || 'Chat History'}
                </TruncatedText>
              }
              secondary={
                <TruncatedText variant="body2" sx={{ color: colors.secondary }}>
                  {content.preview || 'No preview available'}
                </TruncatedText>
              }
            />
          </>
        );
        
      case 'posts':
        return (
          <>
            <ListItemAvatar>
              <StyledAvatar 
                src={content.thumbnail || '/images/post-placeholder.jpg'} 
                alt={content.title || 'Post'}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <TruncatedText variant="subtitle1" sx={{ color: colors.primary }}>
                  {content.title || 'Untitled Post'}
                </TruncatedText>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: colors.secondary, display: 'block' }}
                  >
                    {content.author || 'Unknown Author'} • {content.date}
                  </Typography>
                  <TruncatedText variant="body2" sx={{ color: colors.tertiary }}>
                    {content.excerpt || 'No content preview available'}
                  </TruncatedText>
                </Box>
              }
            />
          </>
        );
        
      default:
        return (
          <>
            <ListItemAvatar>
              <StyledAvatar alt="Item" />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="subtitle1">Unknown Item</Typography>}
              secondary={<Typography variant="body2">No details available</Typography>}
            />
          </>
        );
    }
  };

  return (
    <StyledListItemButton
      onClick={handleClick}
      sx={{
        borderRadius: 1,
        mb: 1,
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }
      }}
      data-testid={`search-item-${idx}`}
    >
      {renderItem()}
    </StyledListItemButton>
  );
} 
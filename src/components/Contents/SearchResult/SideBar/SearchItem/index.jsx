import * as React from 'react';
import { 
  ListItemButton,
  ListItemAvatar,
  ListItem,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useThemeMode } from '../../../../../Themes/ThemeContext';

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
                src={content.pics || '/static/images/avatar/1.jpg'} 
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
                src={content.image_address || '/static/images/movie-placeholder.jpg'} 
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
                src={content.image_address || '/static/images/movie-placeholder.jpg'} 
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
                src={content.cover || '/static/images/music-placeholder.jpg'} 
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
                src="/static/images/chat-placeholder.jpg"
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
                src={content.thumbnail || '/static/images/post-placeholder.jpg'} 
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
              primary={
                <Typography sx={{ color: colors.primary }}>Unknown Item Type</Typography>
              }
              secondary={
                <Typography sx={{ color: colors.secondary }}>
                  Cannot display preview for this item type
                </Typography>
              }
            />
          </>
        );
    }
  };

  return (
    <>
      <StyledListItemButton 
        onClick={handleClick}
        sx={{ 
          backgroundColor: colors.background,
          '&:hover': {
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
          }
        }}
      >
        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
          {renderItem()}
        </ListItem>
      </StyledListItemButton>
      <Divider 
        variant="inset" 
        component="li" 
        sx={{ backgroundColor: colors.divider }}
      />
    </>
  );
}
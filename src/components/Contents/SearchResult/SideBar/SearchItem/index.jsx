import * as React from 'react';
import { 
  ListItemButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components for better visual appearance
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
                <TruncatedText variant="subtitle1">
                  {content.name}
                </TruncatedText>
              }
              secondary={
                <TruncatedText variant="body2" color="text.secondary">
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
                <TruncatedText variant="subtitle1">
                  {[content.translated_name, content.original_name].filter(Boolean).join(' - ')}
                </TruncatedText>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    sx={{ display: 'block' }}
                  >
                    {content.release_date}
                  </Typography>
                  <TruncatedText variant="body2" color="text.secondary">
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
                <TruncatedText variant="subtitle1">
                  {[content.translated_name, content.original_name].filter(Boolean).join(' - ')}
                </TruncatedText>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    sx={{ display: 'block' }}
                  >
                    {content.release_date}
                  </Typography>
                  <TruncatedText variant="body2" color="text.secondary">
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
                <TruncatedText variant="subtitle1">
                  {content.title}
                </TruncatedText>
              }
              secondary={
                <TruncatedText variant="body2" color="text.secondary">
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
                <TruncatedText variant="subtitle1">
                  {content.title || 'Chat History'}
                </TruncatedText>
              }
              secondary={
                <TruncatedText variant="body2" color="text.secondary">
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
                <TruncatedText variant="subtitle1">
                  {content.title || 'Untitled Post'}
                </TruncatedText>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    sx={{ display: 'block' }}
                  >
                    {content.author || 'Unknown Author'} • {content.date}
                  </Typography>
                  <TruncatedText variant="body2" color="text.secondary">
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
              primary="Unknown Item Type"
              secondary="Cannot display preview for this item type"
            />
          </>
        );
    }
  };

  return (
    <>
      <StyledListItemButton onClick={handleClick}>
        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
          {renderItem()}
        </ListItem>
      </StyledListItemButton>
      <Divider variant="inset" component="li" />
    </>
  );
}
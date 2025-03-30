import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { Box, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';  // Add this import
import { formatDistanceToNow } from 'date-fns';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export default function Session({ title, selected, sessionId, lastModified, onClick }) {
  const theme = useTheme();
  const formattedDate = lastModified ? 
    formatDistanceToNow(new Date(lastModified), { addSuffix: true }) : 
    'No date available';
    
  return (
    <ListItemButton 
      onClick={onClick} 
      selected={selected}
      sx={{ 
        borderRadius: 2,
        my: 0.5,
        py: 1.5,
        px: 1,
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        position: 'relative',
        '&::before': selected ? {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '20%',
          height: '60%',
          width: '4px',
          backgroundColor: 'primary.main',
          borderRadius: '0 4px 4px 0'
        } : {},
        '&.Mui-selected': {
          backgroundColor: theme => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            backgroundColor: theme => alpha(theme.palette.primary.main, 0.12),
          }
        },
        '&:hover': {
          backgroundColor: theme => alpha(theme.palette.primary.main, 0.04),
          transform: 'translateY(-1px)',
          boxShadow: selected ? 'none' : '0 3px 8px rgba(0,0,0,0.05)'
        }
      }}
    >
      <Box sx={{ 
        color: selected ? 'primary.main' : 'text.secondary',
        display: 'flex',
        alignItems: 'center',
        mr: 2,
        opacity: 0.8
      }}>
        <ChatBubbleOutlineIcon fontSize="small" />
      </Box>
      
      <ListItem disablePadding>
        <ListItemText 
          disableTypography
          primary={
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: selected ? 600 : 400,
                color: selected ? 'primary.main' : 'text.primary',
                mb: 0.5,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {title || 'Untitled Session'}
            </Typography>
          }
          secondary={
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                opacity: 0.8,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {formattedDate}
            </Typography>
          }
        />
      </ListItem>
    </ListItemButton>
  );
}
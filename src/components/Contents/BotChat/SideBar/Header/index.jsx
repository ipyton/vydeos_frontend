import * as React from 'react';
import { Button, Typography, Box, Avatar, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { alpha } from '@mui/material/styles';

export default function Header() {
  return (
    <Box sx={{ 
      padding: 3, 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      background: 'linear-gradient(135deg, #f5f7ff 0%, #edf1ff 100%)',
      borderBottom: '1px solid rgba(0,0,0,0.03)'
    }}>
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{ 
              width: 36, 
              height: 36, 
              bgcolor: theme => alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              fontWeight: 'bold',
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
            }}
          >
            AI
          </Avatar>
          <Typography 
            variant="h6" 
            sx={{ 
              ml: 1.5, 
              fontWeight: 600,
              background: 'linear-gradient(90deg, #333333, #666666)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            AI Chat
          </Typography>
        </Box>
        
        <Tooltip title="Settings">
          <IconButton 
            size="small" 
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                bgcolor: alpha('#000', 0.04)
              }
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Button 
        variant="contained" 
        startIcon={<AddIcon />}
        fullWidth
        href="#new-session" 
        sx={{ 
          borderRadius: 2,
          textTransform: 'none',
          py: 1.2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          background: 'linear-gradient(90deg, #3a7bd5, #00d2ff)',
          fontWeight: 500,
          fontSize: '0.9rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        New Conversation
      </Button>
    </Box>
  );
}
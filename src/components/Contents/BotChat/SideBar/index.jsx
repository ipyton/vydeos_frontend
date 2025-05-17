import { Stack, Box, Typography, Divider } from '@mui/material';
import List from '@mui/material/List';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import Header from './Header';
import Session from './Session';

export default function SideBar({ select, setSelect, sessions, setSessions }) {
  const location = useLocation();
  
  const handleSessionClick = (sessionId) => {
    setSelect(sessionId);
  };
  
  return (
    <Stack 
      sx={{ 
        width: "100%", 
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
        borderRadius: 3,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
        border: '1px solid rgba(0,0,0,0.08)'
      }} 
      spacing={0}
    >
      <Header />
      <Divider sx={{ width: '90%', alignSelf: 'center', my: 1 }} />
      
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ 
          fontWeight: 500, 
          fontSize: '0.75rem',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          ml: 1
        }}>
          Recent Sessions
        </Typography>
      </Box>
      
      <List 
        sx={{ 
          width: '100%', 
          bgcolor: 'transparent', 
          overflow: 'auto',
          flexGrow: 1,
          px: 1,
          py: 0,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha('#888', 0.3),
            borderRadius: 4,
            '&:hover': {
              backgroundColor: alpha('#888', 0.5),
            }
          }
        }}
      >
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <Session 
              key={session.sessionId}
              onClick={() => handleSessionClick(session.sessionId)} 
              title={session.title} 
              sessionId={session.sessionId}
              lastModified={session.lastModified}
              selected={select === session.sessionId}
            />
          ))
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%',
            opacity: 0.6,
            flexDirection: 'column'
          }}>
            <Typography color="text.secondary" sx={{ mt: 4, mb: 1 }}>
              No sessions yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ px: 4, textAlign: 'center' }}>
              Start a new session to begin chatting
            </Typography>
          </Box>
        )}
      </List>
    </Stack>
  );
}
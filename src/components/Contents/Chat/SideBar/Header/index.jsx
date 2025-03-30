import * as React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';

export default function Header() {
  return (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        backgroundColor: 'primary.main',
        color: 'white',
        borderRadius: '12px 12px 0 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PeopleAltIcon sx={{ fontSize: 28, mr: 1.5 }} />
        <Typography variant="h6" component="h1" fontWeight="600">
          Contacts
        </Typography>
      </Box>
      
      <Box>
        <IconButton size="small" sx={{ color: 'white', mr: 1 }}>
          <SearchIcon />
        </IconButton>
        <IconButton size="small" sx={{ color: 'white' }}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { MenuItem } from "@mui/material";
import ListItemAvatar from '@mui/material/ListItemAvatar';

import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import ListItemText from '@mui/material/ListItemText';
import { useThemeMode } from '../../../../Themes/ThemeContext';
export function SingleMessage(props) {
    const navigate = useNavigate();
    let handleMessageJump = (event, target) => {
        navigate("/chat")
    } 
    const { mode } = useThemeMode();
    return (
<MenuItem onClick={handleMessageJump} sx={{
  backgroundColor: mode === 'dark' ? '#333' : '#fff', // Background color for dark/light mode
  color: mode === 'dark' ? '#fff' : '#000',           // Text color for dark/light mode
  '&:hover': {
    backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)', // Hover effect
  },
}}>
  <ListItemAvatar>
    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
  </ListItemAvatar>
  <ListItemText 
    primary="Sam Smith"
    secondary={
      <React.Fragment>
        {" — I'll be in your neighborhood doing"}
      </React.Fragment>
    }
    primaryTypographyProps={{
      sx: { color: mode === 'dark' ? '#fff' : '#000' }, // Primary text color
    }}
    secondaryTypographyProps={{
      sx: { color: mode === 'dark' ? '#ccc' : '#555' }, // Secondary text color
    }}
  />
</MenuItem>
      )
}

import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { MenuItem } from "@mui/material";
import ListItemAvatar from '@mui/material/ListItemAvatar';

import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import ListItemText from '@mui/material/ListItemText';
export function SingleMessage(props) {
    const navigate = useNavigate();
    let handleMessageJump = (event, target) => {
        navigate("/chat")
    } 
    return (
        <MenuItem alignItems="flex-start" onClick={handleMessageJump}>
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText 
        primary="Sam Smith"
        secondary={
          <React.Fragment>
            {" — I'll be in your neighborhood doing"}
          </React.Fragment>
        }>Name</ListItemText>
      </MenuItem>
      )
}

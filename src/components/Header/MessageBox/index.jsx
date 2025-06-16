import * as React from 'react';

import Menu from '@mui/material/Menu';

import localforage from 'localforage';
import { SingleMessage } from './SingleMessage';
import { useState } from 'react';
import { useThemeMode } from '../../../Themes/ThemeContext';
import MenuItem from '@mui/material/MenuItem';
export default function MessageBox(props) {
  let {refresh, notificationsAnchorEl, menuId, notificationsOpen, setNotificationsAnchorEl,notifications,setNotifications, markAsRead} = props
  const { mode } = useThemeMode();
  const handleNotificationClose = () => {
    setNotificationsAnchorEl(null)
  }

    return (     
<Menu
  PaperProps={{
    style: {
      width: 350,
      minHeight: notifications.length === 0 ? 120 : 'auto', // Maintain minimum height when empty
      backgroundColor: mode === 'dark' ? '#333' : '#fff',
      color: mode === 'dark' ? '#fff' : '#000',
    },
  }}
  anchorEl={notificationsAnchorEl}
  anchorOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  id={menuId}
  keepMounted
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  open={notificationsOpen}
  onClose={handleNotificationClose}
>
  {notifications.length === 0 ? (
    <MenuItem 
      disabled 
      style={{ 
        justifyContent: 'center',
        padding: '20px',
        color: mode === 'dark' ? '#999' : '#666',
        fontStyle: 'italic'
      }}
    >
      No new notifications
    </MenuItem>
  ) : (
    notifications.map((notification, idx) => (
      <SingleMessage key={idx} notification={notification} markAsRead={markAsRead}/>
    ))
  )}
</Menu>
      )
}
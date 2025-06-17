import * as React from 'react';

import Menu from '@mui/material/Menu';
import { useEffect } from 'react';
import localforage from 'localforage';
import { SingleMessage } from './SingleMessage';
import { useState } from 'react';
import { useThemeMode } from '../../../Themes/ThemeContext';
import MenuItem from '@mui/material/MenuItem';
import DatabaseManipulator from '../../../util/io_utils/DatabaseManipulator';
import { useSelector } from 'react-redux';
export default function MessageBox(props) {
  let { notificationsAnchorEl, menuId, notificationsOpen, setNotificationsAnchorEl, markAsRead,notifications,setNotifications} = props
  const { mode } = useThemeMode();
  // const [notifications, setNotifications] = useState([])
  const handleNotificationClose = () => {
    setNotificationsAnchorEl(null)
  }

  //     useEffect(() => {
  //         DatabaseManipulator.getUnreadMessages().then((res) => {
  //             console.log("Fetched unread messages:", res);
  //             setNotifications(res || []); // Ensure this is always an array
  //         })
  
  //     }, [refresh])

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
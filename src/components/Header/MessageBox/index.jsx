import * as React from 'react';

import Menu from '@mui/material/Menu';

import localforage from 'localforage';
import { SingleMessage } from './SingleMessage';
import { useState } from 'react';
import { useThemeMode } from '../../../Themes/ThemeContext';

export default function MessageBox(props) {
  let {refresh, notificationsAnchorEl, menuId, notificationsOpen, setNotificationsAnchorEl,notifications,setNotifications} = props
  let [message, setMessage] = useState([])
  const { mode } = useThemeMode();
  const handleNotificationClose = () => {
    setNotificationsAnchorEl(null)
  }

  console.log(notifications)


  let onclick = (idx) => {
    localforage.setItem(message[idx].userId + "_lastRead")
  }

    return (     
      // Apply dark/light styles to the Menu PaperProps
      <Menu
        PaperProps={{
          style: {
            width: 350,
            backgroundColor: mode === 'dark' ? '#333' : '#fff', // Dark mode background
            color: mode === 'dark' ? '#fff' : '#000',           // Light mode text color
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
        <SingleMessage />
      </Menu>
      )
}
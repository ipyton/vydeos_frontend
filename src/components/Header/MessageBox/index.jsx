import * as React from 'react';

import Menu from '@mui/material/Menu';

import localforage from 'localforage';
import { SingleMessage } from './SingleMessage';
import { useState } from 'react';

export default function MessageBox(props) {
  let {refresh, notificationsAnchorEl, menuId, notificationsOpen, setNotificationsAnchorEl} = props
  let [message, setMessage] = useState([])
  const handleNotificationClose = () => {
    setNotificationsAnchorEl(null)
  }
  React.useEffect(()=> {
    let listToShow = []
  localforage.getItem("mailBox", (unreadList)=> {
    setMessage(unreadList)
  }).catch(err=> {
    console.log("messages set error")
  })
  },[refresh])

  let onclick = (idx) => {
    localforage.setItem(message[idx].userId + "_lastRead")
  }

    return (     
    <Menu
        PaperProps={{  
          style: {  
            width: 350,  
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
        <SingleMessage></SingleMessage>
      </Menu>)
}
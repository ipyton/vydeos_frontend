import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
// import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import LanguageIcon from '@mui/icons-material/Language';
import { Avatar, Fab, ListItemButton } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import IOUtil from '../../util/ioUtil';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import zIndex from '@mui/material/styles/zIndex';
import { eventWrapper } from '@testing-library/user-event/dist/utils';
import FunctionDrawer from './FunctionDrawer';
import MuiAppBar from '@mui/material/AppBar';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import localforage from 'localforage';


export function MessageBox(props) {
  let [refresh] = props
  let [message, setMessage] = useState([])
  React.useEffect(()=> {
    let listToShow = []
  localforage.getItem("contacts", (contacts)=> {
    contacts.forEach(async element => {
      await localforage.getItem( element.userId + "_lastCheck",(last_check_timestamp) => {
        element.messages.forEach((message) => {
          if (message.timestamp > last_check_timestamp) {
            listToShow.push(message)
          }
        })
      })
    });
  })

  },[refresh])


  let onclick = (idx) => {
    localforage.setItem(message[idx].userId + "_lastCheck")
  }

  let socket = new WebSocket("ws://localhost:8080/notification/88488")
  //socket.binaryType = "text frames"
  socket.onopen = function(e) {
    console.log("ws open successfully!!!!")    
  }
  socket.onmessage = (event)=>{
    console.log(event)
  }
  setTimeout(function() {
    console.log("sending message")
    socket.send({userID:88488, time:9238042, method:"get"})
  },1000)

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
            <MenuItem alignItems="flex-start">
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
            
           
      </Menu>)
}
import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { useDispatch, useSelector } from 'react-redux';
import SearchItem from './SearchItem';


export default function BasicList() {
  const searchResult = useSelector((state) => state.searchResult.value)
  // [{name:"james",pics:"siehru", intro:"sus", type:"contact"}, {name:"time",pics:"zdxf", intro:"sfs", type:"video"}]
  //pics here means avatar.
  return (
    <Box sx={{
      width: '100%', bgcolor: 'background.paper', display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>


      <List sx={{ height: "100%", width: "50%" }}>
        {
          searchResult.map((item, index) => {
            return (<SearchItem title={item.name} introduction={item.intro} type={item.type} pics={item.pics} userId={item.userId}></SearchItem>)
          })
        }
        {/* <nav aria-label="main mailbox folders">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText primary="Drafts" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
      <nav aria-label="secondary mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
            <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Trash" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Spam" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav> */}
      </List>
    </Box>
  );
}
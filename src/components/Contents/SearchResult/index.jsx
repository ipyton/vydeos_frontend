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
import SearchItem from './SideBar/SearchItem';
import Introductions from '../Introductions';
import SideBar from './SideBar';
import { Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';


export default function BasicList() {
  const searchResult = useSelector((state) => state.searchResult.value)
  // [{name:"james",pics:"siehru", intro:"sus", type:"contact"}, {name:"time",pics:"zdxf", intro:"sfs", type:"video"}]
  console.log(searchResult)
  console.log("searchResult")
  //pics here means avatar.
  const location = useLocation();

  let [selector, setSelector] = React.useState({ type: "", objectId: "null" })
  console.log(selector)
 // const { searchResult,type  } = location.state || {}; // 获取 state 参数
  let height = window.innerHeight * 0.8
  return (
    <Stack sx={{ marginLeft: '10%', width: '80%', marginTop: 3, height: height }} direction="row" justify="center" spacing={2}>
      <SideBar setSelector={setSelector}></SideBar>
      <Stack sx={{overflow:"scroll",width:"70%", height:"100%", boxShadow: 1, borderRadius: 2 }} ><Introductions selector={selector} position={"right"}></Introductions> </Stack>
    </Stack>
  );
}
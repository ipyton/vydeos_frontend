import { Stack } from '@mui/material';
import Header from './Header';
import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import localforage from 'localforage';
import { useEffect, useState } from 'react';
import { ResetTvOutlined } from '@mui/icons-material';
import MessageUtil from '../../../../util/io_utils/MessageUtil';
import { useLocation } from 'react-router-dom';
import Session from './Session';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function SideBar(props) {
  let { select, setSelect, sessions, setSessions} = props
  const location = useLocation()
 

  //let [listItem,setListItem] = useState([])
  let onClick = (idx) => {
    return () => {
      let mid = sessions[idx]
      //setUserRecords([mid, ...userRecords.slice(0, idx), ...userRecords.slice(idx + 1)])
      setSelect(mid["sessionId"])
    }
  }




  return (

    <Stack sx={{ width: "30%", boxShadow: 1, borderRadius: 2 }} spacing={2}>
      <Header></Header>
      <List sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'scroll' }}>
        {sessions.map((session, idx) => {
          console.log(idx)
          return <Session onClick={onClick(idx)} title={session["title"]} sessionId = {session["sessionId"]}selected={select} ></Session>
        })}
      </List>

    </Stack>

  );
}

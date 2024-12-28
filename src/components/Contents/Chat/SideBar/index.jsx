import { Stack } from '@mui/material';
import Header from './Header';
import Contact from './Contact';
import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import localforage from 'localforage';
import { useEffect, useState } from 'react';
import { ResetTvOutlined } from '@mui/icons-material';
import MessageUtil from '../../../../util/io_utils/MessageUtil';
import { useLocation } from 'react-router-dom';
import DatabaseManipulator from '../../../../util/io_utils/DatabaseManipulator';
import { useSelector } from 'react-redux';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function SideBar(props) {
  let { select, setSelect } = props
  const [userRecords, setUserRecords] = useState([])
  let location = useLocation()
  const refresh = useSelector((state) => state.refresh.value.refresh)
  console.log(refresh)
  useEffect(()=>{
    setSelect(location)
  },[location.type,location.userId])

  useEffect(() => {
    DatabaseManipulator.getRecentContact().then((res)=>{
      setUserRecords(res)
    })

  }, [refresh])

  //let [listItem,setListItem] = useState([])
  let onClick = (idx) => {
    return () => {
      let mid = userRecords[idx]
      //setUserRecords([mid, ...userRecords.slice(0, idx), ...userRecords.slice(idx + 1)])
      //MessageUtil.getNewestMessages(mid.userId, setSelect)
      setSelect({ "userId": mid.userId, "type": mid.type })

    }
  }


  if (!userRecords || userRecords.length === 0) {
    return <Stack sx={{ width: "30%", boxShadow: 1, borderRadius: 2 }} spacing={2}>
      <List sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'scroll' }}>
        <div>making some friends first</div>
      </List>
    </Stack>

  }


  return (
    <Stack sx={{ width: "30%", boxShadow: 1, borderRadius: 2 }} spacing={2}>
      <List sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'scroll' }}>
        {userRecords.map((content, idx) => {
          console.log(idx)
          return <Contact onClick={onClick(idx)} content={content} selected={select} ></Contact>
        })}
      </List>

    </Stack>

  );
}

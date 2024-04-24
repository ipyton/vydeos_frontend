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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function SideBar(props) {
  //let a = [1,2,3,5,6,7,8,21,32,3,1,3,12,3,1,3,1,3,1,231,31,3,1,3,12,3,123,123,12,3]
  console.log(props)
  let { select, setSelect, userRecords, setUserRecords } = props
  const location = useLocation()
  console.log(select)
  useEffect(() => {
    if (location.state) {
      localforage.getItem(
        "recent_contacts"
      ).then(async res => {
        if (!res) res = []

        let cursor = location.state.userId

        if (!cursor) {
          console.log("this is visited without initialization")
          return
        }
        else {
          if (!res) return
          for (let i = 0; i < res.length; i++) {
            let ele = res[i]
            if (!ele || !ele.userId) {
              return
            }
            if (ele.userId === cursor) {
              // already in the friends list. then put it in the first order.
              res = [res[i], ...res.slice(0, i), ...res.slice(i + 1)]
              localforage.setItem("recent_contacts", res)
              setUserRecords(res)
              return
            }
          }
          // do not exist: add it to the first place.
          res=[{ "userId": location.state.userId, "name": location.state.name, "avatar": location.state.avatar, new: false }, ...res]
          // and add user empty chat records
          await localforage.setItem("send_to_" + cursor, [])
          await localforage.setItem("send_from_" + cursor, [])
          localforage.setItem("recent_contacts", res)
        }
        if (cursor) setSelect(cursor)
      })
    }

  }, [location])

  //let [listItem,setListItem] = useState([])
  let onClick = (idx) => {
    return () => {
      let mid = userRecords[idx]
      //setUserRecords([mid, ...userRecords.slice(0, idx), ...userRecords.slice(idx + 1)])
      MessageUtil.getNewestMessages(mid.userId, setSelect)
      //setSelect(mid.userId)
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

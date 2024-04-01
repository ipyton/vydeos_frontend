import { Stack } from '@mui/material';
import Header from './Header';
import Contact from './Contact';
import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import localforage from 'localforage';
import { useState } from 'react';
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default function SideBar() {
    let a = [1,2,3,5,6,7,8,21,32,3,1,3,12,3,1,3,1,3,1,231,31,3,1,3,12,3,123,123,12,3]
    let {listItem,setListItem} = useState([])
    localforage.getItem("chatlist").catch(()=>{

    }).then((result)=>{
        setListItem(result)
    })

    let onClick= (event, index)=> {
      return ()=>{
        let mid = listItem[index]
        mid["dark"] = true
        setListItem([mid, ...listItem.slice(0, index), ...listItem.slice(index + 1)])
      }
    }


    return (
        <Stack sx={{width:"30%", boxShadow:1,  borderRadius: 2}} spacing={2}>
            <List sx={{ width: '100%', bgcolor: 'background.paper',overflow:'scroll'}}>
            {a.map((content, idx)=>{return <Contact onClick={onClick(idx)} content={content} ></Contact>})}
            </List>

        </Stack>

    );
  }

import 'react-chat-elements/dist/main.css'

import { Stack } from '@mui/material';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import SingleMessage from './SingleMessage';
import { useRef } from 'react';
import { useEffect } from 'react';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  textAlign: 'right',
  color: theme.palette.text.secondary,
  flexGrow: 2,
}));

export default function (props) {
  // record list.
  let { setCurrentList, currentChatList, select } = props;

  const messagesEndRef = useRef(null)
  

  useEffect(()=> {
    if (!messagesEndRef || !messagesEndRef.current) return
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [currentChatList])
  
  if (!currentChatList || currentChatList.length === 0) {
    return <div>Start to chat</div>
  }


  return (
    <Stack sx={{ borderRadius: 2, overflow: 'scroll' }} >
      <div className="messagesWrapper" >
        {
          currentChatList.map((x, idx) => {
            return (<SingleMessage content={x["content"]} role={x["role"]} select = {select}></SingleMessage>)
          })
        }

      <div style={{ float: "left", clear: "both" }}
        ref={messagesEndRef} />

    </div>

    </Stack>
  );
}
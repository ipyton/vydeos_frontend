import 'react-chat-elements/dist/main.css'
import { MessageBox } from 'react-chat-elements'
import { useState } from 'react';
import { Stack } from '@mui/material';

export default function () {
  const [messages, setMessages] = useState([1,2,3,4,5,65,67,76,56,5])
  return (
    <Stack sx={{ borderRadius: 2,boxShadow:1, overflow:'scroll'}} >
          {
      messages.map(x=>{
			return (<div>
      <MessageBox
        position={'left'}
        type={'photo'}
        text={'react.svg'}
        data={{
          uri: 'https://facebook.github.io/react/img/logo.svg',
          status: {
            click: false,
            loading: 0,
          },
          height:90,
        }}
      /></div>)
		})
  }

    </Stack>



  );
}
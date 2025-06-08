import React, { useEffect } from "react"
import { InputBase, Stack } from "@mui/material"
import Header from "./Header"
import Message from "./MessageList"
import InputBox from "./InputBox"
import 'react-chat-elements/dist/main.css'

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';


const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	// padding: theme.spacing(1),
	textAlign: 'right',
	color: theme.palette.text.secondary,
	flexGrow: 2,
}));


export default function (props) {
	let messages = [{ from_nickName: "xxx", to_nickName: "xxx", content: "xxx", time: "xxx", position: "right", from_username: "", to_username: "", type: "" },]
	const {setCurrentList, currentChatList,select } = props


	if (!select) {
		return <div> Start/Select a conversation first!</div>
	}



	return (<Stack sx={{ width: "70%", boxShadow: 1 }}>

		<Header selected={select}></Header>
		<Message currentChatList={currentChatList} setCurrentList={setCurrentList} select={select}> </Message>
		<InputBox currentChatList={currentChatList} setCurrentList={setCurrentList} select={select}></InputBox>
	</Stack>)
}
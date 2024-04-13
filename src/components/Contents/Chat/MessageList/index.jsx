import React, { useEffect } from "react"
import { InputBase, Stack } from "@mui/material"
import Header from "./Header"
import Message from "./MessageList"
import InputBox from "./InputBox"
import 'react-chat-elements/dist/main.css'
import { MessageBox } from 'react-chat-elements'
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { Avatar, Fab, ListItemButton } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import localforage from "localforage"

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	// padding: theme.spacing(1),
	textAlign: 'right',
	color: theme.palette.text.secondary,
	flexGrow: 2,
  }));
  

export default function (props) {
	let messages = [{from_nickName:"xxx", to_nickName:"xxx", content:"xxx", time:"xxx", position:"right", from_username:"", to_username:"", type:""},]
	const {select, userRecords, setUserRecords, chatRecords, setChatRecords} = props
	if (!select) {
		return <div> Start/Select a conversation first!</div>
	}

	useEffect(()=>{
		let messageList = []
			localforage.getItem("send_to_" + select).then((sendto) => {
				localforage.getItem(select + "_records").then((sendFrom) => {
					messageList = [...sendto, ...sendFrom]
				})
			})
			messageList.sort((a,b) => {
				return a.sendTime - b.sendTime
			})
			setChatRecords(messageList)

	}, [select]) 


	
	return (<Stack sx={{width:"70%", boxShadow:1}}> 
	
		<Header></Header>
		<Message chatRecords={chatRecords}  ></Message>
		<InputBox chatRecords={chatRecords}  setChatRecords={setChatRecords} ></InputBox>
	</Stack>)
}
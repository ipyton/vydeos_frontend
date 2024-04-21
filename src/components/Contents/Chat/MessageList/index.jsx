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
import MessageUtil from "../../../../util/io_utils/MessageUtil"

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
	const { select } = props
	const [chatRecords, setChatRecords] = useState([])

	useEffect( () => {
		//MessageUtil.getNewestMessages(select)

		localforage.getItem("send_to_" + select).then(
			send_to => {
				localforage.getItem("send_from_" + select).then(
					async receive_from => {
						if (!send_to) {
							send_to = []
							await localforage.setItem("send_to_" + select, send_to)
						}
						if (!receive_from) {
							receive_from = []
							await localforage.setItem("send_from_" + select, receive_from)
						}
						let result = [...send_to, ...receive_from]
						//console.log(receive_from)
						console.log(result)
						result.sort((a, b) => {
							return a.sendTime - b.sendTime
						})
						setChatRecords(result)
						console.log(result)
					}
				)
			}
		)

	}, [select])

	if (!select) {
		return <div> Start/Select a conversation first!</div>
	}



	return (<Stack sx={{ width: "70%", boxShadow: 1 }}>

		<Header selected={select}></Header>
		<Message chatRecords={chatRecords}  select = {select}> </Message>
		<InputBox chatRecords={chatRecords} setChatRecords={setChatRecords} select={select}></InputBox>
	</Stack>)
}
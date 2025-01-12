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
import DatabaseManipulator from "../../../../util/io_utils/DatabaseManipulator"
import { useLocation } from "react-router-dom"
import { selectAll } from "@testing-library/user-event/dist/cjs/event/index.js"

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	// padding: theme.spacing(1),
	textAlign: 'right',
	color: theme.palette.text.secondary,
	flexGrow: 2,
}));


export default function (props) {
	const { select,setSelect } = props
	const [chatRecords, setChatRecords] = useState([])
	console.log(select)
	console.log("-=-=-========")
	console.log(chatRecords)
	let location = useLocation()
	console.log(location)
	useEffect(() => {
		if (!select || !select.type || !select.userId || select.type ===""|| select.userId === "") return
			DatabaseManipulator.getContactHistory(select.type, select.userId).then((res) => {
				setChatRecords(res)	
			})
		// MessageUtil.getMessageById(select.type, select.userId).then((res) => {
		// 	console.log("初始化")
		// 	DatabaseManipulator.getContactHistory(select.type, select.userId).then((res) => {
		// 		setChatRecords(res)	
		// 	})
		// })

	}, [select.type, select.userId])

	// useEffect(() => {
	// 	DatabaseManipulator.getContactHistory(select.type, select.userId).then((res) => {
	// 		setChatRecords(res)
	// 	})
	// }, [location.state.type, location.state.userId])

	if (!select) {
		return <div> Start/Select a conversation first!</div>
	}



	return (<Stack sx={{ width: "70%", boxShadow: 1 }}>

		<Header selected={select}></Header>
		<Message chatRecords={chatRecords} setChatRecords={setChatRecords} select={select}> </Message>
		<InputBox chatRecords={chatRecords} setChatRecords={setChatRecords} select={select}></InputBox>
	</Stack>)
}
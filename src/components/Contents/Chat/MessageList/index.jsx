import React from "react"
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

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	// padding: theme.spacing(1),
	textAlign: 'right',
	color: theme.palette.text.secondary,
	flexGrow: 2,
  }));
  

export default function () {

	return (<Stack sx={{width:"70%", boxShadow:1}}> 
	
		<Header></Header>
		<Message ></Message>
		<InputBox></InputBox>
	</Stack>)
}
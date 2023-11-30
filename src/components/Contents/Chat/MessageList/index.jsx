import React from "react"
import { InputBase, Stack } from "@mui/material"
import Header from "./Header"
import Message from "./Message"
import InputBox from "./InputBox"


export default function () {

	return (<Stack sx={{width:"70%",  borderRadius: 2,boxShadow:1, overflow:'scroll'}}> 
		<Header></Header>
		<Message></Message>
		<InputBox></InputBox>
	</Stack>)
}
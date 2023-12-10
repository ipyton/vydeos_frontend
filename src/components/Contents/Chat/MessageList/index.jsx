import React from "react"
import { InputBase, Stack } from "@mui/material"
import Header from "./Header"
import Message from "./Message"
import InputBox from "./InputBox"


export default function () {

	return (<Stack sx={{width:"70%", boxShadow:1}}> 
		<Header></Header>
		<Message></Message>
		<InputBox></InputBox>
	</Stack>)
}
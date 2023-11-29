import { useEffect, useState } from "react"
import Item from "./Item"
import Login  from "./Login"
import {Route, Routes, useNavigate, Navigate, redirect, BrowserRouter,} from 'react-router-dom'
import NotFound from "./NotFound"
import React from "react"
import SignUp from "./SignUp"
import { Snackbar } from "@mui/material"
import UserInfo from "./UserInfo"
import TextEditor from "./TextEditor"
import Videos from "./Videos"
import NetworkError from "./NetworkError"

export default function Contents(props) {
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message:"helloworld"
      });
      const { vertical, horizontal, open, message } = state;
    
      const handleClose = () => {
        setState({ ...state, open: false });
      };
    //state = {articles:[{id:1},{id:2},{id:3},], pagesize:5}
    return (
        <div>
            <div>
            <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login barState={state} setBarState={setState} status={props}/>}></Route>
                <Route path="/signup" element={<SignUp barState={state} setBarState={setState} status={props}/>}></Route>
                <Route path="/userinfo" element={<UserInfo barState={state} setBarState={setState} status={props}></UserInfo>}></Route>
                <Route path="/editor" element={<TextEditor barState={state} setBarState={setState} status={props}></TextEditor>}></Route>
                <Route path="/videos" element={<Videos barState={state} setBarState={setState} status={props}></Videos>}></Route>
                <Route path="/notfound" element={<NetworkError barState={state} setBarState={setState} status={props}></NetworkError>}></Route>
                <Route path="/" element={<Item barState={state} setBarState={setState} status={props}/>}></Route>
                <Route path="*" element={<NotFound barState={state} setBarState={setState} status={props}/>} ></Route>
            </Routes>
            </BrowserRouter>
            </div>
            <div>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                message={message}
                key={vertical + horizontal}
            />
            </div>
        </div>

    )
    
}
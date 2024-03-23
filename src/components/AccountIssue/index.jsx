import SignUp from "./SignUp";
import Forget from "./Forget";
import Login from "./Login";
import Box from '@mui/material/Box';
import NotFound from "../Errors/NotFoundError";
import {Route, Routes, useNavigate, Navigate, redirect, BrowserRouter,} from 'react-router-dom'



export default function(props) {
    return (
    <BrowserRouter>
        <Box sx={{ display: 'flex' }}>
        <Routes>
                <Route path="forget" element={<Forget />}></Route>
                <Route path="login" element={<Login login={props.loginState} setLogin={props.setLoginState} />}></Route>
                <Route path="signup" element={<SignUp loginState = {props.loginState} setLoginState={props.setLoginState} setBarState={props.setBarState}/>}></Route>
                <Route path="*" element={<NotFound/>} ></Route>
                
            </Routes>
        </Box>
    </BrowserRouter>)
}
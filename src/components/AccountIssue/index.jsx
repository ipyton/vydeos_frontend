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
                <Route path="/account/forget" element={<Forget />}></Route>
                <Route path="/account/login" element={<Login login={props.loginState} setLogin={props.setLoginState} />}></Route>
                <Route path="/account/signup" element={<SignUp loginState = {props.loginState} setLoginState={props.setLoginState}/>}></Route>
                <Route path="*" element={<NotFound/>} ></Route>
                
            </Routes>
        </Box>
    </BrowserRouter>)
}
import SignUp from "./SignUp";
import Forget from "./Forget";
import Login from "./Login";
import Box from '@mui/material/Box';
import NotFound from "../Errors/NotFoundError";
import {Route, Routes, useNavigate, Navigate, redirect, BrowserRouter,} from 'react-router-dom'
import Iridescence from "../../Animations/Iridescence/Iridescence"


export default function(props) {
    return (
    <BrowserRouter>
        <Box sx={{ display: 'flex', position: 'relative', width: '100vw', height: '100vh' }}>
                <Iridescence color={[1, 1, 1]} mouseReact={false} amplitude={0.1} speed={1.0}/>
        <Routes>
                <Route path="forget" element={<Forget />}></Route>
                <Route path="login" element={<Login login={props.loginState} setLogin={props.setLoginState} />}></Route>
                <Route path="signup" element={<SignUp loginState = {props.loginState} setLoginState={props.setLoginState} setBarState={props.setBarState}/>}></Route>
                <Route path="*" element={<Login login={props.loginState} setLogin={props.setLoginState} />} ></Route>
                
            </Routes>
        </Box>
    </BrowserRouter>)
}
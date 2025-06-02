import SignUp from "./SignUp";
import Forget from "./Forget";
import Login from "./Login";
import Box from '@mui/material/Box';
import NotFound from "../Errors/NotFoundError";
import {Route, Routes, useNavigate, Navigate, redirect, BrowserRouter,} from 'react-router-dom'
import Iridescence from "../../Animations/Iridescence/Iridescence"
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
function Copyright(props) {
  return (
    <Typography variant="body2" color="white" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function(props) {
    return (
        <BrowserRouter>
            <Box sx={{ 
                display: 'flex', 
                position: 'relative', 
                width: '100vw', 
                height: '100vh',
                overflow: 'hidden' // Prevent scrollbars from animation
            }}>
                {/* Background Animation - positioned absolutely to cover full viewport */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0 // Behind the forms
                }}>
                    <Iridescence color={[1, 1, 1]} mouseReact={false} amplitude={0.1} speed={1.0}/>
                </Box>
                
                {/* Forms Container - positioned absolutely to center over animation */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1, // Above the animation
                    pointerEvents: 'none' // Allow interaction to pass through to forms
                }}>
                    <Box sx={{
                        pointerEvents: 'auto', // Re-enable interaction for the forms
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Routes>
                            <Route path="forget" element={<Forget />}></Route>
                            <Route path="login" element={<Login login={props.loginState} setLogin={props.setLoginState} />}></Route>
                            <Route path="signup" element={<SignUp loginState={props.loginState} setLoginState={props.setLoginState} setBarState={props.setBarState}/>}></Route>
                            <Route path="*" element={<Login login={props.loginState} setLogin={props.setLoginState} />}></Route>
                        </Routes>

                    </Box>

                </Box>
            </Box>
        </BrowserRouter>
    )
}
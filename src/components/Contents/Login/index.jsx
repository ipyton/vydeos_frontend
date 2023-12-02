import * as React from 'react';
import {useState} from "react"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import {Navigate} from "react-router-dom";
import Qs from "qs"
import verifyTokens from "../../../util/ioUtil"
import NetworkError from '../NetworkError';
import IOUtil from '../../../util/ioUtil';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
      Chat Chat
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login(props) {
  const [selected, setSelected] = useState(false)
  const [networkErr, setNetworkErr] = useState(false)
  const {loginState, setLoginState} = props.status
  console.log(props)

  if (true === networkErr) {
    return <NetworkError></NetworkError>
  }

  const validate = (username, password) => {
    return true
  }

  if(loginState === true) {
    return <Navigate to="/" replace/>
  }
  else {
    if (localStorage.getItem("token") !== null){
      IOUtil.verifyTokens(localStorage.getItem("token")).catch(error => {
        if ("Network Error" ===  error.message) {
          props.setBarState({...props.barState, message:"network" + error, open:true})
          console.log("ssdfinsdfindsifndsikfjdsnikfds")
        }
        setNetworkErr(true)
      }).then(response=>{
          if (response) {
            console.log("login success")
            setLoginState(true)
          }
          else{
            localStorage.removeItem("token")            
          }
          setNetworkErr(false)
      })
    }
  }

  const handleSelection = (event) => { 
    setSelected(!selected)
  }

  const encryption = (password) => {
    return password;
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (validate(data.get("email"), data.get("password"))){
      axios({
        url:"http://localhost:8080/account/login", 
        method:'post',
        data:{email: data.get('email'),password: encryption(data.get('password')),remember:selected},
        transformRequest:[function (data) {
          // 对 data 进行任意转换处理
          return Qs.stringify(data)
      }],
    }).catch(error => {
      if ("Network Error" ===  error.message) {
        props.setBarState({...props.barState, message:"please login first" +error, open:true})
        setNetworkErr(true)
      }
      console.log("--------------------------")
    }).then(function(response) {
        let responseData = response.data
        console.log(responseData)
        if (responseData.code === -1) {
          console.log(responseData.message)
          props.setBarState({...props.barState, message:responseData.message, open:true})
        }
        else if(responseData.code === 1) {
          localStorage.setItem("token", responseData.message)
          setLoginState(true)
        }
        else {
          console.log(responseData.message)
          props.setBarState({...props.barState, message:responseData.message, open:true})
        }
        setNetworkErr(false)
      }).catch(function(error) {
        if ("Network Error" ===  error.message) {
          props.setBarState({...props.barState, message:"please login first" +error, open:true})
          setNetworkErr(true)
        }
        else {

        }
      })
    }
    else {
      props.setBarState({...props.barState, message:"please check your input", open:true})
    }
  };


  return (
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox onClick={handleSelection} value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" replace="true"variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    );
}
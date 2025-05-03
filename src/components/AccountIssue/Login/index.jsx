import * as React from 'react';
import { useState } from "react"
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
import { Navigate } from "react-router-dom";
import NetworkError from '../../Errors/NetworkError';
import AccountUtil from '../../../util/io_utils/AccountUtil';
import { useNotification } from '../../../Providers/NotificationProvider';
import localforage from 'localforage';

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
  const { showNotification } = useNotification();

  const { login, setLogin } = props

  if (true === networkErr) {
    return <NetworkError></NetworkError>
  }

  const validate = (username, password) => {
    return true
  }
  if (true === login) {
    return <Navigate to="/" replace />
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
    data["remember"] = selected
    console.log(data)
    if (validate(data.get("email"), data.get("password"))) {
      AccountUtil.login(data).then(function (response) {
        console.log(response)
        if (response === undefined || response.data === undefined) {
          console.log("error")
          return
        }
        let responseData = response.data
        if (responseData.code === -1) {
          showNotification(responseData.message, "error");
        }
        else if (responseData.code === 1) {
          localStorage.setItem("token", responseData.message)
          localStorage.setItem("userId", data.get("email"))
          localforage.setItem("userId", data.get("email")).then( async ()=> {
            const userInfoResponse = await AccountUtil.getOwnerInfo();
            console.log("User Info Response: ")
            console.log(localStorage.getItem("token"))
            console.log(userInfoResponse)
            
            if (userInfoResponse && userInfoResponse.data && userInfoResponse.data.code !== -1) {
              const content = JSON.parse(userInfoResponse.data.message);
              localStorage.setItem("userInfo", JSON.stringify(content));
              setLogin(true)
            }
            }
          )
  
        }
        else {
          showNotification(responseData.message, "error");
        }
        //setNetworkErr(false)
      })

      // .catch(function(error) {
      //   if ("Network Error" ===  error.message) {
      //     props.setBarState({...props.barState, message:"please login first" + error, open:true})
      //     setNetworkErr(true)
      //   }
      //   else {

      //   }
      // })
    }
    else {
      //props.setBarState({...props.barState, message:"please check your input", open:true})
      showNotification("Wrong password or email", "error");
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
                variant="filled"

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
              label="Remember me for 30 days"
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
                <Link href="/forget" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" replace="true" variant="body2">
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
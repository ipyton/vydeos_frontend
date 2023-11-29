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
import Qs from 'qs'
import { Navigate } from 'react-router-dom';
import SimplePictureUtil from '../../../util/SimplePictureUtil';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  const defaultTheme = createTheme();

export default function UserInfo(props) {
    
  const [receive, setReceive] = useState(false)
  const [selected, setSelected] = useState(false) 
  const {loginState, setLoginState} = props.status
  console.log(loginState)
  if (true === loginState) {
    return <Navigate to="/" replace/>
  }
  const validate =(nickname,username, password)=>{
    return true
  }

  function encryption(password) {
    return password;
  }

  const handleReceive = (event)=>{
    setReceive(!receive)
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
      if(!validate(data.get('nickname'),data.get('username'), data.get('password'))) {
        props.setBarState({...props.barState, message:"please check your input", open:true})
      }
      else {
        console.log({
          email: data.get('email'),
          password: data.get('password'),
          nickname: data.get('nickname'),
          recv: receive
        });
        axios({
          url:"http://localhost:8080/account/getinfo", 
          method:'post',
          data:{userEmail: data.get('email'),password: encryption(data.get('password')),userName:data.get("nickname"),promotion:selected},
          transformRequest:[function (data) {
            // 对 data 进行任意转换处理
            return Qs.stringify(data)
        }],
      }).then(
        (response)=>{
          console.log("response");
          if(response.code === 1)
          {
            
          }
          else {

          }
        }
      ).catch((err)=>{
        console.log("check your input")
      })
      }
  };
    let getAvatar = () => {
        if (null === localStorage.getItem("avatar")) {
            return <Avatar sx={{ bgcolor: deepOrange[500] }}>N</Avatar>
        }
        return <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />

    }

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
                {getAvatar()}
              <Typography component="h1" variant="h5">
              User Information
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} >
                    <TextField
                      autoComplete="nickname"
                      name="nickname"
                      required
                      fullWidth
                      id="nickname"
                      label="nickname"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="self-intro"
                      label="self-intro"
                      type="self-intro"
                      id="self-intro"
                    />
                  </Grid>
                  <Grid item xs={12}>
                  <DatePicker />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox onClick={handleReceive} value="allowExtraEmails" color="primary" />}
                      label="I want to receive inspiration, marketing promotions and updates via email."
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                    Update
                </Button>
              </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Container>
        </ThemeProvider>
      );
}
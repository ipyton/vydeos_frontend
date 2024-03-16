import * as React from 'react';
import {useState} from "react";

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
import { Navigate, useNavigate } from 'react-router-dom';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Stack } from '@mui/material';

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

export default function SignUp(props) {
  const [skipped, setSkipped] = React.useState(new Set());
  const [receive, setReceive] = useState(false)
  const [selected, setSelected] = useState(false) 
  let [activeStep, setActiveStep] = useState(0);
  let navigate = useNavigate()
  const {loginState, setLoginState} = props

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
    setActiveStep(activeStep + 1)
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
          url:"http://localhost:8080/account/register", 
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
            setActiveStep(activeStep + 1)
          }
          else {

          }
        }
      ).catch((err)=>{
        console.log("check your input")
      })
      }
  };
  const checkValidationCode = () => {
    setActiveStep(activeStep + 1)
  }
  const isStepOptional = (step) => {
    return false;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const jumpToLoginPage = () => {
    navigate("account/login")
  }
  const steps = [
    'Input Essential Data',
    'Validate',
    'Input Optional Data',
    'Done',
  ];
  let stepComponent = (<div>something must went wrong!!</div>)

  if (activeStep == 0) {
    stepComponent = (
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  autoComplete="given-name"
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
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
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
              Next Step
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/account/login" replace="true" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>)
  } else if (activeStep == 1) {
    stepComponent = (<Stack spacing={3} sx={{marginTop:"20%"}}>


<Typography variant="body1" gutterBottom>
We have sent an email in your box.
        Please Enter 6 digits numbers here
      </Typography>
        <TextField
          required
          id="outlined-required"
          label="6 digits"
        />
        <Button
              onClick={checkValidationCode}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >Next Step</Button>
    </Stack>)
  } else if (activeStep == 2) {
    stepComponent = (

    <Stack spacing={3} sx={{marginTop:"20%"}} >
            <Typography variant="body1" gutterBottom>
      Last Step:Some optional information needed!
      </Typography>
        <TextField
          required
          id="outlined-required"
          label="Location"

        />
        <TextField
          required
          id="outlined-required"
          label="Age"

        />
        <TextField
          required
          id="outlined-required"
          label="Nickname"
        />
      <Button
            onClick={checkValidationCode}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >Next Step</Button>


    </Stack>)
  } else if (activeStep == 3) {
    stepComponent = (
      <Stack spacing={3} sx={{marginTop:"20%"}}>
        <Typography variant="body1" gutterBottom>
        Successful, Now you can login!
        </Typography>
        <Button
              onClick={jumpToLoginPage}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >Go to login page</Button>
      </Stack>)
  }



  return (<Box sx={{ width: '60%', marginLeft:"20%", marginTop:"5%"}}>
  <Stepper activeStep={activeStep}>
    {steps.map((label, index) => {
      const stepProps = {};
      const labelProps = {};
      if (isStepOptional(index)) {
        labelProps.optional = (
          <Typography variant="caption">Optional</Typography>
        );
      }
      if (isStepSkipped(index)) {
        stepProps.completed = false;
      }
      return (
        <Step key={label} {...stepProps}>
          <StepLabel {...labelProps}>{label}</StepLabel>
        </Step>
      );
    })}
  </Stepper>
  {stepComponent}
</Box>)


}
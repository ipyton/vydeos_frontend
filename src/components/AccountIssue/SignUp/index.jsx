import * as React from 'react';
import { useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate, useNavigate } from 'react-router-dom';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Stack } from '@mui/material';
import AccountUtil from '../../../util/io_utils/AccountUtil';
import { useEffect } from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';

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
  const [skipped, setSkipped] = useState(new Set());
  const [receive, setReceive] = useState(false)
  const [selected, setSelected] = useState(false)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [validatepw, setValidatepw] = useState("")
  let [activeStep, setActiveStep] = useState(0);
  let navigate = useNavigate()
  const [barState, setBarState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: ""
  });
  const { vertical, horizontal, open,message } = barState;

  const { loginState, setLoginState } = props
  const [transactionNumber, setTransactionNumber] = useState("000000")
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      // Custom logic to handle the refresh
      // Display a confirmation message or perform necessary actions
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);


  if (true === loginState) {
    return <Navigate to="/" replace />
  }
  const validate = (nickname, username, password) => {
    return true
  }

  const handleReceive = (event) => {
    setReceive(!receive)
  }
  const handleSubmit = (event) => {
    const data = new FormData(event.currentTarget);
    console.log(data)
    setActiveStep(1)
    if (!validate(data.get('nickname'), data.get('username'), data.get('password')), data.get('selected')) {
      // props.setBarState({...props.barState, message:"please check your input", open:true})
      console.log("error!!")
    }
    else {
      console.log({
        email: data.get('email'),
        password: data.get('password'),
        nickname: data.get('nickname'),
        recv: receive
      });

      AccountUtil.registerStep1(data, activeStep, setActiveStep, setBarState, setTransactionNumber)
    }
  };

  const step1 = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    console.log(data.get("email"))
    AccountUtil.registerStep1(activeStep, setActiveStep, data.get("email"))
  }
  const step2 = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    AccountUtil.registerStep2(activeStep, setActiveStep, data.get("digits"))
    setActiveStep(activeStep + 1)
  }
  const step3 = (event) => {
    event.preventDefault()
    if (password == validatepw) {
      AccountUtil.registerStep3(activeStep, setActiveStep, password, email,barState, setBarState)
    }
    else return
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setBarState({...barState, open:false});
  };
  const handlePasswordChange = (event) => {
    setPassword(event.currentTarget.value)
  }

  const handlePasswordValidateChange = (event) => {
    setValidatepw(event.currentTarget.value)
  }

  const isStepOptional = (step) => {
    return false;
  };

  const previousStep = () => {
    setActiveStep(activeStep - 1)
  }

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const jumpToLoginPage = () => {
    navigate("account/login")
  }
  const steps = [
    'Input Email',
    'Validate',
    'Input Password',
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
            <Box component="form" noValidate onSubmit={step1} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={(event)=>{
                      setEmail(event.target.value)
                    }}
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
    stepComponent = (
      <Stack spacing={3} sx={{ marginTop: "20%" }}>
        <Typography variant="body1" gutterBottom>
          We have sent an email in your box.
          Please Enter 6 digits numbers here
        </Typography>
        <Box component="form" noValidate onSubmit={step2} sx={{ mt: 3 }}>
        <TextField
          required
          id="outlined-required"
          label="6 digits"
          name="digits"
        />
        <Stack direction="row" spacing={2}>
          <Button
            onClick={previousStep}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >Previous Step</Button>
          <Button
            type='submit'
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >Next Step</Button>

          </Stack>
          </Box>
      </Stack>)
  } else if (activeStep == 2) {
    stepComponent = (

      <Stack spacing={3} sx={{ marginTop: "20%" }} >
        <Typography variant="body1" gutterBottom>
          Last Step:Some optional information needed!
        </Typography>
        <Box component="form" noValidate onSubmit={step3} sx={{ mt: 3 }}>

        <TextField
          required
          id="outlined-required"
          label="Password"
          name='password'
          type="password"
            onChange={handlePasswordChange}
        />
        <TextField
          required
          id="outlined-required"
          label="Retype Password"
          type='password'
            onChange={handlePasswordValidateChange}
        />
        <Stack direction="row" spacing={2}>

          <Button
            type='submit'
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >Next Step</Button>
        

        </Stack>
        </Box>



      </Stack>)
  } else if (activeStep == 3) {
    stepComponent = (
      <Stack spacing={3} sx={{ marginTop: "20%" }}>
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



  return (<Box sx={{ width: '60%', marginLeft: "20%", marginTop: "5%" }}>
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      message={message}
      key={vertical + horizontal}
      autoHideDuration={5000}
      onClose={handleClose}

    />

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
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Navigate, useNavigate } from 'react-router-dom'


import { useEffect } from 'react';


export default function HorizontalLinearStepper() {
  const steps = ['Input Details', 'Validate', "New Password", 'Success'];
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
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


  let stepComponent = <div>must be something wrong</div>
  let navigation = useNavigate()
  const isStepOptional = (step) => {
    return false;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const returnToMenu = () => {
    navigation("/login")

  }

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const returnToLogin = () => {
    navigation("/login")
  };

  if (activeStep == 0) {
    stepComponent = (
      <React.Fragment>
        <Typography sx={{ mt: 2, mb: 1 }}>Input Your Email</Typography>
        <TextField
          required
          id="outlined-required"
          label="Email"
        />
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            //disabled={activeStep === 0}
            onClick={returnToMenu}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )}

          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </React.Fragment>)
  }
  else if (activeStep == 1) {
    stepComponent = (
      <React.Fragment>
        <Typography sx={{ mt: 2, mb: 1 }}>We have sent the email to your mail box. Enter the code you received.</Typography>
        <TextField
          required
          id="outlined-required"
          label="6 digits Code"
        />
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )}

          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </React.Fragment>
    )
  }
  else if (activeStep == 2) {
    stepComponent = (
      <React.Fragment>

        <Stack sx={{}}>
          <Typography sx={{ mt: 2, mb: 1 }}>Please enter your new password.</Typography>
          <TextField
            required
            id="outlined-required"
            label="Enter Your New Password."
            type='password'
          />
          <TextField
            required
            id="outlined-required"
            label="Enter It Again."
            type='password'
          />
        </Stack>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Box sx={{ flex: '1 1 auto' }} />
          {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )}

          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </React.Fragment>
    )
  }
  else if (activeStep == 3) {
    stepComponent = (
      <React.Fragment>
        <Typography sx={{ mt: 2, mb: 1 }}>
          You have change your password Successfully!
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={returnToLogin}>BackToLogin</Button>
        </Box>
      </React.Fragment>
    )
  }

  return (
    <Box sx={{ width: '60%', marginLeft: "20%", marginTop: "5%" }}>
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
    </Box>
  );
}
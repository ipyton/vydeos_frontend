import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import {
  Lock,
  Home,
  ArrowBack,
  ContactSupport
} from '@mui/icons-material';

const NoPermissionPage = () => {
  const theme = useTheme();

  const handleGoHome = () => {
    // In a real app, you'd use router navigation
    console.log('Navigate to home');
  };

  const handleGoBack = () => {
    // In a real app, you'd use router navigation or window.history.back()
    console.log('Navigate back');
  };

  const handleContactSupport = () => {
    // In a real app, you'd navigate to support or open a contact form
    console.log('Contact support');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.error.light, 0.1)} 0%, ${alpha(theme.palette.warning.light, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
          }}
        >
          <Stack spacing={4} alignItems="center">
            {/* Icon */}
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.2)} 100%)`,
                border: `2px solid ${alpha(theme.palette.error.main, 0.3)}`
              }}
            >
              <Lock
                sx={{
                  fontSize: 60,
                  color: theme.palette.error.main
                }}
              />
            </Box>

            {/* Error Code */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                color: theme.palette.error.main,
                fontSize: { xs: '3rem', sm: '4rem' },
                lineHeight: 1
              }}
            >
              403
            </Typography>

            {/* Main Message */}
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1
              }}
            >
              Access Denied
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 500,
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}
            >
              You don't have permission to access this page. This could be because you need special authorization or your current role doesn't include access to this resource.
            </Typography>

            {/* Action Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mt: 4, width: '100%', maxWidth: 400 }}
            >
              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={handleGoHome}
                sx={{
                  py: 1.5,
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                Go Home
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleGoBack}
                sx={{
                  py: 1.5,
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                Go Back
              </Button>
            </Stack>

            {/* Support Link */}
            <Button
              variant="text"
              startIcon={<ContactSupport />}
              onClick={handleContactSupport}
              sx={{
                mt: 2,
                textTransform: 'none',
                fontSize: '0.95rem',
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: 'transparent'
                }
              }}
            >
              Need help? Contact Support
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};

export default NoPermissionPage;
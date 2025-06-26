import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Import Iridescence with no SSR to avoid OGL issues
const Iridescence = dynamic(
  () => import('../Animations/Iridescence/Iridescence'),
  { ssr: false }
);

// Dynamically import the login components
const SignUp = dynamic(() => import('./SignUp'));
const Forget = dynamic(() => import('./Forget'));
const Login = dynamic(() => import('./Login'));

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

export default function AccountIssue(props) {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('login');
  
  // Determine which component to show based on the path
  useEffect(() => {
    // Extract the path from the URL
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.split('/').pop() || 'login';
      setCurrentPath(path);
      
      // Handle redirects within the login flow
      if (path !== 'login' && path !== 'signup' && path !== 'forget') {
        setCurrentPath('login');
      }
    }
  }, [router.asPath]);

  // Render the appropriate component based on the path
  const renderAuthComponent = () => {
    switch (currentPath) {
      case 'signup':
        return <SignUp loginState={props.loginState} setLogin={props.setLoginState} setBarState={props.setBarState} />;
      case 'forget':
        return <Forget />;
      default:
        return <Login login={props.loginState} setLogin={props.setLoginState} />;
    }
  };

  return (
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
          {renderAuthComponent()}
        </Box>
      </Box>
    </Box>
  );
} 
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Iridescence from '../../../Animations/Iridescence/Iridescence';
import { useThemeMode } from '../../../Themes/ThemeContext';

export default function AuthLayout() {
  const { mode } = useThemeMode();
  
  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: mode === 'dark' ? '#000000' : '#ffffff',
      }}
    >
      {/* Background Animation */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      >
        <Iridescence 
          color={mode === 'dark' ? [0.3, 0.4, 0.6] : [1, 1, 1]} 
          mouseReact={true} 
          amplitude={0.15} 
          speed={0.8} 
        />
      </Box>

      {/* Outlet for the real forms */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        <Box
          sx={{
            pointerEvents: 'auto',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* This is where your nested routes (login/signup/etc) will render */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

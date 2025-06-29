import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Iridescence from '../../../Animations/Iridescence/Iridescence';

export default function AuthLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
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
        <Iridescence color={[1,1,1]} mouseReact={false} amplitude={0.1} speed={1.0} />
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

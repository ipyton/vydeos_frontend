import { createTheme } from '@mui/material/styles';

export const getAccountTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? 'rgba(142,142,142,0.35)' : '#1976d2',
        light: mode === 'dark' ? 'rgba(129,129,131,0.2)' : '#42a5f5',
        dark: mode === 'dark' ? 'rgba(142,142,142,0.5)' : '#1565c0',
      },
      secondary: {
        main: '#f50057',
        light: '#ff5983',
        dark: '#bb002f',
      },
      background: {
        default: mode === 'dark' ? '#000000' : '#ffffff',
        paper: mode === 'dark' ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#000000',
        secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      },
    },
    typography: {
      fontFamily: [
        'Poppins',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
          },
          containedPrimary: {
            backgroundColor: mode === 'dark' ? 'rgba(142,142,142,0.35)' : '#1976d2',
            color: mode === 'dark' ? '#ffffff' : '#ffffff',
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(142,142,142,0.5)' : '#1565c0',
              boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            marginBottom: '16px',
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              color: mode === 'dark' ? '#ffffff' : 'inherit',
            },
            '& .MuiInputLabel-root': {
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'dark' ? 'rgba(142,142,142,0.35)' : '#1976d2',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: mode === 'dark' ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: mode === 'dark'
              ? '0 15px 35px rgba(0, 0, 0, 0.3), 0 5px 15px rgba(0, 0, 0, 0.2)'
              : '0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07)',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
            backgroundColor: mode === 'dark' ? 'rgba(142,142,142,0.35)' : '#1976d2',
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#1976d2',
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? 'rgba(142,142,142,0.8)' : '#1976d2',
            '&:hover': {
              color: mode === 'dark' ? '#ffffff' : '#1565c0',
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
          },
        },
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            '&.Mui-active': {
              color: mode === 'dark' ? 'rgba(142,142,142,0.8)' : '#1976d2',
            },
            '&.Mui-completed': {
              color: mode === 'dark' ? 'rgba(142,142,142,0.6)' : '#1976d2',
            },
          },
        },
      },
    },
  });
}; 
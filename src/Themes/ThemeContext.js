// ThemeContext.js
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');
  
  // 从 localStorage 读取模式
  useEffect(() => {
    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'light' || savedMode === 'dark') {
      setMode(savedMode);
    }
  }, []);
  
  // 每次模式变更时保存到 localStorage
  useEffect(() => {
    localStorage.setItem('mode', mode);
  }, [mode]);
  
  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: mode === 'dark' ? 'rgba(142,142,142,0.35)' : '#1976d2',
          light: mode === 'dark' ? 'rgba(129,129,131,0.2)' : '#42a5f5',
        },
        secondary: {
          main: '#f50057',
        },
        background: {
          default: mode === 'dark' ? '#000000' : '#ffffff',
          paper: mode === 'dark' ? 'rgba(0,0,0,0.6)' : '#ffffff',
        },
        text: {
          primary: mode === 'dark' ? '#ffffff' : '#000000',
          secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        },
      },
      shape: {
        borderRadius: 20,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: mode === 'dark' ? '#000000' : '#ffffff',
              color: mode === 'dark' ? '#ffffff' : '#000000',
            },
          },
        },
        // Add overrides for accordion components
        MuiAccordion: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.6)' : '#ffffff',
              color: mode === 'dark' ? '#ffffff' : '#000000',
              '&.Mui-expanded': {
                margin: 0,
              },
            },
          },
        },
        MuiAccordionSummary: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.8)' : '#f5f5f5',
              '& .MuiTypography-root': {
                color: mode === 'dark' ? '#ffffff' : '#000000',
              },
              '& .MuiSvgIcon-root': {
                color: mode === 'dark' ? '#ffffff' : 'inherit',
              },
            },
          },
        },
        MuiAccordionDetails: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.6)' : '#ffffff',
              padding: '16px',
            },
          },
        },
        // Add overrides for dialog components
        MuiDialog: {
          styleOverrides: {
            paper: {
              backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.8)' : '#ffffff',
              color: mode === 'dark' ? '#ffffff' : '#000000',
            },
          },
        },
        MuiDialogTitle: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.8)' : '#ffffff',
              color: mode === 'dark' ? '#ffffff' : '#000000',
            },
          },
        },
        MuiDialogContent: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.8)' : '#ffffff',
              color: mode === 'dark' ? '#ffffff' : '#000000',
            },
          },
        },
        // Add overrides for TextField components
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiInputBase-root': {
                color: mode === 'dark' ? '#ffffff' : 'inherit',
              },
              '& .MuiInputLabel-root': {
                color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: mode === 'dark' ? 'rgba(142,142,142,0.35)' : '#1976d2',
                },
              },
              '& .MuiFilledInput-root': {
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.06)',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.13)' : 'rgba(0, 0, 0, 0.09)',
                },
                '&.Mui-focused': {
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.06)',
                },
              },
            },
          },
        },
        // Add overrides for Lists
        MuiList: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.6)' : '#ffffff',
              color: mode === 'dark' ? '#ffffff' : '#000000',
            },
          },
        },
        // Add overrides for Chips
        MuiChip: {
          styleOverrides: {
            root: {
              color: mode === 'dark' ? '#ffffff' : 'inherit',
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
            },
            deleteIcon: {
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              '&:hover': {
                color: mode === 'dark' ? '#ffffff' : '#000000',
              },
            },
          },
        },
        // Add overrides for Buttons
        MuiButton: {
          styleOverrides: {
            root: {
              color: mode === 'dark' ? '#ffffff' : 'inherit',
            },
            contained: {
              backgroundColor: mode === 'dark' ? 'rgba(142,142,142,0.35)' : '#1976d2',
              color: mode === 'dark' ? '#ffffff' : '#ffffff',
              '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(142,142,142,0.5)' : '#1565c0',
              },
            },
          },
        },
      },
    });
  }, [mode]);
  
  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
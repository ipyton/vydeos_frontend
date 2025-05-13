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

// ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a context for theme
const ThemeContext = createContext();

// Theme configuration
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#bb002f',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#c3fdff',
      dark: '#5d99c6',
    },
    secondary: {
      main: '#ff80ab',
      light: '#ffb2dd',
      dark: '#c94f7c',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

// Provider component
export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState('light');
  const theme = mode === 'dark' ? darkTheme : lightTheme;
  
  // Check for saved theme preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode');
      if (savedMode) {
        setMode(savedMode);
      } else {
        // Check for system preference
        const prefersDark = window.matchMedia && 
          window.matchMedia('(prefers-color-scheme: dark)').matches;
        setMode(prefersDark ? 'dark' : 'light');
      }
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', newMode);
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

// Custom hook for using the theme context
export function useThemeMode() {
  return useContext(ThemeContext);
} 
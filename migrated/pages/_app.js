import React, { useEffect, useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import localforage from 'localforage';
import { StrictMode } from 'react';
import '../styles/globals.css';
import store from '../components/redux/store';
import { NotificationProvider } from '../contexts/NotificationProvider';
import { SearchProvider } from '../contexts/SearchProvider';
import { ThemeContextProvider } from '../contexts/ThemeContext';
import NetworkError from '../components/Errors/NetworkError';
import EndpointNotAvailableError from '../components/Errors/EndpointNotAvailableError';
import AccountIssue from '../components/AccountIssue';
import { login, logout } from '../components/redux/authSlice';
import AuthUtil from '../utils/AuthUtil';
import { clearAllData } from '../utils/StorageManager';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';
import Head from 'next/head';

// Client-side cache, shared for the whole session of the user in the browser
const clientSideEmotionCache = createEmotionCache();

// Theme configuration
const theme = createTheme({
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
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

// Wrapper component to handle auth check
function AuthWrapper({ Component, pageProps }) {
  const dispatch = useDispatch();
  const { isAuthenticated, showLoginModal } = useSelector(state => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [endpointError, setEndpointError] = useState(false);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;

    // Check network status
    if (!navigator.onLine) {
      setNetworkError(true);
      return;
    }

    // Check endpoint status (customize as needed)
    const checkEndpoint = async () => {
      try {
        // Add your endpoint check here
        return true;
      } catch (error) {
        return false;
      }
    };

    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedLoginState = localStorage.getItem('isLoggedIn');
      const userId = localStorage.getItem('userId');

      if (token && storedLoginState === 'true' && userId) {
        // Restore login state from localStorage
        dispatch(login({
          token: token,
          user: { userId: userId },
        }));

        localforage.getItem("paths").then(res => {
          if (res === null) {
            AuthUtil.getPaths().then(
              (response1) => {
                if (response1.data.code === 0) {
                  localforage.setItem("paths", JSON.parse(response1.data.message))
                }
              }
            );
          }
        });

        // Also set in localforage for consistency
        await localforage.setItem("userId", userId);
      } else {
        // Clean up any inconsistent state
        clearAllData();
        dispatch(logout());
      }

      const endpointStatus = await checkEndpoint();
      setEndpointError(!endpointStatus);
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch]);

  // Show loading while initializing
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (networkError) {
    return <NetworkError />;
  }

  if (endpointError) {
    return <EndpointNotAvailableError />;
  }

  // Show login modal or account issue page when not authenticated
  if (!isAuthenticated || showLoginModal) {
    return (
      <StrictMode>
        <AccountIssue
          loginState={isAuthenticated}
          setLoginState={(newState) => {
            if (newState) {
              // Don't dispatch login here - let the login success handler do it
            } else {
              clearAllData();
              dispatch(logout());
            }
          }}
        />
      </StrictMode>
    );
  }

  // Show main app when authenticated
  return (
    <ThemeContextProvider>
      <Component 
        {...pageProps} 
        setLogin={async (newState) => {
          if (newState) {
            // Login success should be handled by the login action
          } else {
            // Logout
            clearAllData();
            dispatch(logout());
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("isLoggedIn");
            await localforage.removeItem("userId");
          }
        }}
      />
    </ThemeContextProvider>
  );
}

// Top level App component
function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <title>Next.js Blog</title>
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <SearchProvider>
            <NotificationProvider>
              <AuthWrapper Component={Component} pageProps={pageProps} />
            </NotificationProvider>
          </SearchProvider>
        </ThemeProvider>
      </Provider>
    </CacheProvider>
  );
}

export default MyApp; 
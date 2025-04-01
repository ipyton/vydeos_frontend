import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Contents from './components/Contents';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Footer from './components/Footer';
import IOUtil from './util/ioUtil';
import PictureUtil from './util/io_utils/FileUtil';
import NetworkError from './components/Errors/NetworkError';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './components/AccountIssue/Login';
import EndpointNotAvailableError from './components/Errors/EndpointNotAvailableError';
import AccountIssue from './components/AccountIssue';
import AccountUtil from './util/io_utils/AccountUtil';
import localforage from 'localforage';
import { StrictMode } from 'react';
import { NotificationProvider } from './Providers/NotificationProvider';

const defaultTheme = createTheme();

function checkNetworkStatus() {
  return navigator.onLine;
}

function checkEndpointStatus() {
  return true;
}

function App() {
  const [login, setLogin] = useState(() => {
    // Initialize login state from localStorage to persist across refreshes
    const storedLoginState = localStorage.getItem('isLoggedIn');
    return storedLoginState === 'true';
  });
  const [avatar, setAvatar] = useState(null);
  const [badgeContent, setBadgeContent] = useState([]);
  const [networkStatus, setNetworkStatus] = useState(false);

  useEffect(() => {
    // Verify tokens only if not already logged in
    if (!login) {
      AccountUtil.verifyTokens((isAuthenticated) => {
        setLogin(isAuthenticated);
        // Update localStorage with the login state
        localStorage.setItem('isLoggedIn', isAuthenticated.toString());
      });
    }
  }, []); // Empty dependency array ensures this runs only once

  if (checkNetworkStatus() === false) {
    return <NetworkError />;
  }

  if (checkEndpointStatus() === false) {
    return <EndpointNotAvailableError />;
  }

  if (login === false) {
    return (
      <StrictMode>
        <AccountIssue 
          loginState={login} 
          setLoginState={(newState) => {
            setLogin(newState);
            localStorage.setItem('isLoggedIn', newState.toString());
          }} 
        />
      </StrictMode>
    );
  }

  if (login === true) {
    return (
      <BrowserRouter>
        <Contents 
          setLogin={async (newState) => {
            setLogin(newState);
            localStorage.setItem('isLoggedIn', newState.toString());

            
          }} 
        />
      </BrowserRouter>
    );
  }

  return <div>loading</div>;
}

export default App;
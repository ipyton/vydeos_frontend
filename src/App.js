import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Contents from './components/Contents';

import NetworkError from './components/Errors/NetworkError';
import EndpointNotAvailableError from './components/Errors/EndpointNotAvailableError';
import AccountIssue from './components/AccountIssue';
import AccountUtil from './util/io_utils/AccountUtil';
import localforage from 'localforage';
import { StrictMode } from 'react';
import { useNotification } from './Providers/NotificationProvider';

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
  const { showNotification } = useNotification();

  useEffect(() => {
    // Verify tokens only if not already logged in
    if (localStorage.getItem("token") === null) {
      return
    }
      AccountUtil.verifyTokens((isAuthenticated) => {
        setLogin(isAuthenticated);
        // Update localStorage with the login state
        localStorage.setItem('isLoggedIn', isAuthenticated.toString());
      }).then(
            async response => {
              if (response === undefined || response.data === undefined) {
                console.log("login error")
                showNotification("Login error", "error");                
                return
              }
              let responseData = response.data
              if (responseData.code === 1) {
                await localforage.setItem("userId", response.data.message)

                setLogin(true)
              } else {
                showNotification(responseData.message, "error");
                setLogin(false)
              }

            }
          )}, []); // Empty dependency array ensures this runs only once

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
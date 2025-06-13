import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Contents from './components/Contents';
import NetworkError from './components/Errors/NetworkError';
import EndpointNotAvailableError from './components/Errors/EndpointNotAvailableError';
import AccountIssue from './components/AccountIssue';
import localforage from 'localforage';
import { StrictMode } from 'react';
import { useNotification } from './Providers/NotificationProvider';
import { ThemeContextProvider } from './Themes/ThemeContext';
import { login, logout } from './components/redux/authSlice'; // Adjust path to your auth slice
import AuthUtil from './util/io_utils/AuthUtil';
import { clearAllData } from './util/io_utils/StorageManager';
function checkNetworkStatus() {
  return navigator.onLine;
}

function checkEndpointStatus() {
  return true;
}

function App() {
  // Redux state
  const dispatch = useDispatch();
  const { isAuthenticated, showLoginModal } = useSelector(state => state.auth);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check localStorage for existing token and login state on app initialization
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedLoginState = localStorage.getItem('isLoggedIn');
      const userId = localStorage.getItem('userId');

      if (token && storedLoginState === 'true' && userId) {
        // Restore login state from localStorage
        dispatch(login({
          token: token,
          user: { userId: userId }, // Add any other user data you have
        }));
        localforage.getItem("paths").then(res => {
          if (res === null) {
            AuthUtil.getPaths().then(
              (response1) => {
                if (response1.data.code === 0) {
                  localforage.setItem("paths", JSON.parse(response1.data.message))
                }
              }
            )
          }

        })

        // Also set in localforage for consistency
        await localforage.setItem("userId", userId);
      } else {
        // Clean up any inconsistent state
        
        clearAllData()

        
        dispatch(logout());
      // setTimeout(() => {
      //   window.location.reload();
      // }, 500);
      }


      setIsInitialized(true);
    };

    initializeAuth();
  }, []); // Empty dependency array ensures this runs only once

  // Show loading while initializing
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (checkNetworkStatus() === false) {
    return <NetworkError />;
  }

  if (checkEndpointStatus() === false) {
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
              // This is just for UI state management
            } else {
              clearAllData()
              dispatch(logout());
            }
          }}
        />
      </StrictMode>
    );
  }

  // Show main app when authenticated
  if (isAuthenticated) {
    return (
      <BrowserRouter>
        <ThemeContextProvider>
          <Contents
            setLogin={async (newState) => {
              if (newState) {
                // Login success should be handled by the login action
              } else {
                // Logout
                clearAllData()
                dispatch(logout());
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("isLoggedIn");
                await localforage.removeItem("userId");
              }
            }}
          />
        </ThemeContextProvider>
      </BrowserRouter>
    );
  }

  return <div>loading</div>;
}

export default App;
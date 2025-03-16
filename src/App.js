import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Contents from './components/Contents';
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Footer from './components/Footer';
import { stepButtonClasses } from '@mui/material';
import IOUtil from './util/ioUtil';
import PictureUtil from './util/io_utils/FileUtil';
import { BrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
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


const defaultTheme = createTheme();

function checkNetworkStatus() {
  return Navigator.onLine
}

function checkEndpointStauts() {
  return true;
}


function App() {
  const [login, setLogin] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [badgeContent, setBadgeContent] = useState([])
  const [networkStatus, setNetworkStatus] = useState(false)
  // Notification.requestPermission().then((permission) => {
  //   if (permission === "granted") {
  //     const notification = new Notification("Welcome!");
  //   }
  // })

  if (checkNetworkStatus() === false) {
    return <NetworkError></NetworkError>
  }

  if (checkEndpointStauts() === false) {
    return <EndpointNotAvailableError></EndpointNotAvailableError>
  }

  if (login === false) {
    AccountUtil.verifyTokens(setLogin)
  }

  if (login === false) {
    return (
    <StrictMode> <AccountIssue loginState={login} setLoginState={setLogin}></AccountIssue></StrictMode> )
  }
  if (login === true)
    return (
  <BrowserRouter>
      <Contents setLogin={setLogin}></Contents>
      </BrowserRouter>
    );
  return <div> loading</div>
}

export default App;

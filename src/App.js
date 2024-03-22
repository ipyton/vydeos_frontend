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
import PictureUtil from './util/pictureUtil';
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

function init(setLoginState, setAvatar, setBadgeContent){
  IOUtil.verifyTokens().then(x => {
    if (x) {
      setLoginState(true)
    }
  })
}


const defaultTheme = createTheme();

function checkNetworkStatus() {
  return Navigator.onLine
}

function checkEndpointStauts() {
  return true;
}


function App() {
  const [login,setLogin] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [badgeContent, setBadgeContent] = useState([])
  const [networkStatus, setNetworkStatus] = useState(false)

  if (checkNetworkStatus() == false) {
    return <NetworkError></NetworkError>
  }

  if (checkEndpointStauts() == false) {
    return <EndpointNotAvailableError></EndpointNotAvailableError>
  }

  if (login == false) {
    AccountUtil.verifyTokens(setLogin).catch(err=> {
      console.log(err)
      setNetworkStatus(true)
    })
  }

  if (login == false) {
    console.log(login)

    return (<AccountIssue loginState={login} setLoginState= {setLogin}></AccountIssue>)
  }

  return (
    <ThemeProvider theme={defaultTheme}>
    <BrowserRouter>
    <Box sx={{ display: 'flex' }}>
      <Header setLogin={setLogin} avatar={avatar} setAvatar={setAvatar}  badgeContent={badgeContent} setBadgeContent={setBadgeContent}></Header>
      <Box width="100%"  justifyContent="center" alignItems="center" marginTop="5%">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Contents login={login} setLogin={setLogin}></Contents>
      </LocalizationProvider>
      <Footer description='good' title='morning'></Footer>
      </Box>
      </Box>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

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
import NetworkError from './components/Contents/NetworkError';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './components/Contents/Login';


function init(setLoginState, setAvatar, setBadgeContent){
  IOUtil.verifyTokens().then(x => {
    if (x) {
      setLoginState(true)
    }
  })



  
}
const defaultTheme = createTheme();


function App() {
  const [login,setLogin] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [badgeContent, setBadgeContent] = useState([])
  const [networkStatus, setNetworkStatus] = useState(null)

  if (null === login) {
    IOUtil.verifyTokens(setLogin).catch(err=> {
      setNetworkStatus(true)
    })
  }
  if (null === login) {
    
  }
  if (null === avatar)  {
    PictureUtil.getAvatar().catch(err=>{
      setNetworkStatus(true)
    }).then(response => {
      setAvatar(response)
    })
  }

  if(login && null === badgeContent) {
    IOUtil.getMessages()
  }
  // console.log("Ppppasidoqabwdouqbdoqwubd")
  // console.log(login)

  if (false === networkStatus) {
    return <NetworkError></NetworkError>
  }


  return (
    <ThemeProvider theme={defaultTheme}>
    <BrowserRouter>
    <Box sx={{ display: 'flex' }}>
      <Header login={login} setLogin={setLogin} avatar={avatar} setAvatar={setAvatar}  badgeContent={badgeContent} setBadgeContent={setBadgeContent}></Header>
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

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

function init(setLoginState, setAvatar, setBadgeContent){
  IOUtil.verifyTokens().then(x => {
    if (x) {
      setLoginState(true)
    }
  })



  
}


function App() {
  const [login,setLogin] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [badgeContent, setBadgeContent] = useState([])
  const [networkStatus, setNetworkStatus] = useState(null)

  //const [picGetter, setPicGetter] = useState(new LRUPicCacheUtil())
  // useEffect(()=>{
  //   const handleBeforeUnload = (e) => {
  //     picGetter.serialize()
  //   }
  // })
  if (null === login) {
    IOUtil.verifyTokens(setLogin).catch(err=> {
      setNetworkStatus(true)
    })
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
  console.log("Ppppasidoqabwdouqbdoqwubd")
  console.log(login)

  if (false === networkStatus) {
    return <NetworkError></NetworkError>
  }
  return (
    <BrowserRouter>
    <div>
      <Header login={login} setLogin={setLogin} avatar={avatar} setAvatar={setAvatar}  badgeContent={badgeContent} setBadgeContent={setBadgeContent}></Header>
      <br></br>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Contents login={login} setLogin={setLogin}></Contents>
      </LocalizationProvider>
      <br></br>
      <Footer description='good' title='morning'></Footer>
    </div>
    </BrowserRouter>
  );
}

export default App;

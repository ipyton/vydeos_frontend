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

function init(setLoginState, setAvatar, setBadgeContent){
  IOUtil.verifyTokens().then(x => {
    if (x) {
      setLoginState(true)
    }
  })



  
}


function App() {
  const [login,setLogin] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [badgeContent, setBadgeContent] = useState([])
  //const [picGetter, setPicGetter] = useState(new LRUPicCacheUtil())
  // useEffect(()=>{
  //   const handleBeforeUnload = (e) => {
  //     picGetter.serialize()
  //   }
  // })
  if (!login) {
    IOUtil.verifyTokens().catch(err=> {
      console.log()

    }).then(x => {
      if (x) {
        setLogin(true)
      }
    })
  }
  if (null === avatar)  {
    PictureUtil.getAvatar().then(response => {
      setAvatar(response)
    })
  }

  if(login && null === badgeContent) {
    IOUtil.getMessages()
  }

  return (
    <div>
      <Header loginState={login} setLoginState={setLogin} avatar={avatar} setAvatar={setAvatar}  badgeContent={badgeContent} setBadgeContent={setBadgeContent}></Header>
      <br></br>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Contents loginState={login} setLoginState={setLogin}></Contents>
      </LocalizationProvider>
      <br></br>
      <Footer></Footer>
    </div>
  );
}

export default App;

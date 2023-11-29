import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Contents from './components/Contents';
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  const [login,setLogin] = useState(false)
  //const [picGetter, setPicGetter] = useState(new LRUPicCacheUtil())
  // useEffect(()=>{
  //   const handleBeforeUnload = (e) => {
  //     picGetter.serialize()
  //   }
  // })

  return (
    <div>
      <Header loginState={login} setLoginState={setLogin}></Header>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Contents loginState={login} setLoginState={setLogin}></Contents>
      </LocalizationProvider>
    </div>
  );
}

export default App;

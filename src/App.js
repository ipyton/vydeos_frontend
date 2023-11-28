import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Contents from './components/Contents';
import { useEffect, useState } from 'react';
import { LRUPicCacheUtil } from './util/LRUPicCacheUtil';
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
      <Contents loginState={login} setLoginState={setLogin}></Contents>
    </div>
  );
}

export default App;

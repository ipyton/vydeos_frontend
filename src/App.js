import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Contents from './components/Contents';
import { useState } from 'react';
function App() {
  const [login,setLogin] = useState(false)
  return (
    <div>
      <Header loginState={login} setLoginState={setLogin}></Header>
      <Contents loginState={login} setLoginState={setLogin}></Contents>
    </div>
  );
}

export default App;

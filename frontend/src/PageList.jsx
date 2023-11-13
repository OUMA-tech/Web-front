import React from 'react';
import { Login, Register } from './api';
import { BrowserRouter as Routes, Route, Link } from 'react-router-dom';

const LandingPage = () => {
  return <></>;
}

export const PageList = () => {
  const [token, setToken] = React.useState(null);
  return (
    <>
      {token
        ? (
          <>
          <Link to='/dashboard'>Dashboard</Link>
          </>
          )
        : (
        <>
        <Link to='/register'>Register</Link>
        {'\u00A0'}|{'\u00A0'}
        <Link to='/login'>Login</Link>
        </>
          )
      }
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register token = {token} setToken = {setToken}/>} />
        <Route path="/login" element={<Login token = {token} setToken = {setToken}/>} />
      </Routes>

    <hr/>
    <small>Airbrb 2023 ©</small>
    </>

  );
}

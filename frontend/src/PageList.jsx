import React from 'react';
import { Login, Register, Dashboard, Footer } from './api';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

const PageList = () => {
  const [token, setToken] = React.useState(null);
  const navigate = useNavigate();
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  }
  return (
    <>
      {token
        ? (
          <>
          <Link to='/dashboard'>Dashboard</Link>
          {'\u00A0'}|{'\u00A0'}
          <a href='#' onClick={logout}>Logout</a>
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
      <hr />
      <Routes>
        <Route path="/register" element={<Register token = {token} setToken = {setToken}/>} />
        <Route path="/login" element={<Login token = {token} setToken = {setToken}/>} />
        <Route path="/dashboard" element={<Dashboard token = {token} setToken = {setToken}/>} />
      </Routes>

    <hr/>
    <Footer />

    </>
  );
}
export default PageList;

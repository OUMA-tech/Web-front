import React from 'react';
import { Login, Register } from './api';

function App () {
  const [page, setPage] = React.useState('register');

  return (
    <>
    <a href="#" onClick={() => setPage('register')}>Register</a> |
    <a href="#" onClick={() => setPage('login')}>Login</a>
    {page === 'register'
      ? (
        <Register/>
        )
      : page === 'login'
        ? (
          <Login/>
          )
        : null}
    </>

  );
}

export default App;

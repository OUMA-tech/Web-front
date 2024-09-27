import React from 'react';
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login'

const App = () => {
  const handleLogin = (userData) => {
    console.log(userData);
  }
  return (
    <div>
      <Header />
      <>Let&apos;s go!</>
      <div className='Container'>
        <Router>
          <Routes>
            <Route path='/login' element={<Login onLogin={handleLogin}/>}/>
          </Routes>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;

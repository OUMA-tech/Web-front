import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AllListings from './components/AllListings';
import HostedListings from './components/HostedListings';
import EditHostedListings from './components/EditHostedListings';
import CreateHostedListings from './components/CreateHostedListings';
import Footer from './components/Footer'
import { DetailsBox } from './components/DetailsListing';
import Request from './components/Request';

const PageList = () => {
  const [token, setToken] = React.useState(null);
  const navigate = useNavigate();
  const logout = async () => {
    const response = await fetch('http://localhost:5005/user/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      console.log('log out!');
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      navigate('/');
    }
  }
  return (
    <>
      {token
        ? (
          <>
          <Link to='/dashboard'>Dashboard</Link>
          <Button variant="contained" color="secondary" onClick={logout}>Logout</Button>
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
        <Route path="/" element={<AllListings/>} />
        <Route path="/hosted-listings" element={<HostedListings token = {token} setToken = {setToken}/>} />
        <Route path="/edit-listing" element={<EditHostedListings token = {token} setToken = {setToken}/>} />
        <Route path="/create-listing" element={<CreateHostedListings token = {token} setToken = {setToken}/>} />
        { /* need to be set later */ }
        <Route path="/listing/:listingId" element={<DetailsBox token = {token} setToken = {setToken}/>} />
        <Route path="/booking-listing" element={<CreateHostedListings token = {token} setToken = {setToken}/>} />
        <Route path="/request/:listingId" element={<Request token = {token} setToken = {setToken}/>} />
      </Routes>

    <hr/>
    <Footer />

    </>
  );
}
export default PageList;

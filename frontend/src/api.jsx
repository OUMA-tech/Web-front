import React from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const Register = (props) => {
  console.log(props);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('')
  const navigate = useNavigate();
  React.useEffect(() => {
    if (props.token) {
      navigate('/dashboard');
    }
  })
  const register = async () => {
    console.log(email, name, password);
    const response = await fetch('http://localhost:5005/user/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email, password, name
      }),
      headers: {
        'Content-type': 'application/json',
      }
    })
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      props.setToken(data.token);
      navigate('/dashboard');
    }
    console.log(data);
  }
  return (
    <Box
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1, width: '25ch' },
    }}
    noValidate
    autoComplete="off"
  >
      <Typography variant="h3" gutterBottom>Register</Typography>

      <TextField type='text' label = 'Email' value = {email} onChange = {e => { setEmail(e.target.value) }}/><br />
      <div />
      <TextField type='password' label = 'Password' value = {password} onChange = {e => { setPassword(e.target.value) }}/><br />
      <TextField type='text' label = 'Name' value = {name} onChange = {e => { setName(e.target.value) }}/><br />
      <br />
      <Button variant="contained" type='Button' onClick={register}>Register</Button>
    </Box>
  )
}

export const Login = (props) => {
  console.log(props);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate()
  const login = async () => {
    console.log(email, password);
    const response = await fetch('http://localhost:5005/user/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email, password
      }),
      headers: {
        'Content-type': 'application/json',
      }
    })
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      props.setToken(data.token);
      navigate('/dashboard');
    }
  }
  return (
    <Box
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1, width: '25ch' },
    }}
    noValidate
    autoComplete="off"
  >
    <Typography variant="h3" gutterBottom>Login</Typography>
      <TextField type='text' label='Email' value = {email} onChange = {e => { setEmail(e.target.value) }}/><br />

      <TextField type='password' label='Password' value = {password} onChange = {e => { setPassword(e.target.value) }}/><br />
    <br />
    <Button variant="contained" color="primary" type='Button' onClick={login}>Login</Button>
    </Box>
  )
}

export const Dashboard = (props) => {
  const [listings, setListings] = React.useState([]);
  const navigate = useNavigate()
  React.useEffect(() => {
    if (!props.token) {
      navigate('/login');
    }
  }, [props.token, navigate]);
  const getAllListings = async () => {
    const response = await fetch('http://localhost:5005/listings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    })
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      console.log(data);
      setListings(data.listings);
      console.log('showing listings');
    }
  }
  const getHostedListings = () => {
    const owner = localStorage.getItem('email');
    getAllListings().then(() => {
      const hostedListings = listings.filter(listing => listing.owner === owner);
      setListings(hostedListings);
      console.log('hosted listings');
    })
  }
  return (
    <>
      Dashboard! <br />
      <button onClick={getAllListings}>All Listings</button>
      {'\u00A0'}|{'\u00A0'}
      <button onClick={getHostedListings}>Hosted Listings</button>
      <div>
        {listings.length === 0
          ? <p>No listings available</p>
          : listings.map((listing) => (
              <div key={listing.id}>
                <h2>{listing.title}</h2>
                <img src={listing.thumbnail} alt={listing.title} />
                <p>Price: ${listing.price}</p>
              </div>
          ))
        }
      </div>
    </>
  )
}

export const Footer = () => {
  return (
    <Typography
      variant="caption"
      display="block"
      gutterBottom
      sx={{
        textAlign: 'center'
      }}
    >
    Airbrb 2023 ©
    </Typography>
  )
}

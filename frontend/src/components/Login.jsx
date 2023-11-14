import React from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
      localStorage.setItem('email', email);
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

export default Login;

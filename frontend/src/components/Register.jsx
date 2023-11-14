import React from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const Register = (props) => {
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

export default Register;

import { React, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [conpassword, setConPassword] = useState('')

  //   handleSubmit = () => {

  //   }
  return (
    <div>
      <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
      >
        <TextField id="outlined-basic" label="Email" variant="outlined" value={email} onChange={e => { setEmail(e.target.value) }} />
        <TextField id="outlined-basic" label="Password" type="password" autoComplete="current-password" value={password} onChange={e => { setPassword(e.target.value) }}/>
        <TextField id="outlined-basic" label="Confirm Password" type="password" autoComplete="current-password" value={conpassword} onChange={e => { setConPassword(e.target.value) }}/>
      </Box>
      <Button variant="contained">Submit</Button>
    </div>
  )
}

export default Login;

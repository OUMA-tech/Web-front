import React from 'react';

export function Register () {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('')
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
    }
    console.log(data);
  }
  return (
  <>
  <h2>Register</h2>
  Email:
  <div/>
  <input type='text' value = {email} onChange = {e => { setEmail(e.target.value) }}/><br />
  Password:
  <div/>
  <input type='password' value = {password} onChange = {e => { setPassword(e.target.value) }}/><br />
  Name:
  <div/>
  <input type='text' value = {name} onChange = {e => { setName(e.target.value) }}/><br />
  <button type='button' onClick={register}>Register</button>
  </>
  )
}

export function Login () {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
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
    }
    console.log(data);
  }
  return (
  <>
  <h2>Login</h2>
  Email:
  <div/>
    <input type='text' value = {email} onChange = {e => { setEmail(e.target.value) }}/><br />
  Password:
  <div/>
    <input type='password' value = {password} onChange = {e => { setPassword(e.target.value) }}/><br />
  <button type='button' onClick={login}>Login</button>
  </>
  )
}

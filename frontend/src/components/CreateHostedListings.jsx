import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export const CreateHostedListings = (props) => {
  console.log('create listings');
  const navigate = useNavigate()
  React.useEffect(() => {
    if (!props.token) {
      navigate('/login');
    }
  }, [props.token, navigate]);
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [metadata, setMetadata] = React.useState('');
  const token = localStorage.getItem('token');
  if (!token) return;
  const createListings = async () => {
    console.log(title, address, thumbnail, price, metadata)
    const response = await fetch('http://localhost:5005/listings/new', {
      method: 'POST',
      body: JSON.stringify({
        title, address, thumbnail, price, metadata
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    });
    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      console.log('create listings');
    }
  };

  return (
    <>
     <Box
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1, width: '25ch' },
    }}
    noValidate
    autoComplete="off"
  >
    <Typography variant="h3" gutterBottom>Create Listings</Typography>
    <TextField type='text' label = 'title' value = {title} onChange = {e => { setTitle(e.target.value) }}/><br />
    <TextField type='text' label = 'address' value = {address} onChange = {e => { setAddress(e.target.value) }}/><br />
    <TextField type='text' label = 'thumbnail' value = {thumbnail} onChange = {e => { setThumbnail(e.target.value) }}/><br />
    <TextField type='text' label = 'price' value = {price} onChange = {e => { setPrice(e.target.value) }}/><br />
    <TextField type='text' label = 'metadata' value = {metadata} onChange = {e => { setMetadata(e.target.value) }}/><br />
    <br />
    <Button variant="contained" color="primary" type='Button' onClick = {createListings}>Submit</Button>
    </Box>
    </>
  )
}

export default CreateHostedListings;

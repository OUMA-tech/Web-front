import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const EditHostedListings = (props) => {
  const navigate = useNavigate()
  React.useEffect(() => {
    if (!props.token) {
      navigate('/');
    }
  }, [props.token, navigate]);
  const location = useLocation();
  const { listingId } = location.state || {};
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState([]);
  const [thumbnail, setThumbnail] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [metadata, setMetadata] = React.useState({
    PropertyType: '',
    Bathroom: 0,
    Bed: 0,
    Amenities: '',
  });
  const [propertyType, setPropertyType] = React.useState('');
  const [bathroom, setBathroom] = React.useState('');
  const [bed, setBed] = React.useState('');
  const [amenities, setAmenities] = React.useState('');
  const [listImages, setListImages] = React.useState('');
  const token = localStorage.getItem('token');
  if (!listingId) return;
  const editListings = async () => {
    setMetadata({
      ...metadata,
      PropertyType: propertyType,
      Bathroom: bathroom,
      Bed: bed,
      Amenities: amenities,
    })
    const response = await fetch(`http://localhost:5005/listings/${listingId}`, {
      method: 'PUT',
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
      console.log('edit hosted listings');
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
    <Typography variant="h3" gutterBottom>Edit Hosted Listings</Typography>
    <TextField type='text' label = 'Title' value = {title} onChange = {e => { setTitle(e.target.value) }}/><br />
    <TextField type='text' label = 'Address' value = {address} onChange = {e => { setAddress(e.target.value) }}/><br />
    <TextField type='text' label = 'Price' value = {price} onChange = {e => { setPrice(e.target.value) }}/><br />
    <TextField type='text' label = 'Thumbnail' value = {thumbnail} onChange = {e => { setThumbnail(e.target.value) }}/><br />
    <TextField type='text' label = 'PropertyType' value = {propertyType} onChange = {e => { setPropertyType(e.target.value) }}/><br />
    <TextField type='text' label = 'Number of 🛀' value = {bathroom} onChange = {e => { setBathroom(e.target.value) }}/><br />
    <TextField type='text' label = 'Number of 🛏️' value = {bed} onChange = {e => { setBed(e.target.value) }}/><br />
    <TextField type='text' label = 'Amenities' value = {amenities} onChange = {e => { setAmenities(e.target.value) }}/><br />
    <TextField type='text' label = 'List of Images' value = {listImages} onChange = {e => { setListImages(e.target.value) }}/><br />
    <br />
    <Button variant="contained" color="primary" type='Button' onClick = {editListings}>Submit</Button>
    </Box>
    </>
  )
}

export default EditHostedListings;

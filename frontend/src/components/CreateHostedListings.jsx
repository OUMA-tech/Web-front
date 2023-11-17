import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export const CreateHostedListings = (props) => {
  console.log('create listings');
  const navigate = useNavigate()
  React.useEffect(() => {
    if (!props.token) {
      navigate('/');
    }
  }, [props.token, navigate]);
  const [title, setTitle] = React.useState('');
  const [state, setState] = React.useState('');
  const [suburb, setSuburb] = React.useState('');
  const [specificAddress, setSpecificAddress] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [propertyType, setPropertyType] = React.useState('');
  const [bathroom, setBathroom] = React.useState('');
  const [bed, setBed] = React.useState('');
  const [amenities, setAmenities] = React.useState('');
  const [listImages, setListImages] = React.useState('');
  const token = localStorage.getItem('token');
  if (!token) return;
  const createListings = async () => {
    const updatedAddress = {
      SpecificAddress: specificAddress,
      Suburb: suburb,
      State: state,
    };
    const updatedMetadata = {
      PropertyType: propertyType,
      Bathroom: bathroom,
      Bed: bed,
      Amenities: amenities,
      ListImages: listImages,
    };
    const response = await fetch('http://localhost:5005/listings/new', {
      method: 'POST',
      body: JSON.stringify({
        title, address: updatedAddress, thumbnail, price, metadata: updatedMetadata
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
      navigate('/hosted-listings')
    }
  };
  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));
  const classes = useStyles();
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
    <TextField type='text' label = 'Title' value = {title} onChange = {e => { setTitle(e.target.value) }}/><br />
    <TextField type='text' label = 'State' value = {state} onChange = {e => { setState(e.target.value) }}/><br />
    <TextField type='text' label = 'Suburb' value = {suburb} onChange = {e => { setSuburb(e.target.value) }}/><br />
    <TextField type='text' label = 'Unit & Street' value = {specificAddress} onChange = {e => { setSpecificAddress(e.target.value) }}/><br />
    <TextField type='text' label = 'Price' value = {price} onChange = {e => { setPrice(e.target.value) }}/><br />
    <TextField type='text' label = 'Thumbnail' value = {thumbnail} onChange = {e => { setThumbnail(e.target.value) }}/><br />
    <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Property Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={propertyType}
          onChange={ e => { setPropertyType(e.target.value) }}
        >
          <MenuItem value={'appartment'}>Appartment</MenuItem>
          <MenuItem value={'house'}>House</MenuItem>
        </Select>
      </FormControl>
    <br />
    <TextField type='text' label = 'Number of 🛀' value = {bathroom} onChange = {e => { setBathroom(e.target.value) }}/><br />
    <TextField type='text' label = 'Number of bedrooms' value = {bed} onChange = {e => { setBed(e.target.value) }}/><br />
    <TextField type='text' label = 'Amenities' value = {amenities} onChange = {e => { setAmenities(e.target.value) }}/><br />
    <TextField type='text' label = 'List of Images' value = {listImages} onChange = {e => { setListImages(e.target.value) }}/><br />
    <br />
    <Button variant="contained" color="primary" type='Button' onClick = {createListings}>Submit</Button>
    </Box>
    </>
  )
}

export default CreateHostedListings;

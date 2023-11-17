import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@material-ui/core/ButtonGroup';

export const HostedListings = (props) => {
  const navigate = useNavigate()
  React.useEffect(() => {
    if (!props.token) {
      navigate('/');
    }
  }, [props.token, navigate]);
  const [listings, setListings] = React.useState([]);
  const [allListings, setAllListings] = React.useState([]);
  const owner = localStorage.getItem('email');
  console.log('owner', owner);
  React.useEffect(() => {
    const fetchListings = async () => {
      console.log('fetching listings')
      const response = await fetch('http://localhost:5005/listings', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        console.log(data);
        setAllListings(data.listings);
        console.log(allListings);
        fetchAllListings(data.listings);
      }
    };

    const fetchAllListings = async (listings) => {
      const updatedListings = await Promise.all(
        listings.map(async (listing) => {
          const response = await fetch(`http://localhost:5005/listings/${listing.id}`, {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
            },
          });
          const data = await response.json();
          if (data.error) {
            alert(data.error);
            return null;
          } else {
            console.log(data);
            return data.listing.owner === owner ? { id: listing.id, data } : null;
          }
        })
      );
      const validListings = updatedListings.filter(listing => listing !== null);
      console.log(updatedListings);
      setListings(prevListings => [...prevListings, ...validListings]);
    }
    fetchListings();
  }, [owner]);

  // used for geting default date as today
  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // this part for add available date
  const [availability, setAvailability] = React.useState([]);
  const [startDate, setStartDate] = React.useState(getFormattedDate());
  const [endDate, setEndDate] = React.useState(getFormattedDate());

  // add availability by clicking the add button
  const handleAddAvailability = () => {
    if (startDate && endDate) {
      const newRange = { start: startDate, end: endDate };
      // Check for errors
      if (endDate <= startDate) {
        window.alert('End date must be greater than start date.');
      } else if (availability.some((range) => startDate >= range.start && endDate <= range.end)) {
        window.alert('The chosen date range is already inside existing availability.');
      } else if (availability.some((range) => startDate <= range.start && endDate >= range.end)) {
        window.alert('The chosen date range is conflicting inside existing availability.');
      } else if (startDate < getFormattedDate()) {
        window.alert('You are putting in a passed date!');
      } else {
        // If no errors, add the new range and reset inputs
        setAvailability([...availability, newRange]);
        setStartDate(getFormattedDate());
        setEndDate(getFormattedDate());
        console.log(availability);
      }
    }
  };

  // clear availability
  const clearAvailability = () => {
    setAvailability([]);
    setStartDate(getFormattedDate());
    setEndDate(getFormattedDate());
  };

  // styles used for date
  const dateStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));
  const classes = dateStyles();

  // delete a listing
  const deleteLisitng = async (listing) => {
    const listingId = listing.id;
    console.log(listing);
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5005/listings/${listingId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      console.log('delete successful!');
      const updatedListings = listings.filter((listing) => listing.id !== listingId);
      setListings(updatedListings);
      navigate('/hosted-listings');
    }
  }

  // publish a listing
  const publishListing = async (listing, availability) => {
    if (availability.length === 0) {
      window.alert('You have to add at least one available date range');
      navigate('/dashboard')
    } else {
      const listingId = listing.id;
      console.log(listing);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5005/listings/publish/${listingId}`, {
        method: 'PUT',
        body: JSON.stringify({
          availability
        }),
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        window.alert('publish successful!');
        clearAvailability();
        navigate('/dashboard');
      }
    }
  }
  console.log(listings);
  const unPublish = async (listing) => {
    const listingId = listing.id;
    console.log(listing);
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5005/listings/unpublish/${listingId}`, {
      method: 'PUT',
      body: JSON.stringify({
        availability
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      window.alert('unpublish successful!');
      navigate('/dashboard');
    }
  }
  return (
    <>
      <Typography variant="h3" gutterBottom>Hosted Listings</Typography>
      <Button color="primary" onClick={() => navigate('/create-listing')}>Create</Button>
      <div>
        {listings.length === 0
          ? <p>No listings available</p>
          : listings.map((listing) => (
              <div key={listing.id}>
                <hr />
                <h2>Title {listing.data.listing.title}</h2>
                <p>Address {listing.data.listing.address.SpecificAddress} {listing.data.listing.address.Suburb} {listing.data.listing.address.State}</p>
                <p>Price: ${listing.data.listing.price}</p>
                <img src={listing.data.listing.thumbnail} alt={listing.data.listing.title} />
                <p>Property type: {listing.data.listing.metadata.PropertyType}</p>
                <p>Number of bathrooms: {listing.data.listing.metadata.Bathroom}</p>
                <p>Bedrooms: {listing.data.listing.metadata.Bed}</p>
                <p>Amenities: {listing.data.listing.metadata.Amenities}</p>
                <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                <Button color="primary" onClick={() => navigate('/edit-listing', { state: { listingId: listing.id } })}>Edit</Button>
                <Button color="secondary" onClick={() => deleteLisitng(listing)}>Delete</Button>
                <Button color="primary" onClick={ () => { navigate(`/request/${listing.id}`, { state: { data: listing } }) }}>View Request</Button>
                </ButtonGroup>
                <div>
                  <form className={classes.container} noValidate style={{ marginTop: '2vh' }}>
                    <TextField
                      id = "date"
                      label = "StartDate"
                      type = "date"
                      value = { startDate }
                      onChange = {e => { setStartDate(e.target.value) }}
                      className = { classes.textField }
                      InputLabelProps = {{
                        shrink: true,
                      }}
                    />
                  </form>
                  <form className={classes.container} noValidate style={{ marginTop: '2vh' }}>
                    <TextField
                      id="date"
                      label="EndDate"
                      type="date"
                      value = { endDate }
                      onChange = {e => { setEndDate(e.target.value) }}
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </form>
                  <Button color="primary" onClick={handleAddAvailability}>Add Availability</Button>

                  {availability.map((range, index) => (
                    <div key={index}>
                      From {range.start} to {range.end}
                    </div>
                  ))}
                  <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                    <Button color="primary" onClick={() => publishListing(listing, availability)}>Publish</Button>
                    <Button color="secondary" onClick={clearAvailability}>Clear</Button>
                    <Button color="secondary" onClick={() => unPublish(listing)}>Unpublish</Button>
                  </ButtonGroup>
                </div>
              </div>
          ))
        }
      </div>
    </>
  );
};

export default HostedListings;

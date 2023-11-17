import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// create the detailsBox
export const DetailsBox = (props) => {
  const token = props.token;
  const location = useLocation();
  const { data: listing } = location.state || {};
  const navigate = useNavigate();

  // used for geting default date as today
  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // this part for add available date
  const [startDate, setStartDate] = React.useState(getFormattedDate());
  const [endDate, setEndDate] = React.useState(getFormattedDate());
  const [bookingId, setBookingId] = React.useState(0);
  const [allBookings, setAllBookings] = React.useState([])

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
  // booking function
  const booking = async (newRange) => {
    console.log(listing)
    const token = localStorage.getItem('token');
    const dateRange = newRange;
    const date1 = new Date(dateRange.end);
    const date2 = new Date(dateRange.start);

    const differenceInTime = date1.getTime() - date2.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    console.log(differenceInDays);
    const totalPrice = parseInt(listing.data.listing.price) * differenceInDays;
    console.log(dateRange, totalPrice);
    const response = await fetch(`http://localhost:5005/bookings/new/${listing.id}`, {
      method: 'POST',
      body: JSON.stringify({
        dateRange, totalPrice
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
      window.alert('booking success!');
      setBookingId(data.bookingId);
      getBookingStatus();
    }
  }
  const getBookingStatus = async () => {
    const response = await fetch('http://localhost:5005/bookings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      setAllBookings(data.bookings);
    }
  }
  React.useEffect(() => {
    if (token) {
      getBookingStatus();
    }
  }, [])

  console.log(allBookings, bookingId);
  return (
      <div>
        <Typography variant="h3" gutterBottom>Listing Details</Typography>
        <Button variant="contained" color="secondary" onClick={ () => { navigate('/'); }}>
          Back
        </Button>
        <div>
          <h2>Title {listing.data.listing.title}</h2>
          <Typography variant="h5" gutterBottom style={{ color: 'Red' }}>Status:</Typography>
          { allBookings.filter(booking => parseInt(booking.listingId) === listing.id)
            .map(machedBooking => (
              <div key={machedBooking.id}>
                <p>{machedBooking.status}</p>
                <hr/>
              </div>
            ))
          }
          <p>Address {listing.data.listing.address.SpecificAddress} {listing.data.listing.address.Suburb} {listing.data.listing.address.State}</p>
          <p>Amenities: {listing.data.listing.metadata.Amenities}</p>
          <p>Price per night: ${listing.data.listing.price}</p>
          { listing.data.listing.metadata.ListImages
            ? (
            <img src={listing.data.listing.metadata.ListImages} alt={listing.data.listing.title} />
              )
            : (
              <></>
              )
          }
          <p>Property type: {listing.data.listing.metadata.PropertyType}</p>
          <p>Reviews {listing.data.listing.reviews}</p>

          <p>Bedrooms: {listing.data.listing.metadata.Bed}</p>
          <p>Number of bathrooms: {listing.data.listing.metadata.Bathroom}</p>
          { token && (
            <>
              <p>status: </p>
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
              <Button color="primary" onClick={() => {
                const newRange = { start: startDate, end: endDate };
                if (startDate && endDate) {
                  // Check for errors
                  if (endDate <= startDate) {
                    window.alert('End date must be greater than start date.');
                  } else if (startDate < getFormattedDate()) {
                    window.alert('You are putting in a passed date!');
                  } else {
                    // If no errors, booking
                    console.log('date no error, booking now')
                    booking(newRange);
                  }
                }
              }}>Booking</Button>
            </>
          )}
        </div>
      </div>
  )
}

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

export const Request = (props) => {
  const navigate = useNavigate()
  const owner = localStorage.getItem('email');
  const location = useLocation();
  const { data: listing } = location.state || {};
  console.log(listing);
  console.log(owner);
  const postedAt = listing.data.listing.postedOn;
  const datePosted = new Date(postedAt);
  const timestamp = Date.now();
  let seconds = timestamp - datePosted;
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= (24 * 3600);
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  console.log(postedAt);
  const token = props.token;
  const [allBooking, setAllBooking] = React.useState([])
  React.useEffect(() => {
    if (!props.token) {
      navigate('/');
    }
    getBookingStatus();
  }, [props.token]);
  //  fetching all booking
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
      console.log('get booking successful!');
      console.log(data);
      setAllBooking(data.bookings.filter(booking => parseInt(booking.listingId) === listing.id));
    }
  }
  const acceptBooking = async (bookingid) => {
    const response = await fetch(`http://localhost:5005/bookings/accept/${bookingid}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      window.alert('accept booking successful!');
    }
  }
  const declineBooking = async (bookingid) => {
    const response = await fetch(`http://localhost:5005/bookings/decline/${bookingid}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      window.alert('decline booking successful!');
    }
  }
  console.log(allBooking);
  return (
    <>
      <div>
        <p>How long for posted: {days} Day {hours} Hours {minutes} Minutes</p>
        {allBooking.map((booking) => (
          <div key={booking.id}>
            <hr />
            <p>Booking ID: {booking.id}</p>
            <p>DateRange: {booking.dateRange[0]}-{booking.dateRange[1]}</p>
            <p>Total Price: {booking.totalPrice}</p>
            <p>Listing ID: {}</p>
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
            <Button color="primary" onClick={() => acceptBooking(booking.id)}>Accpet</Button>
            <Button color="secondary" onClick={() => declineBooking(booking.id)}>Deny</Button>
            </ButtonGroup>
          </div>
        ))}
      </div>
    </>
  )
}

export default Request;

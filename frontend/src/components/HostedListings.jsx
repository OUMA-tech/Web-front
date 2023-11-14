import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const HostedListings = (props) => {
  const navigate = useNavigate()
  React.useEffect(() => {
    if (!props.token) {
      navigate('/login');
    }
  }, [props.token, navigate]);
  const [listings, setListings] = React.useState([]);
  const owner = localStorage.getItem('email');
  console.log('owner', owner);
  React.useEffect(() => {
    const fetchListings = async () => {
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
        const hostedListings = data.listings.filter(listing => listing.owner === owner);
        setListings(hostedListings);
        console.log('hosted listings');
      }
    };

    fetchListings();
  }, [owner]);

  return (
    <>
      <Typography variant="h3" gutterBottom>Hosted Listings</Typography>
      <Button color="primary" onClick={() => navigate('/create-listing')}>Create</Button>
      <Button color="secondary" onClick={() => {}}>Delete</Button>
      <div>
        {listings.length === 0
          ? <p>No listings available</p>
          : listings.map((listing) => (
              <div key={listing.id}>
                <h2>{listing.title}</h2>
                <img src={listing.thumbnail} alt={listing.title} />
                <p>Price: ${listing.price}</p>
                <div>{listing.reviews}</div>
                <Button color="primary" onClick={() => navigate('/edit-listing', { state: { listingId: listing.id } })}>Edit</Button>
              </div>
          ))
        }
      </div>
    </>
  );
};

export default HostedListings;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

export const AllListings = (props) => {
  const [listings, setListings] = React.useState([]);
  const navigate = useNavigate()
  React.useEffect(() => {
    if (!props.token) {
      navigate('/login');
    }
  }, [props.token, navigate]);
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
        setListings(data.listings);
        console.log('all listings')
        console.log(data.listings);
      }
    };

    fetchListings();
  }, []);

  return (
    <>
      <Typography variant="h3" gutterBottom>All Listings</Typography>
      <div>
        {listings.length === 0
          ? <p>No listings available</p>
          : listings.map((listing) => (
              <div key={listing.id}>
                <h2>{listing.title}</h2>
                <img src={listing.thumbnail} alt={listing.title} />
                <p>Price: ${listing.price}</p>
              </div>
          ))
        }
      </div>
    </>
  );
};

export default AllListings;

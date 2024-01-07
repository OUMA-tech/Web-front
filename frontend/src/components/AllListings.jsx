import React from 'react';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { SearchBox } from './SearchBox';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';

export const AllListings = () => {
  const [value, setValue] = React.useState(2);
  const [comment, setComment] = React.useState('');
  const [listings, setListings] = React.useState([]);
  const [myListings, setMyListings] = React.useState([]);
  const [originalListings, setOriginalListings] = React.useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = React.useState(false);
  const [searchTerms, setSearchTerms] = React.useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const owner = localStorage.getItem('email');
  console.log(owner);

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
            return data.listing.published ? { id: listing.id, data } : null;
          }
        })
      );
      const validListings = updatedListings.filter(listing => listing !== null);
      console.log(validListings);
      setOriginalListings(validListings);
    }
    fetchListings();
    // to fetch the listing I've booked
    if (token) {
      const fetchMyListings = async () => {
        const response = await fetch('http://localhost:5005/bookings', {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        });
        const data = await response.json();
        if (data.error) {
          alert(data.error);
        } else {
          const filterMyListing = data.bookings.filter(booking => booking.owner === owner)
          if (filterMyListing.length !== 0) {
            // add the listing with booking status accpet/pending to myListings
            console.log(filterMyListing);
            const filteredListings = filterMyListing.filter(booking => booking.status === 'accepted' || booking.status === 'pending');
            setMyListings(filteredListings);
            console.log('my listings')
            console.log(data.listings);
          } else {
            // no booking yet
            console.log('No bookings yet');
          }
        }
      };
      fetchMyListings();
    }
  }, [token]);
  console.log(myListings);
  console.log(originalListings);

  // sort the order with booking status accpet/pending first, then alphabet order
  const sortedListings = [...originalListings].sort((a, b) => {
    // 检查标题是否全为数字
    const isNumeric = (str) => /^\d+$/.test(str);
    // 检查id是否在myListings中
    const isInMyListings = (id) => myListings.some(listing => parseInt(listing.listingId) === id);
    // 如果a在myListings中而b不在，a排在前面
    if (isInMyListings(a.id) && !isInMyListings(b.id)) {
      return -1;
    }
    // 如果b在myListings中而a不在，b排在前面
    if (!isInMyListings(a.id) && isInMyListings(b.id)) {
      return 1;
    }
    // 如果a的标题全为数字而b不是，a排在后面
    if (isNumeric(a.data.listing.title) && !isNumeric(b.data.listing.title)) {
      return 1;
    }
    // 如果b的标题全为数字而a不是，b排在后面
    if (!isNumeric(a.data.listing.title) && isNumeric(b.data.listing.title)) {
      return -1;
    }
    // 其他情况按标题字母顺序排序
    return a.data.listing.title.localeCompare(b.data.listing.title);
  });
  console.log(sortedListings);

  // search function
  const handleSearch = (searchTerm) => {
    console.log(searchTerm);
    setSearchTerms(...searchTerms, searchTerm);
    console.log(listings);
    // when there is no search term search is the way showing all listings
    if (searchTerm.title === '' && !showAdvancedSearch) {
      setListings(originalListings);
    } else if (searchTerm.tile !== '') {
      const filteredListings = originalListings.filter(listing => {
        const suburbMatch = (listing.data.listing.address.Suburb && listing.data.listing.address.Suburb.toLowerCase().includes(searchTerm.title.toLowerCase()))
        const titleMatch = listing.data.listing.title && listing.data.listing.title.toLowerCase().includes(searchTerm.title.toLowerCase());
        return suburbMatch || titleMatch;
      });
      console.log(filteredListings);
      setListings(filteredListings);
    } else if (showAdvancedSearch) { // this part for solving advanced search
      if (searchTerm.bedrooms !== 0) { // used bedrooms for searching term
        const filteredListings = originalListings.filter(listing => {
          const bedroomMatch = (parseInt(listing.data.listing.metadata.Bed) === searchTerm.bedrooms)
          return bedroomMatch;
        });
        setListings(filteredListings);
      }
      if (searchTerm.dateRange.length !== 0) { // used dateRange for searching term
        const filteredListings = originalListings.filter(listing => {
          return listing.data.listing.availability.some(avail =>
            avail.startDate === searchTerm.dateRange.startDate &&
            avail.endDate === searchTerm.dateRange.endDate
          );
        });
        setListings(filteredListings);
      }
      if (searchTerm.priceRange.length !== 0) { // used priceRange for searching term
        const filteredListings = originalListings.filter(listing => {
          return listing.data.listing.price < searchTerm.priceRange[1] && listing.data.listing.price > searchTerm.priceRange[0];
        });
        setListings(filteredListings);
      }
    }
  };
  const uniqueListings = Array.from(new Map(sortedListings.map(listing => [listing.id, listing])).values());
  console.log(uniqueListings);

  const reviewSubmit = async (matchedListing) => {
    console.log(matchedListing);
    const re = {
      Comment: comment, Rate: value
    }
    console.log(re);
    const response = await fetch(`http://localhost:5005/listings/${matchedListing.listingId}/review/${matchedListing.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        review: re
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    });
    const data = await response.json();

    if (data.error) {
      window.alert(data.error);
    } else {
      window.alert('reciew successful!');
      navigate('/');
    }
  }
  return (
    <>
      <Typography variant="h3" gutterBottom>All Listings</Typography>
      <SearchBox onSearch={handleSearch}
        showAdvancedSearch={showAdvancedSearch}
        setShowAdvancedSearch={setShowAdvancedSearch} />
      <div>
        {uniqueListings.length === 0
          ? <p>No listings available</p>
          : uniqueListings.map((listing) => (
              <div key={listing.id} onClick={() => { navigate(`/listing/${listing.id}`, { state: { data: listing } }); }}>
                <hr />
                <Typography variant="h3">{listing.data.listing.title}</Typography>
                <img src={listing.data.listing.thumbnail} alt={listing.data.listing.title} />
                {token && myListings.some(myListing => parseInt(myListing.listingId) === listing.id)
                  ? <>
                      <Typography variant="h5" gutterBottom style={{ color: 'Red' }}>Status: </Typography>
                      { myListings.filter(myListing => parseInt(myListing.listingId) === listing.id)
                        .map(matchedListing => (
                          <div key={matchedListing.listingId}>
                            <p>{matchedListing.status}</p>
                            {matchedListing.status === 'accepted'
                              ? <div onClick={(event) => { event.stopPropagation() }} >
                              <TextField id="outlined-basic" label="Comment" variant="outlined" onChange = {e => { setComment(e.target.value) }}/>
                              <Rating
                                name="simple-controlled"
                                value={value}
                                onChange={(event, newValue) => {
                                  setValue(newValue);
                                }}
                              />
                              <Button variant="contained" onClick={() => { reviewSubmit(matchedListing) }}>Leave a review</Button>
                            </div>
                              : <></>
                            }
                          </div>
                        ))
                      }
                    </>
                  : <></>
                }
                { listing.data.listing.reviews.length === 0
                  ? <div>
                      <Typography component="legend">No rating given</Typography>
                      <Rating name="no-value" value={null} />
                    </div>
                  : <div>
                    <hr/>
                      <Typography variant="h6">
                       {listing.data.listing.owner} reviewed:
                      </Typography>
                      {listing.data.listing.reviews.map((review, index) => (
                        <div key={index}>
                          <p>{index + 1}.</p>
                          <Rating name="read-only" value={review.Rate} readOnly />
                          <p>reviews:{review.Comment}</p>
                        </div>
                      ))}
                    </div>
                }
              </div>
          ))
        }
      </div>
    </>
  );
};

export default AllListings;

import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@material-ui/core/Button';

// create the searchBox
const SearchBox = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [bedrooms, setBedrooms] = React.useState({ min: 0, max: 10 });
  const [dateRange, setDateRange] = React.useState({ startDate: null, endDate: null });
  const [priceRange, setPriceRange] = React.useState({ min: 0, max: 1000 });
  const [sortByRating, setSortByRating] = React.useState(null); // 'highToLow' or 'lowToHigh'
  const [showAdvancedSearch, setShowAdvancedSearch] = React.useState(false);

  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

  const handleSearchClick = () => {
    const searchFilters = { searchTerm, bedrooms, dateRange, priceRange, sortByRating };
    onSearch(searchFilters);
  };

  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => { setSearchTerm(e.target.value); }}
        style={{ width: '40vw' }}
        fullWidth
        InputProps={{
          endAdornment: (
            <SearchIcon
              onClick={handleSearchClick}
              style={{ cursor: 'pointer' }}
            />
          ),
        }}
      />
      <Button color="primary" onClick={toggleAdvancedSearch}>Advanced Search</Button>
      {showAdvancedSearch && (
        <div>
          <TextField
            label="Number of 🛏️"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => { setBedrooms(e.target.value); }}
            style={{ width: '40vw' }}
            fullWidth
            InputProps={{
              endAdornment: (
                <SearchIcon
                  onClick={handleSearchClick}
                  style={{ cursor: 'pointer' }}
                />
              ),
            }}
          />
          {/* 日期范围输入 */}
          <TextField
            label="Date Range"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => { setDateRange(e.target.value); }}
            style={{ width: '40vw' }}
            fullWidth
            InputProps={{
              endAdornment: (
                <SearchIcon
                  onClick={handleSearchClick}
                  style={{ cursor: 'pointer' }}
                />
              ),
            }}
          />
          {/* 价格范围输入 */}
          <TextField
            label="Price Range"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => { setPriceRange(e.target.value); }}
            style={{ width: '40vw' }}
            fullWidth
            InputProps={{
              endAdornment: (
                <SearchIcon
                  onClick={handleSearchClick}
                  style={{ cursor: 'pointer' }}
                />
              ),
            }}
          />
          {/* 评论评分排序选项 */}
          <TextField
            label="Rating"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => { setSortByRating(e.target.value); }}
            style={{ width: '40vw' }}
            fullWidth
            InputProps={{
              endAdornment: (
                <SearchIcon
                  onClick={handleSearchClick}
                  style={{ cursor: 'pointer' }}
                />
              ),
            }}
          />
        </div>
      )}
    </div>
  );
};

export const AllListings = () => {
  const [listings, setListings] = React.useState([]);
  const [myListings, setMyListings] = React.useState([]);
  const [originalListings, setOriginalListings] = React.useState([]);
  const owner = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  console.log(owner);
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
        setOriginalListings(data.listings);
        console.log('all listings')
        console.log(data.listings);
      }
    };

    fetchListings();
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
          if (data.listings) {
            // done after booking
            const filteredListings = data.listings.filter(listing => listing.owner === owner);
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
  }, []);
  // sort the order
  const sortedListings = [...myListings, ...listings]
    .sort((a, b) => {
      if (listings.includes(a) && !myListings.includes(b)) {
        return -1;
      }
      if (!myListings.includes(a) && listings.includes(b)) {
        return 1;
      }
      return a.title.localeCompare(b.title);
    });
  // search function
  const handleSearch = (searchTerm) => {
    if (searchTerm === '') {
      setListings(originalListings);
    } else {
      const filteredListings = originalListings.filter((listing => listing.title.toLowerCase().includes(searchTerm.toLowerCase())) || (listing => listing.address.toLowerCase().includes(searchTerm.toLowerCase())));
      setListings(filteredListings);
    }
  };
  return (
    <>
      <Typography variant="h3" gutterBottom>All Listings</Typography>
      <SearchBox onSearch={handleSearch} />
      <div>
        {listings.length === 0
          ? <p>No listings available</p>
          : sortedListings.map((listing) => (
              <div key={listing.id}>
                <hr />
                <h2>{listing.title}</h2>
                {localStorage.getItem('token')
                  ? (
                  <>
                  </>
                    )
                  : (
                      null
                    )}
                <img src={listing.thumbnail} alt={listing.title} />
                <p>reviews:{listing.reviews}</p>
                <p>Price: ${listing.price}</p>
              </div>
          ))
        }
      </div>
    </>
  );
};

export default AllListings;

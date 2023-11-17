import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// used for geting default date as today
const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
// create the searchBox
const SearchBox = ({ onSearch, showAdvancedSearch, setShowAdvancedSearch }) => {
  const [title, setTitle] = React.useState(''); // title used for both searching title and suburb
  const [bedrooms, setBedrooms] = React.useState(0);
  const [priceRange, setPriceRange] = React.useState([0, 2000]);
  const [sortByRating, setSortByRating] = React.useState(true); // 'highToLow' or 'lowToHigh' true for hith2low
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const handleSearchClick = () => {
    let dateRange = {}
    if (startDate && endDate) {
      // Check for errors
      if (endDate <= startDate) {
        window.alert('End date must be greater than start date.');
      } else if (startDate < getFormattedDate()) {
        window.alert('You are putting in a passed date!');
      } else {
        dateRange = {
          SrartDate: startDate,
          EndDate: endDate
        }
      }
    }
    console.log(title, bedrooms, dateRange, priceRange, sortByRating);
    const searchFilters = { title, bedrooms, dateRange, priceRange, sortByRating };
    onSearch(searchFilters);
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
  const dateclasses = dateStyles();

  // styles for pick rating order
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
    <div>
      <TextField
        label="Search"
        variant="outlined"
        value={title}
        onChange={(e) => { setTitle(e.target.value); }}
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
      <Button color="primary" onClick={() => { setShowAdvancedSearch(!showAdvancedSearch); }}>Advanced Search</Button>
      {showAdvancedSearch && (
        <div>
          <br />
          {/* Number of Bedrooms */}
          <Typography id="bedrooms-slider" gutterBottom>
            Number of bedrooms: {bedrooms}
          </Typography>
          <Slider
            value={typeof bedrooms === 'number' ? bedrooms : 0}
            onChange={(e, newValue) => {
              setBedrooms(newValue);
            }}
            aria-labelledby="bedrooms-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={10}
            style={{ width: '40vw' }}
          />
          <br />
          {/* Date range */}
          <form className={dateclasses.container} noValidate style={{ marginTop: '2vh' }}>
            <TextField
              id = "date"
              label = "StartDate"
              type = "date"
              value = { startDate }
              onChange = {e => { setStartDate(e.target.value) }}
              className = { dateclasses.textField }
              InputLabelProps = {{
                shrink: true,
              }}
            />
          </form>
          <form className={dateclasses.container} noValidate style={{ marginTop: '2vh' }}>
            <TextField
              id="date"
              label="EndDate"
              type="date"
              value = { endDate }
              onChange = {e => { setEndDate(e.target.value) }}
              className={dateclasses.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
          <br />
          {/* Price Range */}
          <Typography gutterBottom>Price Range: ${ priceRange[0] } – ${ priceRange[1] } </Typography>
          <Slider
            value={priceRange}
            onChange={(e, newValue) => { setPriceRange(newValue) }}
            valueLabelDisplay="auto"
            min={0}
            max={2000}
            aria-labelledby="range-slider"
            getAriaValueText={(value) => `$${value}`}
            style={{ width: '40vw' }}
          />
          <br />
          {/* rating sort order */}
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Rate Sorting Order</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sortByRating}
              onChange={(e) => { setSortByRating(e.target.value); }}
              style={{ width: '30vw' }}
            >
              <MenuItem value={true}>High to Low</MenuItem>
              <MenuItem value={false}>Low to High</MenuItem>
            </Select>
          </FormControl>
        </div>
      )}
    </div>
  );
};

export const AllListings = () => {
  const [listings, setListings] = React.useState([]);
  const [myListings, setMyListings] = React.useState([]);
  const [originalListings, setOriginalListings] = React.useState([]);
  const [allListings, setAllListings] = React.useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = React.useState(false);
  const [searchTerms, setSearchTerms] = React.useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const owner = localStorage.getItem('email');
  console.log(owner);
  setMyListings([]);
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
            return data.listing.published ? { id: listing.id, data } : null;
          }
        })
      );
      const validListings = updatedListings.filter(listing => listing !== null);
      console.log(validListings);
      setListings(prevListings => [...prevListings, ...validListings]);
      setOriginalListings(prevOriginalListings => [...prevOriginalListings, ...validListings]);
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
          // const filterMyListing = data.bookings.filter(booking => booking.owner === owner)
          // if (filterMyListing.length !== 0) {
          //   // add the listing with booking status accpet/pending to myListings
          //   console.log(filterMyListing);
          //   const filteredListings = filterMyListing.filter(booking => booking.status === 'accpted' || booking.status === 'pending');
          //   setMyListings(filteredListings);
          //   console.log('my listings')
          //   console.log(data.listings);
          // } else {
          //   // no booking yet
          //   console.log('No bookings yet');
          // }
        }
      };
      fetchMyListings();
    }
  }, []);
  console.log(myListings);
  console.log(listings);
  // sort the order with booking status accpet/pending first, then alphabet order
  const sortedListings = [...myListings, ...listings]
    .sort((a, b) => {
      // make the numeric title at the last
      const isNumeric = (str) => /^\d+$/.test(str);
      if (isNumeric(a.title) && !isNumeric(b.title)) {
        return 1;
      }
      if (!isNumeric(a.title) && isNumeric(b.title)) {
        return -1;
      }
      // make the listing I've booked at the front
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
  return (
    <>
      <Typography variant="h3" gutterBottom>All Listings</Typography>
      <SearchBox onSearch={handleSearch}
        showAdvancedSearch={showAdvancedSearch}
        setShowAdvancedSearch={setShowAdvancedSearch} />
      <div>
        {listings.length === 0
          ? <p>No listings available</p>
          : uniqueListings.map((listing) => (
              <div key={listing.id} onClick={ () => { navigate(`/listing/${listing.id}`, { state: { data: listing } }); }}>
                <hr />
                <h2>{listing.data.listing.title}</h2>
                {localStorage.getItem('token')
                  ? (
                  <>
                  </>
                    )
                  : (
                      null
                    )}
                <img src={listing.data.listing.thumbnail} alt={listing.data.listing.title} />
                <p>reviews:{listing.data.listing.reviews}</p>
              </div>
          ))
        }
      </div>
    </>
  );
};

export default AllListings;

import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@material-ui/core/Button';
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
// create the searchBox and this component is designed for showing the advanced search area and pack all searching limitations and returned to onsearch fuction, and using it to search
export const SearchBox = ({ onSearch, showAdvancedSearch, setShowAdvancedSearch, handleCancelSearch }) => {
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
    console.log(searchFilters);
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
      <Button color="primary" onClick={() => { handleCancelSearch() }}>Cancel Search</Button>
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

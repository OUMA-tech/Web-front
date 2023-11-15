import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

export const Dashboard = (props) => {
  const navigate = useNavigate()
  React.useEffect(() => {
    if (!props.token) {
      navigate('/');
    }
  }, [props.token, navigate]);
  return (
    <>
      Dashboard! <br />
      <Button color="primary" onClick={() => navigate('/')}>All Listings</Button>
      {'\u00A0'}|{'\u00A0'}
      <Button color="primary" onClick={() => navigate('/hosted-listings')}>Hosted Listings</Button>
    </>
  )
}

export default Dashboard;

import React from 'react';
import Typography from '@mui/material/Typography';

export const Footer = () => {
  return (
    <Typography
      variant="caption"
      display="block"
      gutterBottom
      sx={{
        textAlign: 'center'
      }}
    >
    Airbrb 2023 ©
    </Typography>
  )
}

export default Footer;

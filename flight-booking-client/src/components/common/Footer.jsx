import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ py: 2, textAlign: 'center', bgcolor: 'grey.200', mt: 'auto' }}>
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Flight Booking System. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
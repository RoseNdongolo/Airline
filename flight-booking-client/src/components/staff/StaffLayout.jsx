import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemText, Divider } from '@mui/material';
import SearchFlight from '../common/SearchFlight';
import BookingForm from '../common/BookingForm';
import MyBooking from '../common/MyBooking';
import Payment from '../common/Payment';
import ManagePayment from './ManagePayment';
import Profile from '../common/Profile';
import NotFound from '../common/NotFound';
import Footer from '../common/Footer';

const StaffLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar navigation */}
      <Box sx={{ width: 220, bgcolor: 'grey.100', p: 2 }}>
        <List>
          <ListItemButton component={Link} to="search">
            <ListItemText primary="Search Flights" />
          </ListItemButton>
          <ListItemButton component={Link} to="mybooking">
            <ListItemText primary="My Bookings" />
          </ListItemButton>
          <ListItemButton component={Link} to="payments">
            <ListItemText primary="Manage Payments" />
          </ListItemButton>
          <ListItemButton component={Link} to="profile">
            <ListItemText primary="Profile" />
          </ListItemButton>
        </List>
        <Divider />
        <List>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route index element={<Navigate to="search" />} />
          <Route path="search" element={<SearchFlight />} />
          <Route path="booking/:flightId" element={<BookingForm />} />
          <Route path="mybooking" element={<MyBooking />} />
          <Route path="payment/:bookingId" element={<Payment />} />
          <Route path="payments" element={<ManagePayment />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Box>
    </Box>
  );
};

export default StaffLayout;

import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemText, Divider } from '@mui/material';
import ManageAircraft from './ManageAircraft';
import ManageAirports from './ManageAirports';
import ManageAirlines from './ManageAirlines';
import ManageFlights from './ManageFlights';
import ManageBookings from './ManageBookings';
import ViewPayments from './ViewPayments';
import NotFound from '../common/NotFound';
import Footer from '../common/Footer';

const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: 220, bgcolor: 'grey.100', p: 2 }}>
        <List>
          <ListItemButton component={Link} to="flights">
            <ListItemText primary="Manage Flights" />
          </ListItemButton>
          <ListItemButton component={Link} to="aircraft">
            <ListItemText primary="Aircraft" />
          </ListItemButton>
          <ListItemButton component={Link} to="airports">
            <ListItemText primary="Airports" />
          </ListItemButton>
          <ListItemButton component={Link} to="airlines">
            <ListItemText primary="Airlines" />
          </ListItemButton>
          <ListItemButton component={Link} to="bookings">
            <ListItemText primary="Bookings" />
          </ListItemButton>
          <ListItemButton component={Link} to="payments">
            <ListItemText primary="Payments" />
          </ListItemButton>
        </List>
        <Divider />
        <List>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route index element={<Navigate to="flights" />} />
          <Route path="aircraft" element={<ManageAircraft />} />
          <Route path="airports" element={<ManageAirports />} />
          <Route path="airlines" element={<ManageAirlines />} />
          <Route path="flights" element={<ManageFlights />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="payments" element={<ViewPayments />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Box>
    </Box>
  );
};

export default AdminLayout;

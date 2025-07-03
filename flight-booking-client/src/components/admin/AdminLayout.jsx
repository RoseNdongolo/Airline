import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemText, Divider } from '@mui/material';
import ManageAircraft from './ManageAircraft';
import ManageAirports from './ManageAirports';
import ManageAirlines from './ManageAirlines';
import ManageFlights from './ManageFlights';
import ManageBookings from './ManageBookings';
import ViewPayments from './ViewPayments';
import NotFound from '../common/NotFound';
import FlightForm from './FlightForm';
import useAuth from '../../context/useAuth';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: 220, bgcolor: 'grey.100', p: 2 }}>
        <List>
          <ListItemButton component={Link} to="/admin/flights">
            <ListItemText primary="Manage Flights" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/aircraft">
            <ListItemText primary="Aircraft" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/airports">
            <ListItemText primary="Airports" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/airlines">
            <ListItemText primary="Airlines" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/bookings">
            <ListItemText primary="Bookings" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/payments">
            <ListItemText primary="Payments" />
          </ListItemButton>
        </List>
        <Divider />
        <List>
          <ListItemButton
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route index element={<Navigate to="/admin/flights" />} />
          <Route path="aircraft" element={<ManageAircraft />} />
          <Route path="airports" element={<ManageAirports />} />
          <Route path="airlines" element={<ManageAirlines />} />
          <Route path="flights" element={<ManageFlights />} />
          <Route path="flights/new" element={<FlightForm />} />
          <Route path="flights/edit/:id" element={<FlightForm editMode />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="payments" element={<ViewPayments />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminLayout;
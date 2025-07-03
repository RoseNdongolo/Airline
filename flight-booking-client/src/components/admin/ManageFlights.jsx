import { useEffect, useState } from 'react';
import {
  Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, IconButton, CircularProgress
} from '@mui/material';
import { flightApi } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ManageFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    flightApi.searchFlights({}, token)
      .then(setFlights)
      .catch(err => console.error('Error fetching flights', err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await flightApi.deleteFlight(id, token);
      setFlights(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Unable to delete flight');
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 5, mx: 'auto', display: 'block' }} />;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Manage Flights</Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => navigate('/admin/flights/new')}
      >
        Add New Flight
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Flight No.</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Departure</TableCell>
            <TableCell>Arrival</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Seats</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flights.map(flight => (
            <TableRow key={flight.id}>
              <TableCell>{flight.flight_number}</TableCell>
              <TableCell>{flight.departure_airport?.code}</TableCell>
              <TableCell>{flight.arrival_airport?.code}</TableCell>
              <TableCell>{new Date(flight.departure_time).toLocaleString()}</TableCell>
              <TableCell>{new Date(flight.arrival_time).toLocaleString()}</TableCell>
              <TableCell>${flight.base_price}</TableCell>
              <TableCell>{flight.available_seats}</TableCell>
              <TableCell>
                <IconButton onClick={() => navigate(`/admin/flights/edit/${flight.id}`)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(flight.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ManageFlights;

import { useEffect, useState } from 'react';
import {
  Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, IconButton, CircularProgress, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { flightApi } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ManageFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    flightApi
      .searchFlights({}, token)
      .then((data) => {
        setFlights(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching flights:', err);
        setError('Failed to load flights. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async () => {
    try {
      await flightApi.deleteFlight(selectedFlightId, token);
      setFlights((prev) => prev.filter((f) => f.id !== selectedFlightId));
      setError(null);
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Unable to delete flight. Please try again.');
    } finally {
      setOpenDialog(false);
      setSelectedFlightId(null);
    }
  };

  const handleOpenDialog = (id) => {
    setSelectedFlightId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFlightId(null);
  };

  const handleCloseSnackbar = () => setError(null);

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
      {flights.length === 0 ? (
        <Typography>No flights found.</Typography>
      ) : (
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
            {flights.map((flight) => (
              <TableRow key={flight.id}>
                <TableCell>{flight.flight_number || 'N/A'}</TableCell>
                <TableCell>{flight.departure_airport?.code || 'N/A'}</TableCell>
                <TableCell>{flight.arrival_airport?.code || 'N/A'}</TableCell>
                <TableCell>
                  {flight.departure_time
                    ? new Date(flight.departure_time).toLocaleString()
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {flight.arrival_time
                    ? new Date(flight.arrival_time).toLocaleString()
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {flight.base_price ? `$${flight.base_price}` : 'N/A'}
                </TableCell>
                <TableCell>{flight.available_seats || '0'}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/admin/flights/edit/${flight.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDialog(flight.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this flight? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ManageFlights;
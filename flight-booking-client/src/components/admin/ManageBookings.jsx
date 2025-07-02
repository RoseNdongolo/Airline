import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { bookingApi } from '../../api/api.js'; // Adjust the import path as necessary
import useAuth from '../../context/useAuth';

const ManageBookings = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    bookingApi.getBookings(token)
      .then(data => setBookings(data))
      .catch(() => setError('Failed to fetch bookings'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleConfirm = async (id) => {
    try {
      await bookingApi.updateBooking(id, { status: 'confirmed' }, token);
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'confirmed' } : b));
    } catch (err) {
      console.error(err);
      setError('Failed to confirm booking');
    }
  };

  const handleDelete = async (id) => {
    try {
      await bookingApi.deleteBooking(id, token);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete booking');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>Manage Bookings</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Booking Reference</TableCell>
            <TableCell>Flight</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map(booking => (
            <TableRow key={booking.id}>
              <TableCell>{booking.booking_reference}</TableCell>
              <TableCell>{booking.flight.flight_number}</TableCell>
              <TableCell>{booking.user.username}</TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>
                {booking.status === 'pending' && (
                  <Button onClick={() => handleConfirm(booking.id)}>Confirm</Button>
                )}
                <Button color="error" onClick={() => handleDelete(booking.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ManageBookings;
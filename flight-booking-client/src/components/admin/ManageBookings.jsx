import { useEffect, useState } from 'react';
import {
  Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, CircularProgress
} from '@mui/material';
import useAuth from '../../context/useAuth';
import { bookingApi } from '../../api/api';

const ManageBookings = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    bookingApi.getBookings(token)
      .then(setBookings)
      .catch(err => console.error('Failed to load bookings:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const updateBookingStatus = async (id, status) => {
    try {
      await bookingApi.updateBooking(id, { status }, token);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Manage Bookings</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Reference</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Flight</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Seats</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map(booking => (
            <TableRow key={booking.id}>
              <TableCell>{booking.booking_reference}</TableCell>
              <TableCell>{booking.user?.username}</TableCell>
              <TableCell>{booking.flight?.flight_number}</TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>{booking.seats_booked}</TableCell>
              <TableCell>
                {booking.status === 'pending' && (
                  <>
                    <Button onClick={() => updateBookingStatus(booking.id, 'confirmed')} color="success" variant="contained" size="small" sx={{ mr: 1 }}>
                      Confirm
                    </Button>
                    <Button onClick={() => updateBookingStatus(booking.id, 'cancelled')} color="error" variant="outlined" size="small">
                      Cancel
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ManageBookings;

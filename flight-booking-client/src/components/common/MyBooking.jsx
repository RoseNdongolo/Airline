import {
  Box, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, Button, Paper, CircularProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import { bookingApi } from '../../api/api';
import useAuth from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

const MyBooking = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.getBookings(token)
      .then(setBookings)
      .catch(err => console.error('Failed to load bookings', err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await bookingApi.deleteBooking(id, token);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed: only pending bookings can be removed.');
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 5, mx: 'auto', display: 'block' }} />;

  return (
    <Paper sx={{ maxWidth: '95%', mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>My Bookings</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Reference</TableCell>
            <TableCell>Flight</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Seats</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Passengers</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map(booking => (
            <TableRow key={booking.id}>
              <TableCell>{booking.booking_reference}</TableCell>
              <TableCell>
                {booking.flight?.flight_number} – {booking.flight?.flight_type}
              </TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>{booking.seats_booked}</TableCell>
              <TableCell>${booking.total_price}</TableCell>
              <TableCell>
                {(booking.passengers || []).map((p, i) => (
                  <Typography variant="body2" key={i}>
                    {p.first_name} {p.last_name}
                  </Typography>
                ))}
              </TableCell>
              <TableCell align="center">
                {booking.status === 'pending' && (
                  <>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/customer/editbooking/${booking.id}`)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(booking.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => navigate(`/customer/payment/${booking.id}`)}
                  >
                    Pay
                  </Button>
                )}
                {booking.status === 'completed' && (
                  <Typography variant="caption" color="success.main">
                    Paid & Confirmed
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default MyBooking;

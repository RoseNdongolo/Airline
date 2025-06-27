import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import apiClient from '../../api/index';
import { useAuth } from '../../context/useAuth';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await apiClient.get('/bookings/');
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <TableContainer component={Paper} sx={{ mt: 4, mx: 'auto', maxWidth: 1200 }}>
      <Typography variant="h5" sx={{ p: 2 }}>My Bookings</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Flight Number</TableCell>
            <TableCell>Airline</TableCell>
            <TableCell>Route</TableCell>
            <TableCell>Departure</TableCell>
            <TableCell>Seats Booked</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.flight.flight_number}</TableCell>
              <TableCell>{booking.flight.airline.name}</TableCell>
              <TableCell>{booking.flight.departure_airport.code} → {booking.flight.arrival_airport.code}</TableCell>
              <TableCell>{new Date(booking.flight.departure_time).toLocaleString()}</TableCell>
              <TableCell>{booking.seats_booked}</TableCell>
              <TableCell>
                <Button onClick={() => navigate(`/customer/bookings/${booking.id}`)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyBookings;
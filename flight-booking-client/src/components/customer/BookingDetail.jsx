import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Button,
  List, ListItem, ListItemText, Box
} from '@mui/material';
import { getBooking, cancelBooking } from '../../api/bookings';
import { format } from 'date-fns';

const BookingDetail = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await getBooking(bookingId);
        setBooking(data);
      } catch {
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleCancel = async () => {
    try {
      await cancelBooking(bookingId);
      setBooking(prev => ({ ...prev, status: 'cancelled' }));
    } catch {
      setError('Failed to cancel booking');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!booking) return <div>{error || 'Booking not found'}</div>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Booking Details: {booking.booking_reference}
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Flight Information
        </Typography>
        <Typography>
          <strong>Airline:</strong> {booking.flight?.airline?.name}
        </Typography>
        <Typography>
          <strong>Flight Number:</strong> {booking.flight?.flight_number}
        </Typography>
        <Typography>
          <strong>From:</strong> {booking.flight?.departure_airport?.code} - {booking.flight?.departure_airport?.name}
        </Typography>
        <Typography>
          <strong>To:</strong> {booking.flight?.arrival_airport?.code} - {booking.flight?.arrival_airport?.name}
        </Typography>
        <Typography>
          <strong>Departure:</strong> {format(new Date(booking.flight?.departure_time), 'MMM dd, yyyy hh:mm a')}
        </Typography>
        <Typography>
          <strong>Arrival:</strong> {format(new Date(booking.flight?.arrival_time), 'MMM dd, yyyy hh:mm a')}
        </Typography>
        <Typography>
          <strong>Aircraft:</strong> {booking.flight?.aircraft?.model} ({booking.flight?.aircraft?.registration_number})
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Booking Summary
        </Typography>
        <Typography>
          <strong>Booking Date:</strong> {format(new Date(booking.booking_date), 'MMM dd, yyyy hh:mm a')}
        </Typography>
        <Typography>
          <strong>Status:</strong> {booking.status}
        </Typography>
        <Typography>
          <strong>Seats Booked:</strong> {booking.seats_booked}
        </Typography>
        <Typography>
          <strong>Total Price:</strong> ${booking.total_price}
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Passengers
        </Typography>
        <List>
          {booking.passengers?.map((passenger, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${passenger.first_name} ${passenger.last_name}`}
                secondary={
                  <>
                    <Typography component="span" display="block">
                      Passport: {passenger.passport_number || 'Not provided'}
                    </Typography>
                    <Typography component="span" display="block">
                      Date of Birth: {format(new Date(passenger.date_of_birth), 'MMM dd, yyyy')}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        {booking.status === 'confirmed' && (
          <Button variant="contained" color="error" onClick={handleCancel}>
            Cancel Booking
          </Button>
        )}
        <Button variant="outlined" onClick={() => navigate('/customer/bookings')}>
          Back to My Bookings
        </Button>
      </Box>
    </Container>
  );
};

export default BookingDetail;

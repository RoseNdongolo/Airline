import { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Box
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { flightApi, bookingApi } from '../../api/api';

const BookingForm = () => {
  const { token } = useAuth();
  const { flightId } = useParams();
  const navigate = useNavigate();

  const [flight, setFlight] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [newPassenger, setNewPassenger] = useState({
    first_name: '',
    last_name: '',
    passport_number: '',
    date_of_birth: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    flightApi.getFlight(flightId, token).then(setFlight);
  }, [flightId, token]);

  const handleAddPassenger = () => {
    const { first_name, last_name, passport_number, date_of_birth } = newPassenger;
    if (first_name && last_name && passport_number && date_of_birth) {
      setPassengers([...passengers, newPassenger]);
      setNewPassenger({ first_name: '', last_name: '', passport_number: '', date_of_birth: '' });
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const payload = {
        flight_id: flightId,
        passengers,
        seats_booked: passengers.length
      };
      const booking = await bookingApi.createBooking(payload, token);
      navigate(`/customer/payment/${booking.id}`);
    } catch (err) {
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!flight) return <CircularProgress sx={{ display: 'block', mt: 5, mx: 'auto' }} />;

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Typography variant="h6" gutterBottom>
        Booking for Flight {flight.flight_number}
      </Typography>

      <Box mt={2}>
        <TextField
          label="First Name"
          fullWidth
          value={newPassenger.first_name}
          onChange={(e) =>
            setNewPassenger({ ...newPassenger, first_name: e.target.value })
          }
          margin="dense"
        />
        <TextField
          label="Last Name"
          fullWidth
          value={newPassenger.last_name}
          onChange={(e) =>
            setNewPassenger({ ...newPassenger, last_name: e.target.value })
          }
          margin="dense"
        />
        <TextField
          label="Passport Number"
          fullWidth
          value={newPassenger.passport_number}
          onChange={(e) =>
            setNewPassenger({ ...newPassenger, passport_number: e.target.value })
          }
          margin="dense"
        />
        <TextField
          label="Date of Birth"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={newPassenger.date_of_birth}
          onChange={(e) =>
            setNewPassenger({ ...newPassenger, date_of_birth: e.target.value })
          }
          margin="dense"
        />
        <Button onClick={handleAddPassenger} sx={{ mt: 1 }}>
          Add Passenger
        </Button>
      </Box>

      {passengers.length > 0 && (
        <Box mt={3}>
          <Typography variant="subtitle1">Passengers Added:</Typography>
          {passengers.map((p, index) => (
            <Typography key={index}>
              • {p.first_name} {p.last_name} – {p.passport_number} (DOB: {p.date_of_birth})
            </Typography>
          ))}
        </Box>
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        disabled={loading || passengers.length === 0}
        onClick={handleConfirm}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}
      </Button>
    </Paper>
  );
};

export default BookingForm;

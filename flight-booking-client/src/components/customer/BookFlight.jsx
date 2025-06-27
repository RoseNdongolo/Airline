import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button,
  Grid, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getFlight, createBooking } from '../../api/bookings';
import { useAuth } from '../../context/useAuth';

const BookFlight = () => {
  const { flightId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seats, setSeats] = useState(1);
  const [passengers, setPassengers] = useState([
    {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      passport_number: '',
      date_of_birth: null
    }
  ]);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const { data } = await getFlight(flightId);
        setFlight(data);
      } catch {
        setError('Failed to load flight details');
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [flightId]);

  useEffect(() => {
    setPassengers(prev => {
      if (seats > prev.length) {
        const extra = Array.from({ length: seats - prev.length }, () => ({
          first_name: '',
          last_name: '',
          passport_number: '',
          date_of_birth: null
        }));
        return [...prev, ...extra];
      } else if (seats < prev.length) {
        return prev.slice(0, seats);
      }
      return prev;
    });
  }, [seats]);

  const handlePassengerChange = (index, field, value) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      const bookingData = {
        flight: flightId,
        seats_booked: seats,
        passengers: passengers.map(p => ({
          ...p,
          date_of_birth: p.date_of_birth ? p.date_of_birth.toISOString().split('T')[0] : ''
        }))
      };
      await createBooking(bookingData);
      navigate('/customer/bookings');
    } catch (err) {
      setError('Failed to create booking');
      console.error(err);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!flight) return <Typography>{error || 'Flight not found'}</Typography>;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Book Flight: {flight.airline?.name} {flight.flight_number}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {flight.departure_airport?.code} to {flight.arrival_airport?.code}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Departure: {new Date(flight.departure_time).toLocaleString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Arrival: {new Date(flight.arrival_time).toLocaleString()}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Price: ${flight.base_price * seats}
          </Typography>

          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Number of Seats</InputLabel>
            <Select
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              label="Number of Seats"
            >
              {[...Array(flight.available_seats).keys()].map((n) => (
                <MenuItem key={n + 1} value={n + 1}>
                  {n + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Passenger Details
          </Typography>

          {passengers.map((passenger, index) => (
            <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Passenger {index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={passenger.first_name}
                    onChange={(e) =>
                      handlePassengerChange(index, 'first_name', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={passenger.last_name}
                    onChange={(e) =>
                      handlePassengerChange(index, 'last_name', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Passport Number"
                    value={passenger.passport_number}
                    onChange={(e) =>
                      handlePassengerChange(index, 'passport_number', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date of Birth"
                    value={passenger.date_of_birth}
                    onChange={(date) =>
                      handlePassengerChange(index, 'date_of_birth', date)
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Confirm Booking
          </Button>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default BookFlight;
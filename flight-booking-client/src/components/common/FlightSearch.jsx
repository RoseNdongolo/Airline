import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { searchFlights } from '../../api/flights';
import FlightCard from './FlightCard';

const FlightSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    departure: '',
    arrival: '',
    date: null,
    passengers: 1,
    class: 'economy'
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchParams.departure || !searchParams.arrival || !searchParams.date) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formattedDate = searchParams.date.toISOString().split('T')[0];
      const { data } = await searchFlights(
        searchParams.departure,
        searchParams.arrival,
        formattedDate
      );
      setFlights(data);
    } catch (err) {
      setError('Failed to fetch flights. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (flightId) => {
    navigate(`/book/${flightId}`, {
      state: {
        passengers: searchParams.passengers,
        class: searchParams.class
      }
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Find Your Flight
          </Typography>
          
          <Grid container spacing={2}>
            {/* Departure Airport */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="From (City or Airport Code)"
                value={searchParams.departure}
                onChange={(e) => setSearchParams({
                  ...searchParams,
                  departure: e.target.value.toUpperCase()
                })}
              />
            </Grid>

            {/* Arrival Airport */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="To (City or Airport Code)"
                value={searchParams.arrival}
                onChange={(e) => setSearchParams({
                  ...searchParams,
                  arrival: e.target.value.toUpperCase()
                })}
              />
            </Grid>

            {/* Departure Date */}
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Departure Date"
                value={searchParams.date}
                onChange={(date) => setSearchParams({
                  ...searchParams,
                  date: date
                })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            {/* Passengers */}
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Passengers</InputLabel>
                <Select
                  value={searchParams.passengers}
                  onChange={(e) => setSearchParams({
                    ...searchParams,
                    passengers: e.target.value
                  })}
                  label="Passengers"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <MenuItem key={num} value={num}>{num}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Class */}
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  value={searchParams.class}
                  onChange={(e) => setSearchParams({
                    ...searchParams,
                    class: e.target.value
                  })}
                  label="Class"
                >
                  <MenuItem value="economy">Economy</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="first">First Class</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Search Button */}
            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSearch}
                disabled={loading}
                sx={{ height: '56px' }}
              >
                {loading ? 'Searching...' : 'Search Flights'}
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Paper>

        {/* Search Results */}
        {flights.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Available Flights ({flights.length})
            </Typography>
            {flights.map(flight => (
              <FlightCard 
                key={flight.id}
                flight={flight}
                onBook={() => handleBook(flight.id)}
                passengers={searchParams.passengers}
                classType={searchParams.class}
              />
            ))}
          </Box>
        )}

        {flights.length === 0 && !loading && (
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              {error ? error : 'Enter your travel details to search for flights'}
            </Typography>
          </Paper>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default FlightSearch;
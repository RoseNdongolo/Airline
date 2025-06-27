import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import apiClient from '../api/index';

const SearchFlights = () => {
  const [form, setForm] = useState({
    departure: '',
    arrival: '',
    date: null
  });
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await apiClient.get('/flights/', {
        params: {
          departure: form.departure,
          arrival: form.arrival,
          date: form.date ? form.date.toISOString().split('T')[0] : ''
        }
      });
      setFlights(response.data);
    } catch (err) {
      setError('Failed to search flights');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await apiClient.get('/airports/');
        setAirports(response.data);
      } catch (err) {
        setError('Failed to load airports');
        console.error(err);
      }
    };

    fetchAirports();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Search Flights</Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Departure Airport</InputLabel>
            <Select
              value={form.departure}
              onChange={(e) => handleChange('departure', e.target.value)}
              label="Departure Airport"
            >
              {airports.map((airport) => (
                <MenuItem key={airport.id} value={airport.code}>{airport.code}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Arrival Airport</InputLabel>
            <Select
              value={form.arrival}
              onChange={(e) => handleChange('arrival', e.target.value)}
              label="Arrival Airport"
            >
              {airports.map((airport) => (
                <MenuItem key={airport.id} value={airport.code}>{airport.code}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <DatePicker
            label="Travel Date"
            value={form.date}
            onChange={(date) => handleChange('date', date)}
            slotProps={{ textField: { fullWidth: true, sx: { mt: 2 } } }}
          />
          <Button variant="contained" onClick={handleSubmit} fullWidth sx={{ mt: 2 }}>
            Search
          </Button>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          {flights.length > 0 && (
            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ p: 2 }}>Available Flights</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Flight Number</TableCell>
                    <TableCell>Airline</TableCell>
                    <TableCell>Route</TableCell>
                    <TableCell>Departure</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {flights.map((flight) => (
                    <TableRow key={flight.id}>
                      <TableCell>{flight.flight_number}</TableCell>
                      <TableCell>{flight.airline.name}</TableCell>
                      <TableCell>{flight.departure_airport.code} → {flight.arrival_airport.code}</TableCell>
                      <TableCell>{new Date(flight.departure_time).toLocaleString()}</TableCell>
                      <TableCell>${flight.base_price}</TableCell>
                      <TableCell>
                        <Button onClick={() => navigate(`/customer/book/${flight.id}`)}>
                          Book
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default SearchFlights;
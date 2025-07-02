import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { flightApi, aircraftApi, airportApi, airlineApi } from '../../api/api.js'; // Adjust the import path as necessary
import useAuth from '../../context/useAuth';

const ManageFlights = () => {
  const { token } = useAuth();
  const [flights, setFlights] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [formData, setFormData] = useState({
    flight_number: '',
    airline_id: '',
    aircraft: '',
    departure_airport_id: '',
    arrival_airport_id: '',
    departure_time: '',
    arrival_time: '',
    base_price: '',
    available_seats: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([flightApi.getFlights(token), aircraftApi.getAircrafts(token), airportApi.getAirports(token), airlineApi.getAirlines(token)])
      .then(([flightData, aircraftData, airportData, airlineData]) => {
        setFlights(flightData);
        setAircrafts(aircraftData);
        setAirports(airportData);
        setAirlines(airlineData);
      })
      .catch(() => setError('Failed to fetch data'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await flightApi.createFlight(formData, token);
      setFlights([...flights, formData]);
      setFormData({
        flight_number: '',
        airline_id: '',
        aircraft: '',
        departure_airport_id: '',
        arrival_airport_id: '',
        departure_time: '',
        arrival_time: '',
        base_price: '',
        available_seats: '',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to create flight');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await flightApi.updateFlight(id, data, token);
      setFlights(flights.map(f => f.id === id ? { ...f, ...data } : f));
    } catch (err) {
      console.error(err);
      setError('Failed to update flight');
    }
  };

  const handleDelete = async (id) => {
    try {
      await flightApi.deleteFlight(id, token);
      setFlights(flights.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete flight');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>Manage Flights</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Flight Number"
          name="flight_number"
          value={formData.flight_number}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Airline"
          name="airline_id"
          value={formData.airline_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {airlines.map(airline => (
            <option key={airline.id} value={airline.id}>{airline.name}</option>
          ))}
        </TextField>
        <TextField
          select
          label="Aircraft"
          name="aircraft"
          value={formData.aircraft}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {aircrafts.map(aircraft => (
            <option key={aircraft.id} value={aircraft.id}>{aircraft.model}</option>
          ))}
        </TextField>
        <TextField
          select
          label="Departure Airport"
          name="departure_airport_id"
          value={formData.departure_airport_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {airports.map(airport => (
            <option key={airport.id} value={airport.id}>{airport.code}</option>
          ))}
        </TextField>
        <TextField
          select
          label="Arrival Airport"
          name="arrival_airport_id"
          value={formData.arrival_airport_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {airports.map(airport => (
            <option key={airport.id} value={airport.id}>{airport.code}</option>
          ))}
        </TextField>
        <TextField
          label="Departure Time"
          name="departure_time"
          type="datetime-local"
          value={formData.departure_time}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Arrival Time"
          name="arrival_time"
          type="datetime-local"
          value={formData.arrival_time}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Base Price"
          name="base_price"
          type="number"
          value={formData.base_price}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Available Seats"
          name="available_seats"
          type="number"
          value={formData.available_seats}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Add Flight
        </Button>
      </form>
      <Table sx={{ mt: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>Flight Number</TableCell>
            <TableCell>Airline</TableCell>
            <TableCell>Route</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flights.map(flight => (
            <TableRow key={flight.id}>
              <TableCell>{flight.flight_number}</TableCell>
              <TableCell>{flight.airline.name}</TableCell>
              <TableCell>{flight.departure_airport.code} to {flight.arrival_airport.code}</TableCell>
              <TableCell>
                <Button onClick={() => handleUpdate(flight.id, flight)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(flight.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ManageFlights;
import { useState, useEffect } from 'react';
import {
  TextField, Button, Typography, Paper, MenuItem, CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { flightApi, airportApi, airlineApi, aircraftApi } from '../../api/api';

const FlightForm = ({ editMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({
    flight_number: '',
    departure_airport_id: '',
    arrival_airport_id: '',
    departure_time: '',
    arrival_time: '',
    base_price: '',
    available_seats: '',
    flight_type: 'economy',
    airline_id: '',
    aircraft: '',
  });

  const [loading, setLoading] = useState(true);
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [airportsData, airlineData, aircraftData] = await Promise.all([
          airportApi.getAirports(token),
          airlineApi.getAirlines(token),
          aircraftApi.getAircrafts(token),
        ]);
        setAirports(airportsData);
        setAirlines(airlineData);
        setAircrafts(aircraftData);

        if (editMode && id) {
          const data = await flightApi.getFlight(id, token);
          setForm({
            flight_number: data.flight_number,
            departure_airport_id: data.departure_airport?.id || '',
            arrival_airport_id: data.arrival_airport?.id || '',
            departure_time: data.departure_time,
            arrival_time: data.arrival_time,
            base_price: data.base_price,
            available_seats: data.available_seats,
            flight_type: data.flight_type,
            airline_id: data.airline?.id || '',
            aircraft: data.aircraft?.id || '',
          });
        }
      } catch (err) {
        console.error('Error fetching dropdown data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [editMode, id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await flightApi.updateFlight(id, form, token);
      } else {
        await flightApi.createFlight(form, token);
      }
      navigate('/admin/flights');
    } catch (err) {
      console.error('Flight save failed:', err);
      alert('Error saving flight — please check required fields');
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;

  return (
    <Paper sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {editMode ? 'Edit Flight' : 'Add New Flight'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Flight Number" name="flight_number" value={form.flight_number} onChange={handleChange} margin="normal" required />
        <TextField select fullWidth label="Departure Airport" name="departure_airport_id" value={form.departure_airport_id} onChange={handleChange} margin="normal" required>
          {airports.map(a => <MenuItem key={a.id} value={a.id}>{a.code} – {a.city}</MenuItem>)}
        </TextField>
        <TextField select fullWidth label="Arrival Airport" name="arrival_airport_id" value={form.arrival_airport_id} onChange={handleChange} margin="normal" required>
          {airports.map(a => <MenuItem key={a.id} value={a.id}>{a.code} – {a.city}</MenuItem>)}
        </TextField>
        <TextField type="datetime-local" fullWidth label="Departure Time" name="departure_time" value={form.departure_time} onChange={handleChange} margin="normal" required InputLabelProps={{ shrink: true }} />
        <TextField type="datetime-local" fullWidth label="Arrival Time" name="arrival_time" value={form.arrival_time} onChange={handleChange} margin="normal" required InputLabelProps={{ shrink: true }} />
        <TextField type="number" fullWidth label="Base Price" name="base_price" value={form.base_price} onChange={handleChange} margin="normal" required />
        <TextField type="number" fullWidth label="Available Seats" name="available_seats" value={form.available_seats} onChange={handleChange} margin="normal" required />
        <TextField select fullWidth label="Flight Type" name="flight_type" value={form.flight_type} onChange={handleChange} margin="normal">
          <MenuItem value="economy">Economy</MenuItem>
          <MenuItem value="business">Business</MenuItem>
          <MenuItem value="first_class">First Class</MenuItem>
        </TextField>
        <TextField select fullWidth label="Airline" name="airline_id" value={form.airline_id} onChange={handleChange} margin="normal" required>
          {airlines.map(a => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
        </TextField>
        <TextField select fullWidth label="Aircraft" name="aircraft" value={form.aircraft} onChange={handleChange} margin="normal">
          {aircrafts.map(ac => <MenuItem key={ac.id} value={ac.id}>{ac.model}</MenuItem>)}
        </TextField>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          {editMode ? 'Update Flight' : 'Create Flight'}
        </Button>
      </form>
    </Paper>
  );
};

export default FlightForm;

import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { aircraftApi, airlineApi } from '../../api/api.js'; // Adjust the import path as necessary
import useAuth from '../../context/useAuth';

const ManageAircraft = () => {
  const { token } = useAuth();
  const [aircrafts, setAircrafts] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [formData, setFormData] = useState({ airline: '', model: '', capacity: '', registration_number: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([aircraftApi.getAircrafts(token), airlineApi.getAirlines(token)])
      .then(([aircraftData, airlineData]) => {
        setAircrafts(aircraftData);
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
      await aircraftApi.createAircraft(formData, token);
      setAircrafts([...aircrafts, formData]);
      setFormData({ airline: '', model: '', capacity: '', registration_number: '' });
    } catch (err) {
      console.error(err);
      setError('Failed to create aircraft');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await aircraftApi.updateAircraft(id, data, token);
      setAircrafts(aircrafts.map(a => a.id === id ? { ...a, ...data } : a));
    } catch (err) {
      console.error(err);
      setError('Failed to update aircraft');
    }
  };

  const handleDelete = async (id) => {
    try {
      await aircraftApi.deleteAircraft(id, token);
      setAircrafts(aircrafts.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete aircraft');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>Manage Aircraft</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Capacity"
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Registration Number"
          name="registration_number"
          value={formData.registration_number}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Airline"
          name="airline"
          value={formData.airline}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {airlines.map(airline => (
            <option key={airline.id} value={airline.id}>{airline.name}</option>
          ))}
        </TextField>
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Add Aircraft
        </Button>
      </form>
      <Table sx={{ mt: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>Model</TableCell>
            <TableCell>Airline</TableCell>
            <TableCell>Capacity</TableCell>
            <TableCell>Registration</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {aircrafts.map(aircraft => (
            <TableRow key={aircraft.id}>
              <TableCell>{aircraft.model}</TableCell>
              <TableCell>{aircraft.airline.name}</TableCell>
              <TableCell>{aircraft.capacity}</TableCell>
              <TableCell>{aircraft.registration_number}</TableCell>
              <TableCell>
                <Button onClick={() => handleUpdate(aircraft.id, aircraft)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(aircraft.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ManageAircraft;
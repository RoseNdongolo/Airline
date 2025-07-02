import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { airportApi } from '../../api/api.js'; // Adjust the import path as necessary
import useAuth from '../../context/useAuth';

const ManageAirports = () => {
  const { token } = useAuth();
  const [airports, setAirports] = useState([]);
  const [formData, setFormData] = useState({ code: '', name: '', city: '', country: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    airportApi.getAirports(token)
      .then(data => setAirports(data))
      .catch(() => setError('Failed to fetch airports'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await airportApi.createAirport(formData, token);
      setAirports([...airports, formData]);
      setFormData({ code: '', name: '', city: '', country: '' });
    } catch (err) {
      console.error(err);
      setError('Failed to create airport');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await airportApi.updateAirport(id, data, token);
      setAirports(airports.map(a => a.id === id ? { ...a, ...data } : a));
    } catch (err) {
      console.error(err);
      setError('Failed to update airport');
    }
  };

  const handleDelete = async (id) => {
    try {
      await airportApi.deleteAirport(id, token);
      setAirports(airports.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete airport');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>Manage Airports</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Add Airport
        </Button>
      </form>
      <Table sx={{ mt: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {airports.map(airport => (
            <TableRow key={airport.id}>
              <TableCell>{airport.code}</TableCell>
              <TableCell>{airport.name}</TableCell>
              <TableCell>{airport.city}</TableCell>
              <TableCell>{airport.country}</TableCell>
              <TableCell>
                <Button onClick={() => handleUpdate(airport.id, airport)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(airport.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ManageAirports;
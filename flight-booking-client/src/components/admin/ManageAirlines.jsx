import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { airlineApi } from '../../api/api.js'; // Adjust the import path as necessary
import useAuth from '../../context/useAuth';

const ManageAirlines = () => {
  const { token } = useAuth();
  const [airlines, setAirlines] = useState([]);
  const [formData, setFormData] = useState({ name: '', logo: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    airlineApi.getAirlines(token)
      .then(data => setAirlines(data))
      .catch(() => setError('Failed to fetch airlines'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await airlineApi.createAirline(formData, token);
      setAirlines([...airlines, formData]);
      setFormData({ name: '', logo: null });
    } catch (err) {
      console.error(err);
      setError('Failed to create airline');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await airlineApi.updateAirline(id, data, token);
      setAirlines(airlines.map(a => a.id === id ? { ...a, ...data } : a));
    } catch (err) {
      console.error(err);
      setError('Failed to update airline');
    }
  };

  const handleDelete = async (id) => {
    try {
      await airlineApi.deleteAirline(id, token);
      setAirlines(airlines.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete airline');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>Manage Airlines</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Add Airline
        </Button>
      </form>
      <Table sx={{ mt: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {airlines.map(airline => (
            <TableRow key={airline.id}>
              <TableCell>{airline.name}</TableCell>
              <TableCell>
                <Button onClick={() => handleUpdate(airline.id, airline)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(airline.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ManageAirlines;
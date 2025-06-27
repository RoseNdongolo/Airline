import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Typography, TextField, Dialog, DialogActions, 
  DialogContent, DialogTitle, Select, MenuItem, InputLabel, FormControl 
} from '@mui/material';
import { getAircrafts, createAircraft, deleteAircraft } from '../../api/admin';
import { getAirlines } from '../../api/admin';

const Aircrafts = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newAircraft, setNewAircraft] = useState({
    airline: '',
    model: '',
    capacity: '',
    registration_number: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [aircraftsRes, airlinesRes] = await Promise.all([
        getAircrafts(),
        getAirlines()
      ]);
      setAircrafts(aircraftsRes.data);
      setAirlines(airlinesRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createAircraft(newAircraft);
      fetchData();
      setOpen(false);
      setNewAircraft({ airline: '', model: '', capacity: '', registration_number: '' });
    } catch (err) {
      console.error("Failed to create aircraft", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAircraft(id);
      fetchData();
    } catch (err) {
      console.error("Failed to delete aircraft", err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Typography variant="h5" sx={{ p: 2 }}>Aircraft Management</Typography>
        <Button variant="contained" sx={{ m: 2 }} onClick={() => setOpen(true)}>
          Add New Aircraft
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Registration</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Airline</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aircrafts.map((aircraft) => (
              <TableRow key={aircraft.id}>
                <TableCell>{aircraft.registration_number}</TableCell>
                <TableCell>{aircraft.model}</TableCell>
                <TableCell>{aircraft.airline.name}</TableCell>
                <TableCell>{aircraft.capacity}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(aircraft.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Aircraft</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Airline</InputLabel>
            <Select
              value={newAircraft.airline}
              onChange={(e) => setNewAircraft({...newAircraft, airline: e.target.value})}
            >
              {airlines.map((airline) => (
                <MenuItem key={airline.id} value={airline.id}>
                  {airline.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Model"
            fullWidth
            value={newAircraft.model}
            onChange={(e) => setNewAircraft({...newAircraft, model: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Registration Number"
            fullWidth
            value={newAircraft.registration_number}
            onChange={(e) => setNewAircraft({...newAircraft, registration_number: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Capacity"
            type="number"
            fullWidth
            value={newAircraft.capacity}
            onChange={(e) => setNewAircraft({...newAircraft, capacity: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Aircrafts;

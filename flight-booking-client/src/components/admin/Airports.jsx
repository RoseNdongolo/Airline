import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Typography, TextField, Dialog, DialogActions, 
  DialogContent, DialogTitle 
} from '@mui/material';
import { getAirports, createAirport, deleteAirport } from '../../api/admin';

const Airports = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newAirport, setNewAirport] = useState({
    code: '',
    name: '',
    city: '',
    country: ''
  });

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const { data } = await getAirports();
      setAirports(data);
    } catch (err) {
      console.error("Failed to fetch airports", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createAirport(newAirport);
      fetchAirports();
      setOpen(false);
      setNewAirport({ code: '', name: '', city: '', country: '' });
    } catch (err) {
      console.error("Failed to create airport", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAirport(id);
      fetchAirports();
    } catch (err) {
      console.error("Failed to delete airport", err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Typography variant="h5" sx={{ p: 2 }}>Airports Management</Typography>
        <Button variant="contained" sx={{ m: 2 }} onClick={() => setOpen(true)}>
          Add New Airport
        </Button>
        <Table>
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
            {airports.map((airport) => (
              <TableRow key={airport.id}>
                <TableCell>{airport.code}</TableCell>
                <TableCell>{airport.name}</TableCell>
                <TableCell>{airport.city}</TableCell>
                <TableCell>{airport.country}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(airport.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Airport</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Code (e.g., JFK)"
            fullWidth
            value={newAirport.code}
            onChange={(e) => setNewAirport({...newAirport, code: e.target.value.toUpperCase()})}
          />
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newAirport.name}
            onChange={(e) => setNewAirport({...newAirport, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="City"
            fullWidth
            value={newAirport.city}
            onChange={(e) => setNewAirport({...newAirport, city: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Country"
            fullWidth
            value={newAirport.country}
            onChange={(e) => setNewAirport({...newAirport, country: e.target.value})}
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

export default Airports;

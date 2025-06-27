import { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Typography
} from '@mui/material';
import { getAirlines, deleteAirline } from '../../api/admin';

const Airlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    try {
      const { data } = await getAirlines();
      setAirlines(data);
    } catch (err) {
      console.error("Failed to fetch airlines", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAirline(id);
      fetchAirlines();
    } catch (err) {
      console.error("Failed to delete airline", err);
    }
  };

  if (loading) {
    return <Typography sx={{ p: 2 }}>Loading airlines...</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" sx={{ p: 2 }}>Airlines Management</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {airlines.map((airline) => (
            <TableRow key={airline.id}>
              <TableCell>{airline.id}</TableCell>
              <TableCell>{airline.name}</TableCell>
              <TableCell>
                <Button color="error" onClick={() => handleDelete(airline.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Airlines;

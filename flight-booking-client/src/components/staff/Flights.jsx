import { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Select,
  MenuItem, Typography
} from '@mui/material';
import { getStaffFlights, updateFlightStatus } from '../../api/staff';

const StaffFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const { data } = await getStaffFlights();
      setFlights(data);
    } catch (err) {
      console.error("Failed to fetch flights", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (flightId, status) => {
    try {
      await updateFlightStatus(flightId, { status });
      fetchFlights();
    } catch (err) {
      console.error("Failed to update flight status", err);
    }
  };

  if (loading) {
    return (
      <Typography sx={{ p: 2 }}>
        Loading flights...
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" sx={{ p: 2 }}>Manage Flights</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Flight No.</TableCell>
            <TableCell>Route</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flights.map((flight) => (
            <TableRow key={flight.id}>
              <TableCell>{flight.flight_number}</TableCell>
              <TableCell>
                {flight.departure_airport?.code || 'N/A'} → {flight.arrival_airport?.code || 'N/A'}
              </TableCell>
              <TableCell>
                <Select
                  value={flight.status || "scheduled"}
                  onChange={(e) => handleStatusChange(flight.id, e.target.value)}
                >
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="boarding">Boarding</MenuItem>
                  <MenuItem value="delayed">Delayed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StaffFlights;

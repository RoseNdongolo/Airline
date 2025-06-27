import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Typography, TextField, Dialog, DialogActions, 
  DialogContent, DialogTitle, Select, MenuItem, InputLabel, FormControl, Grid 
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getFlights, createFlight, deleteFlight } from '../../api/admin';
import { getAirlines, getAircrafts, getAirports } from '../../api/admin';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newFlight, setNewFlight] = useState({
    airline: '',
    aircraft: '',
    flight_number: '',
    departure_airport: '',
    arrival_airport: '',
    departure_time: new Date(),
    arrival_time: new Date(),
    base_price: '',
    available_seats: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [flightsRes, airlinesRes, aircraftsRes, airportsRes] = await Promise.all([
        getFlights(),
        getAirlines(),
        getAircrafts(),
        getAirports()
      ]);
      setFlights(flightsRes.data);
      setAirlines(airlinesRes.data);
      setAircrafts(aircraftsRes.data);
      setAirports(airportsRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createFlight({
        ...newFlight,
        departure_time: newFlight.departure_time.toISOString(),
        arrival_time: newFlight.arrival_time.toISOString()
      });
      fetchData();
      setOpen(false);
      setNewFlight({
        airline: '',
        aircraft: '',
        flight_number: '',
        departure_airport: '',
        arrival_airport: '',
        departure_time: new Date(),
        arrival_time: new Date(),
        base_price: '',
        available_seats: ''
      });
    } catch (err) {
      console.error("Failed to create flight", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFlight(id);
      fetchData();
    } catch (err) {
      console.error("Failed to delete flight", err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TableContainer component={Paper}>
        <Typography variant="h5" sx={{ p: 2 }}>Flight Management</Typography>
        <Button variant="contained" sx={{ m: 2 }} onClick={() => setOpen(true)}>
          Add New Flight
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Flight No.</TableCell>
              <TableCell>Airline</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Departure</TableCell>
              <TableCell>Arrival</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((flight) => (
              <TableRow key={flight.id}>
                <TableCell>{flight.flight_number}</TableCell>
                <TableCell>{flight.airline.name}</TableCell>
                <TableCell>{flight.departure_airport.code} → {flight.arrival_airport.code}</TableCell>
                <TableCell>{new Date(flight.departure_time).toLocaleString()}</TableCell>
                <TableCell>{new Date(flight.arrival_time).toLocaleString()}</TableCell>
                <TableCell>${flight.base_price}</TableCell>
                <TableCell>{flight.available_seats}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(flight.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Flight</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Airline</InputLabel>
                <Select
                  value={newFlight.airline}
                  onChange={(e) => setNewFlight({...newFlight, airline: e.target.value})}
                >
                  {airlines.map((airline) => (
                    <MenuItem key={airline.id} value={airline.id}>
                      {airline.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Aircraft</InputLabel>
                <Select
                  value={newFlight.aircraft}
                  onChange={(e) => setNewFlight({...newFlight, aircraft: e.target.value})}
                >
                  {aircrafts.map((aircraft) => (
                    <MenuItem key={aircraft.id} value={aircraft.id}>
                      {aircraft.model} ({aircraft.registration_number})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                margin="dense"
                label="Flight Number"
                value={newFlight.flight_number}
                onChange={(e) => setNewFlight({...newFlight, flight_number: e.target.value})}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Departure Airport</InputLabel>
                <Select
                  value={newFlight.departure_airport}
                  onChange={(e) => setNewFlight({...newFlight, departure_airport: e.target.value})}
                >
                  {airports.map((airport) => (
                    <MenuItem key={airport.id} value={airport.id}>
                      {airport.code} - {airport.city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Arrival Airport</InputLabel>
                <Select
                  value={newFlight.arrival_airport}
                  onChange={(e) => setNewFlight({...newFlight, arrival_airport: e.target.value})}
                >
                  {airports.map((airport) => (
                    <MenuItem key={airport.id} value={airport.id}>
                      {airport.code} - {airport.city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <DateTimePicker
                label="Departure Time"
                value={newFlight.departure_time}
                onChange={(date) => setNewFlight({...newFlight, departure_time: date})}
                slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
              />
            </Grid>
            <Grid item xs={6}>
              <DateTimePicker
                label="Arrival Time"
                value={newFlight.arrival_time}
                onChange={(date) => setNewFlight({...newFlight, arrival_time: date})}
                slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Base Price ($)"
                type="number"
                value={newFlight.base_price}
                onChange={(e) => setNewFlight({...newFlight, base_price: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Available Seats"
                type="number"
                value={newFlight.available_seats}
                onChange={(e) => setNewFlight({...newFlight, available_seats: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default Flights;

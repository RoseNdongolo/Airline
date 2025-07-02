import { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { flightApi } from '../../api/api';
import useAuth from '../../context/useAuth';

const SearchFlight = () => {
  const [flights, setFlights] = useState([]);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await flightApi.searchFlights({}, token);
        setFlights(response);
      } catch (err) {
        console.error('Failed to load flights:', err);
        // You can also show a toast or alert to notify the user
      }
    };

    fetchFlights();
  }, [token]);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Available Flights
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Flight No.</TableCell>
            <TableCell>Airline</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Departure</TableCell>
            <TableCell>Arrival</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Seats</TableCell>
            {(user?.user_type === 2 || user?.user_type === 3) && (
              <TableCell>Action</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {flights.map((flight) => (
            <TableRow key={flight.id}>
              <TableCell>{flight.flight_number || '—'}</TableCell>
              <TableCell>{flight.airline?.name || 'Unassigned'}</TableCell>
              <TableCell>{flight.departure_airport?.code || flight.origin || '—'}</TableCell>
              <TableCell>{flight.arrival_airport?.code || flight.destination || '—'}</TableCell>
              <TableCell>{flight.departure_time ? new Date(flight.departure_time).toLocaleString() : '—'}</TableCell>
              <TableCell>{flight.arrival_time ? new Date(flight.arrival_time).toLocaleString() : '—'}</TableCell>
              <TableCell>{flight.base_price ? `$${flight.base_price}` : '—'}</TableCell>
              <TableCell>{flight.available_seats ?? '—'}</TableCell>
              {(user?.user_type === 2 || user?.user_type === 3) && (
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/customer/booking/${flight.id}`)}
                  >
                    Book
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default SearchFlight;

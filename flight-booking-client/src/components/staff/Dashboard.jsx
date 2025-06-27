import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, Box, CircularProgress } from '@mui/material';
import { getStaffFlights } from '../../api/staff';

const StaffDashboard = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const { data } = await getStaffFlights();
        setFlights(data);
      } catch (err) {
        console.error('Failed to load flights', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Staff Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {flights.map((flight) => (
            <Grid item xs={12} md={6} lg={4} key={flight.id}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {flight.airline?.name} — {flight.flight_number}
                </Typography>
                <Typography>
                  {flight.departure_airport?.code} → {flight.arrival_airport?.code}
                </Typography>
                <Typography>
                  Departure: {new Date(flight.departure_time).toLocaleString()}
                </Typography>
                <Typography>Status: {flight.status}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default StaffDashboard;

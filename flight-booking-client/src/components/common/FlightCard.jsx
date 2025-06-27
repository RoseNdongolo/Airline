import { Card, CardContent, Typography, Button, Grid, Box, Chip } from '@mui/material';
import { format, parseISO } from 'date-fns';

const FlightCard = ({ flight, onBook, passengers = 1, classType = 'economy' }) => {
  const formatTime = (dateString) => {
    return format(parseISO(dateString), 'hh:mm a');
  };

  const calculatePrice = () => {
    let multiplier = 1;
    if (classType === 'business') multiplier = 1.5;
    if (classType === 'first') multiplier = 2.5;
    return (flight.base_price * multiplier * passengers).toFixed(2);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          {/* Airline Info */}
          <Grid item xs={12} sm={3}>
            <Typography variant="h6">{flight.airline.name}</Typography>
            <Typography variant="body2">Flight #{flight.flight_number}</Typography>
            <Chip 
              label={classType.toUpperCase()} 
              size="small" 
              sx={{ mt: 1 }}
              color={classType === 'economy' ? 'default' : 'primary'}
            />
          </Grid>

          {/* Flight Route */}
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography variant="h5">{formatTime(flight.departure_time)}</Typography>
                <Typography variant="body2">{flight.departure_airport.code}</Typography>
              </Grid>
              
              <Grid item xs={4} sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  {flight.duration}
                </Typography>
                <Box sx={{ borderBottom: '1px dashed grey', my: 1 }} />
                <Typography variant="body2">
                  {flight.aircraft.model}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="h5">{formatTime(flight.arrival_time)}</Typography>
                <Typography variant="body2">{flight.arrival_airport.code}</Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Price and Book */}
          <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
            <Typography variant="h6" color="primary">
              ${calculatePrice()}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {passengers} {passengers > 1 ? 'passengers' : 'passenger'} • {flight.available_seats} seats left
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={onBook}
              disabled={flight.available_seats < passengers}
            >
              {flight.available_seats < passengers ? 'No seats' : 'Book Now'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FlightCard;
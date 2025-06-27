import { useState } from 'react';
import { Container, Paper, Typography, Button, TextField, Box } from '@mui/material';

const Payment = ({ booking, onSuccess }) => {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

  const handlePayment = () => {
    console.log("Processing payment...", cardDetails);
    setTimeout(() => {
      onSuccess(); // Simulate successful payment
    }, 1500);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Payment Details</Typography>
        <TextField
          fullWidth
          label="Card Number"
          placeholder="4242 4242 4242 4242"
          sx={{ mb: 2 }}
          value={cardDetails.number}
          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
        />
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Expiry (MM/YY)"
            placeholder="12/25"
            value={cardDetails.expiry}
            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
          />
          <TextField
            fullWidth
            label="CVV"
            placeholder="123"
            value={cardDetails.cvv}
            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
          />
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Total: <strong>${booking.total_price}</strong>
        </Typography>
        <Button
          fullWidth
          variant="contained"
          onClick={handlePayment}
        >
          Confirm Payment
        </Button>
      </Paper>
    </Container>
  );
};

export default Payment;
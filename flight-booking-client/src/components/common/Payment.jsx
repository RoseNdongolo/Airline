import { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  MenuItem
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingApi, paymentApi } from '../../api/api';
import useAuth from '../../context/useAuth';

const PaymentForm = () => {
  const { bookingId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    bookingApi.getBooking(bookingId, token)
      .then(data => {
        setBooking(data);
        setAmount(data.total_price); // Prefill from backend
      })
      .catch(err => {
        console.error('Error loading booking:', err);
      });
  }, [bookingId, token]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        booking: bookingId, // ✅ Corrected field name
        amount,
        payment_method: paymentMethod,
        transaction_id: transactionId
      };
      await paymentApi.createPayment(payload, token);
      navigate('/customer/mybooking');
    } catch (err) {
      console.error('Payment failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom align="center">
        Payment for Booking #{booking.booking_reference}
      </Typography>

      <TextField
        label="Amount"
        type="number"
        fullWidth
        margin="normal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <TextField
        label="Payment Method"
        select
        fullWidth
        margin="normal"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <MenuItem value="Mobile Money">Mobile Money</MenuItem>
        <MenuItem value="Credit Card">Credit Card</MenuItem>
        <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
      </TextField>

      <TextField
        label="Transaction ID"
        fullWidth
        margin="normal"
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={loading || !paymentMethod || !transactionId}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Payment'}
      </Button>
    </Paper>
  );
};

export default PaymentForm;

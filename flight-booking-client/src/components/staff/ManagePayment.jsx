import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { paymentApi, bookingApi } from '../../api/api.js';
import useAuth from '../../context/useAuth';

const ManagePayment = () => {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({ booking: '', amount: '', payment_method: '', transaction_id: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([paymentApi.getPayments(token), bookingApi.getBookings(token)])
      .then(([paymentData, bookingData]) => {
        setPayments(paymentData);
        setBookings(bookingData.filter(b => b.status === 'confirmed'));
      })
      .catch(() => setError('Failed to fetch data'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await paymentApi.createPayment({ ...formData, status: 'completed' }, token);
      setPayments([...payments, formData]);
      setFormData({ booking: '', amount: '', payment_method: '', transaction_id: '' });
    } catch (err) {
      console.error(err);
      setError('Failed to create payment');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await paymentApi.updatePayment(id, data, token);
      setPayments(payments.map(p => p.id === id ? { ...p, ...data } : p));
    } catch (err) {
      console.error(err);
      setError('Failed to update payment');
    }
  };

  const handleDelete = async (id) => {
    try {
      await paymentApi.deletePayment(id, token);
      setPayments(payments.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete payment');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>Manage Payments</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Booking"
          name="booking"
          value={formData.booking}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {bookings.map(booking => (
            <option key={booking.id} value={booking.id}>{booking.booking_reference}</option>
          ))}
        </TextField>
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Payment Method"
          name="payment_method"
          value={formData.payment_method}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Transaction ID"
          name="transaction_id"
          value={formData.transaction_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Add Payment
        </Button>
      </form>
      <Table sx={{ mt: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>Booking Reference</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map(payment => (
            <TableRow key={payment.id}>
              <TableCell>{payment.booking.booking_reference}</TableCell>
              <TableCell>${payment.amount}</TableCell>
              <TableCell>{payment.payment_method}</TableCell>
              <TableCell>{payment.status}</TableCell>
              <TableCell>
                <Button onClick={() => handleUpdate(payment.id, payment)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(payment.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ManagePayment;
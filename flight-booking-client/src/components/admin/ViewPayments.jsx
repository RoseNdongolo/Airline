import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { paymentApi } from '../../api/api.js'; // Adjust the import path as necessary
import useAuth from '../../context/useAuth';

const ViewPayments = () => {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    paymentApi.getPayments(token)
      .then(data => setPayments(data))
      .catch(() => setError('Failed to fetch payments'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>View Payments</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Booking Reference</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Transaction ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map(payment => (
            <TableRow key={payment.id}>
              <TableCell>{payment.booking.booking_reference}</TableCell>
              <TableCell>${payment.amount}</TableCell>
              <TableCell>{payment.payment_method}</TableCell>
              <TableCell>{payment.status}</TableCell>
              <TableCell>{payment.transaction_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ViewPayments;
import { useEffect, useState } from 'react';
import {
  Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, CircularProgress, Snackbar, Alert, Dialog, DialogActions, 
  DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { bookingApi } from '../../api/api';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);

  // Fetch all bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await bookingApi.getBookings();
        setBookings(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load bookings:', err);
        setError('Failed to load bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Fetch detailed booking info when selected
  const fetchBookingDetails = async (bookingId) => {
    try {
      const details = await bookingApi.getBookingDetails(bookingId);
      setBookingDetails(details);
      return details;
    } catch (err) {
      console.error('Failed to load booking details:', err);
      setError('Failed to load booking details. Please try again.');
      return null;
    }
  };

  // Get passenger names from booking data
  const getPassengerNames = (booking) => {
    if (booking?.passengers?.length > 0) {
      return booking.passengers.map(p => p.name).join(', ');
    }
    if (bookingDetails?.passengers?.length > 0) {
      return bookingDetails.passengers.map(p => p.name).join(', ');
    }
    return booking?.user?.username || 'Unknown Customer';
  };

  // Handle booking status update
  const updateBookingStatus = async () => {
    if (!selectedBooking || !newStatus) return;

    try {
      // Get fresh booking details if needed
      const booking = bookingDetails || await fetchBookingDetails(selectedBooking);
      if (!booking) throw new Error('Booking not found');

      const payload = {
        status: newStatus,
        flight_id: booking.flight_id || (typeof booking.flight === 'object' ? booking.flight.id : booking.flight),
        passengers: booking.passengers || [],
        seats_booked: booking.seats_booked || 1
      };

      await bookingApi.updateBooking(selectedBooking, payload);
      
      setBookings(prev =>
        prev.map(b => b.id === selectedBooking ? { ...b, status: newStatus } : b)
      );
      
      setError(null);
      setOpenStatusDialog(false);
    } catch (err) {
      console.error('Failed to update booking status:', err);
      setError(`Failed to update booking. Error: ${err.message}`);
    } finally {
      setSelectedBooking(null);
      setNewStatus('');
      setBookingDetails(null);
    }
  };

  // Handle booking deletion
  const deleteBooking = async () => {
    if (!selectedBooking) return;

    try {
      await bookingApi.deleteBooking(selectedBooking);
      setBookings(prev => prev.filter(b => b.id !== selectedBooking));
      setError(null);
      setOpenDeleteDialog(false);
    } catch (err) {
      console.error('Failed to delete booking:', err);
      setError(`Failed to delete booking. Error: ${err.message}`);
    } finally {
      setSelectedBooking(null);
      setBookingDetails(null);
    }
  };

  // Dialog handlers
  const handleOpenStatusDialog = async (bookingId, status) => {
    setSelectedBooking(bookingId);
    setNewStatus(status);
    await fetchBookingDetails(bookingId);
    setOpenStatusDialog(true);
  };

  const handleOpenDeleteDialog = async (bookingId) => {
    setSelectedBooking(bookingId);
    await fetchBookingDetails(bookingId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenStatusDialog(false);
    setOpenDeleteDialog(false);
    setSelectedBooking(null);
    setNewStatus('');
    setBookingDetails(null);
  };

  if (loading) {
    return <CircularProgress sx={{ mt: 5, mx: 'auto', display: 'block' }} />;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Manage Bookings</Typography>

      {/* Bookings Table */}
      {bookings.length === 0 ? (
        <Typography>No bookings found.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Flight</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Passengers</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => {
              const flightName = booking.flight?.flight_number || 'Unknown Flight';
              const passengerNames = getPassengerNames(booking);
              
              return (
                <TableRow key={booking.id}>
                  <TableCell>{booking.booking_reference || 'N/A'}</TableCell>
                  <TableCell>{booking.user?.username || 'Unknown Customer'}</TableCell>
                  <TableCell>{flightName}</TableCell>
                  <TableCell>{booking.seats_booked || '0'}</TableCell>
                  <TableCell>{booking.total_price ? `$${booking.total_price}` : 'N/A'}</TableCell>
                  <TableCell>{booking.status || 'N/A'}</TableCell>
                  <TableCell>{passengerNames}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleOpenStatusDialog(booking.id, booking.status === 'confirmed' ? 'pending' : 'confirmed')}
                      color={booking.status === 'confirmed' ? 'warning' : 'success'}
                      variant="contained"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      {booking.status === 'confirmed' ? 'Set Pending' : 'Confirm'}
                    </Button>
                    <Button
                      onClick={() => handleOpenDeleteDialog(booking.id)}
                      color="error"
                      variant="outlined"
                      size="small"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Status Change Dialog */}
      <Dialog open={openStatusDialog} onClose={handleCloseDialogs}>
        <DialogTitle>
          {newStatus === 'confirmed' ? 'Confirm Booking' : 'Set Booking to Pending'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {newStatus === 'confirmed' ? 'confirm' : 'set to pending'} the booking for:
            <br />
            <strong>Passenger(s):</strong> {getPassengerNames(bookingDetails)}
            <br />
            <strong>Flight:</strong> {bookingDetails?.flight?.flight_number || 'Unknown Flight'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button 
            onClick={updateBookingStatus} 
            color={newStatus === 'confirmed' ? 'success' : 'warning'} 
            variant="contained"
          >
            {newStatus === 'confirmed' ? 'Confirm' : 'Set Pending'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Booking Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Delete Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the booking for:
            <br />
            <strong>Passenger(s):</strong> {getPassengerNames(bookingDetails)}
            <br />
            <strong>Flight:</strong> {bookingDetails?.flight?.flight_number || 'Unknown Flight'}
            <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button 
            onClick={deleteBooking} 
            color="error" 
            variant="contained"
          >
            Delete Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ManageBookings;
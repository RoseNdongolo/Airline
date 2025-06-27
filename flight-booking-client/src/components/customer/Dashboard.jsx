import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Customer Dashboard
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                    variant="contained"
                    component={Link}
                    to="/search"
                    sx={{ p: 3 }}
                >
                    Book a Flight
                </Button>
                <Button
                    variant="outlined"
                    component={Link}
                    to="/customer/bookings"
                    sx={{ p: 3 }}
                >
                    My Bookings
                </Button>
            </Box>
        </Container>
    );
};

export default CustomerDashboard;
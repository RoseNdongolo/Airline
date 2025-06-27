import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h2" gutterBottom>
                Welcome to Flight Booking System
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                Book your flights with ease and convenience
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to="/search"
                >
                    Search Flights
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/login"
                >
                    Login
                </Button>
            </Box>
        </Container>
    );
};

export default Home;
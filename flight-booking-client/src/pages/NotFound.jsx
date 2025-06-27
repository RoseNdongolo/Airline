import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h1" gutterBottom>
                404
            </Typography>
            <Typography variant="h4" gutterBottom>
                Page Not Found
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
                The page you are looking for doesn't exist or has been moved.
            </Typography>
            <Button variant="contained" component={Link} to="/">
                Go to Home
            </Button>
        </Container>
    );
};

export default NotFound;
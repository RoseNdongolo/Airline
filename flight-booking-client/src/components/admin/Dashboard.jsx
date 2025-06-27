import { Container, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const AdminDashboard = () => {
    const { user } = useAuth();

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Welcome, {user?.first_name || 'Admin'}
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6} lg={3}>
                    <Card component={Link} to="/admin/airlines" sx={{ textDecoration: 'none' }}>
                        <CardContent>
                            <Typography variant="h5">Airlines</Typography>
                            <Typography variant="body2">Manage airline companies</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Card component={Link} to="/admin/airports" sx={{ textDecoration: 'none' }}>
                        <CardContent>
                            <Typography variant="h5">Airports</Typography>
                            <Typography variant="body2">Manage airport locations</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Card component={Link} to="/admin/aircrafts" sx={{ textDecoration: 'none' }}>
                        <CardContent>
                            <Typography variant="h5">Aircrafts</Typography>
                            <Typography variant="body2">Manage aircraft fleet</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Card component={Link} to="/admin/flights" sx={{ textDecoration: 'none' }}>
                        <CardContent>
                            <Typography variant="h5">Flights</Typography>
                            <Typography variant="body2">Manage flight schedules</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    <Grid item>
                        <Button variant="contained" component={Link} to="/admin/airlines/new">
                            Add New Airline
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" component={Link} to="/admin/flights/new">
                            Add New Flight
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AdminDashboard;
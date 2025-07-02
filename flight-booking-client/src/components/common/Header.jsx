import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import useAuth from '../../context/useAuth';

const Header = () => {
  const { user } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Left side: Brand */}
          <Typography variant="h6" component={Link} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
            Flight Booking System
          </Typography>

          {/* Right side: Auth buttons */}
          <Box>
            {!user && (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Register</Button>
              </>
            )}
            {user && (
              <Button color="inherit" component={Link} to="/logout">Logout</Button>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

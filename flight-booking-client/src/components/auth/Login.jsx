import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import useAuth from '../../context/useAuth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { user } = await login({ username, password });

      // ✅ Redirect based on user role
      switch (user?.user_type) {
        case 1:
          navigate('/admin');
          break;
        case 2:
          navigate('/staff');
          break;
        case 3:
          navigate('/customer');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        p: 3,
        boxShadow: 3,
        borderRadius: 2
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Login
      </Typography>

      {(authError?.detail) && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {authError.detail}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          disabled={submitting}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          disabled={submitting}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, height: 48 }}
          disabled={submitting}
        >
          {submitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Login'
          )}
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="text"
            onClick={() => navigate('/register')}
            disabled={submitting}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Login;

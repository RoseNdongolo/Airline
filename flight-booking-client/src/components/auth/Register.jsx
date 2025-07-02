import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
// import { authApi } from '../../api/auth';
import { authApi } from '../../api/api.js';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    user_type: 3,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authApi.register(formData);
      if (response) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data) {
        // Handle Django REST framework error format
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          setError(errorData);
        } else if (errorData.detail) {
          setError(errorData.detail);
        } else {
          // Combine all field errors into one message
          const errorMessages = [];
          for (const key in errorData) {
            errorMessages.push(...errorData[key]);
          }
          setError(errorMessages.join(' ') || 'Registration failed');
        }
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 400, 
      mx: 'auto', 
      mt: 4,
      p: 3,
      boxShadow: 3,
      borderRadius: 2
    }}>
      <Typography variant="h4" gutterBottom align="center">
        Register
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Registration successful! Redirecting to login...
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={handleChange}
          required
        />
        
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <TextField
          label="First Name"
          name="first_name"
          fullWidth
          margin="normal"
          value={formData.first_name}
          onChange={handleChange}
        />
        
        <TextField
          label="Last Name"
          name="last_name"
          fullWidth
          margin="normal"
          value={formData.last_name}
          onChange={handleChange}
        />
        
        <TextField
          label="Phone Number"
          name="phone_number"
          fullWidth
          margin="normal"
          value={formData.phone_number}
          onChange={handleChange}
          inputProps={{ pattern: "[0-9]*" }}
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>User Type</InputLabel>
          <Select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            label="User Type"
            required
          >
            <MenuItem value={3}>Customer</MenuItem>
            <MenuItem value={1}>Admin</MenuItem>
            <MenuItem value={2}>Airline Staff</MenuItem>
          </Select>
        </FormControl>
        
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
      </form>
      
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already have an account?{' '}
        <Button 
          variant="text" 
          size="small" 
          onClick={() => navigate('/login')}
        >
          Login here
        </Button>
      </Typography>
    </Box>
  );
};

export default Register;
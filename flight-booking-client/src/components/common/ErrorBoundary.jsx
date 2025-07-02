import { Component } from 'react';
import { Typography, Box, Button } from '@mui/material';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error">Something went wrong</Typography>
          <Typography sx={{ mt: 2 }}>{this.state.error?.message || 'An error occurred'}</Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Reload Page
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
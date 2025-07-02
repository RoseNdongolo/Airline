import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import useAuth from '../../context/useAuth';
import { authApi } from '../../api/api.js';

const Profile = () => {
    const { user, token } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authApi.updateProfile(formData, token);
            alert('Profile updated successfully');
        } catch (err) {
            console.error('Update failed:', err);
            setError('Failed to update profile');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
            <Typography variant="h5" gutterBottom>Profile</Typography>
            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    disabled
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Update Profile'}
                </Button>
            </form>
        </Box>
    );
};

export default Profile;
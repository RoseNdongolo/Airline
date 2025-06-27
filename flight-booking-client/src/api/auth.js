
import apiClient from './index';

export const login = (credentials) => {
    return apiClient.post('/login/', credentials);
};

export const register = (userData) => {
    return apiClient.post('/users/', userData);
};

export const logout = () => {
    // JWT is stateless, so client-side cleanup is sufficient
    return Promise.resolve();
};

export const getCurrentUser = () => {
    return apiClient.get('/users/me/');
};
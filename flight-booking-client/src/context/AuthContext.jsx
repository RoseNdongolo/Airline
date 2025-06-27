
import { createContext, useState, useEffect } from 'react';
import apiClient from '../api/index';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            apiClient.get('/auth/user/', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => {
                    setUser(response.data); // Expects { user_type: 'staff', ... }
                    setLoading(false);
                })
                .catch(() => {
                    setUser(null);
                    setLoading(false);
                    localStorage.removeItem('access_token');
                });
        } else {
            setUser(null);
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await apiClient.post('/login/', { username, password });
            localStorage.setItem('access_token', response.data.access);
            setUser(response.data.user);
            return true;
        } catch {
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('access_token');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

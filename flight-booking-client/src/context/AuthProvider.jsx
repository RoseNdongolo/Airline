import { useState } from 'react';
import AuthContext from './AuthContext';
import { authApi } from '../api/api.js';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = async ({ username, password }) => {
    try {
      const response = await authApi.login({ username, password });
      const accessToken = response.access;

      localStorage.setItem('token', accessToken);
      setToken(accessToken);

      setUser(response.user);
      setError(null);

      return { user: response.user };
    } catch (err) {
      const errorMessage = JSON.parse(err.message);
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import { createContext } from 'react';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  error: null,
});

export default AuthContext;
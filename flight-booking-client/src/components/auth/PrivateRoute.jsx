import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (requiredRole && user.user_type !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
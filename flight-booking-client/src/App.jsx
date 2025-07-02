import { Routes, Route, Navigate } from 'react-router-dom';
// import Home from './components/common/Home';
import ErrorBoundary from './components/common/ErrorBoundary';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Logout from './components/auth/Logout';
import AdminLayout from './components/admin/AdminLayout';
import StaffLayout from './components/staff/StaffLayout';
import CustomerLayout from './components/customer/CustomerLayout';
import NotFound from './components/common/NotFound';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import useAuth from './context/useAuth';

import { Box } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.user_type)) return <Navigate to="/not-found" />;
  return children;
};

const App = () => {
  return (
    <ErrorBoundary>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />

        <Box component="main" flex={1}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={[1]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/*"
              element={
                <ProtectedRoute allowedRoles={[2]}>
                  <StaffLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/*"
              element={
                <ProtectedRoute allowedRoles={[3]}>
                  <CustomerLayout />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" />} />
          </Routes>
        </Box>

        <Footer />
      </Box>
    </ErrorBoundary>
  );
};

export default App;

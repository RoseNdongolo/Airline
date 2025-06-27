import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SearchFlights from './pages/SearchFlights';
import AdminDashboard from './components/admin/Dashboard';
import StaffDashboard from './components/staff/Dashboard';
import CustomerDashboard from './components/customer/Dashboard';
import BookFlight from './components/customer/BookFlight';
import MyBookings from './components/customer/MyBookings';
import BookingDetail from './components/customer/BookingDetail';
import Airlines from './components/admin/Airlines';
import Airports from './components/admin/Airports';
import Aircrafts from './components/admin/Aircrafts';
import Flights from './components/admin/Flights';
import StaffFlights from './components/staff/Flights';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import NotFound from './pages/NotFound';

function App() {
    return (
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/search" element={<SearchFlights />} />
                    
                    {/* Customer Routes */}
                    <Route path="/customer/dashboard" element={
                        <PrivateRoute requiredRole={3}>
                            <CustomerDashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/customer/book/:flightId" element={
                        <PrivateRoute requiredRole={3}>
                            <BookFlight />
                        </PrivateRoute>
                    } />
                    <Route path="/customer/bookings" element={
                        <PrivateRoute requiredRole={3}>
                            <MyBookings />
                        </PrivateRoute>
                    } />
                    <Route path="/customer/bookings/:bookingId" element={
                        <PrivateRoute requiredRole={3}>
                            <BookingDetail />
                        </PrivateRoute>
                    } />
                    
                    {/* Staff Routes */}
                    <Route path="/staff/dashboard" element={
                        <PrivateRoute requiredRole={2}>
                            <StaffDashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/staff/flights" element={
                        <PrivateRoute requiredRole={2}>
                            <StaffFlights />
                        </PrivateRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={
                        <PrivateRoute requiredRole={1}>
                            <AdminDashboard />
                        </PrivateRoute>
                    } />

                    <Route path="/admin/airlines" element={
                        <PrivateRoute requiredRole={1}>
                            <Airlines />
                        </PrivateRoute>
                    } />


                    <Route path="/admin/airports" element={
                        <PrivateRoute requiredRole={1}>
                            <Airports />
                        </PrivateRoute> 
                    } /> 

                    <Route path="/admin/aircrafts" element={
                        <PrivateRoute requiredRole={1}>
                            <Aircrafts />
                        </PrivateRoute>
                    } /> 

                    <Route path="/admin/flights" element={
                        <PrivateRoute requiredRole={1}>
                            <Flights />
                        </PrivateRoute>
                    } />

                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </AuthProvider>
    
    );
}

export default App;


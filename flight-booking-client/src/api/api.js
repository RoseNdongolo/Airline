const API_BASE_URL = 'http://localhost:8000/api/';

const apiRequest = async (endpoint, method = 'GET', data = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle error responses
  if (!response.ok) {
    let errorMessage = 'Unknown error';
    try {
      errorMessage = await response.json();
    } catch (err) {
      console.error(err)
      errorMessage = await response.text(); // fallback for plain text error
    }
    throw new Error(JSON.stringify(errorMessage));
  }

  // Handle empty or non-JSON responses gracefully
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return null; // No content (e.g. 204)
};

// 🔐 Auth APIs
export const authApi = {
  login: (credentials) => apiRequest('login/', 'POST', credentials),
  register: (userData) => apiRequest('register/', 'POST', userData),
  getUser: (token) => apiRequest('users/profile/', 'GET', null, token),
};

// ✈️ Flight APIs
export const flightApi = {
  searchFlights: (params, token) =>
    apiRequest(`flights/?${new URLSearchParams(params)}`, 'GET', null, token),
  getFlight: (id, token) =>
    apiRequest(`flights/${id}/`, 'GET', null, token),
  createFlight: (data, token) =>
    apiRequest('flights/', 'POST', data, token),
  updateFlight: (id, data, token) =>
    apiRequest(`flights/${id}/`, 'PUT', data, token),
  deleteFlight: (id, token) =>
    apiRequest(`flights/${id}/`, 'DELETE', null, token),
};

// 📆 Booking APIs
export const bookingApi = {
  createBooking: (data, token) =>
    apiRequest('bookings/', 'POST', data, token),
  getBookings: (token) =>
    apiRequest('bookings/', 'GET', null, token),
  getBooking: (id, token) =>
    apiRequest(`bookings/${id}/`, 'GET', null, token),
  updateBooking: (id, data, token) =>
    apiRequest(`bookings/${id}/`, 'PUT', data, token),
  deleteBooking: (id, token) =>
    apiRequest(`bookings/${id}/`, 'DELETE', null, token),
};

// 💳 Payment APIs
export const paymentApi = {
  createPayment: (data, token) =>
    apiRequest('payments/', 'POST', data, token),
  getPayments: (token) =>
    apiRequest('payments/', 'GET', null, token),
  getPayment: (id, token) =>
    apiRequest(`payments/${id}/`, 'GET', null, token),
  updatePayment: (id, data, token) =>
    apiRequest(`payments/${id}/`, 'PUT', data, token),
  deletePayment: (id, token) =>
    apiRequest(`payments/${id}/`, 'DELETE', null, token),
};

// 🛩 Aircraft APIs
export const aircraftApi = {
  getAircrafts: (token) =>
    apiRequest('aircrafts/', 'GET', null, token),
  createAircraft: (data, token) =>
    apiRequest('aircrafts/', 'POST', data, token),
  updateAircraft: (id, data, token) =>
    apiRequest(`aircrafts/${id}/`, 'PUT', data, token),
  deleteAircraft: (id, token) =>
    apiRequest(`aircrafts/${id}/`, 'DELETE', null, token),
};

// ✈️ Airline APIs
export const airlineApi = {
  getAirlines: (token) =>
    apiRequest('airlines/', 'GET', null, token),
  createAirline: (data, token) =>
    apiRequest('airlines/', 'POST', data, token),
  updateAirline: (id, data, token) =>
    apiRequest(`airlines/${id}/`, 'PUT', data, token),
  deleteAirline: (id, token) =>
    apiRequest(`airlines/${id}/`, 'DELETE', null, token),
};

// 🌍 Airport APIs
export const airportApi = {
  getAirports: (token) =>
    apiRequest('airports/', 'GET', null, token),
  createAirport: (data, token) =>
    apiRequest('airports/', 'POST', data, token),
  updateAirport: (id, data, token) =>
    apiRequest(`airports/${id}/`, 'PUT', data, token),
  deleteAirport: (id, token) =>
    apiRequest(`airports/${id}/`, 'DELETE', null, token),
};

// 👤 Passenger APIs
export const passengerApi = {
  getPassengers: (token) =>
    apiRequest('passengers/', 'GET', null, token),
  addPassenger: (data, token) =>
    apiRequest('passengers/', 'POST', data, token),
  updatePassenger: (id, data, token) =>
    apiRequest(`passengers/${id}/`, 'PUT', data, token),
  deletePassenger: (id, token) =>
    apiRequest(`passengers/${id}/`, 'DELETE', null, token),
};

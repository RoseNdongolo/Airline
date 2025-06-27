import apiClient from './index';

export const getBookings = () => {
    return apiClient.get('/bookings/');
};

export const getBooking = (id) => {
    return apiClient.get(`/bookings/${id}/`);
};


export const cancelBooking = (id) => {
    return apiClient.patch(`/bookings/${id}/`, { status: 'cancelled' });
};

// import apiClient from './index';

export const createBooking = (bookingData) => {
    return apiClient.post('/bookings/', bookingData);
};

export const getFlight = (flightId) => {
    return apiClient.get(`/flights/${flightId}/`);
};
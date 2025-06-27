import apiClient from './index';

export const getStaffFlights = () => apiClient.get('/staff/flights/');
export const updateFlightStatus = (id, data) => apiClient.patch(`/staff/flights/${id}/`, data);
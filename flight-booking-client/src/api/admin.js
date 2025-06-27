import apiClient from './index';

// Airlines
export const getAirlines = () => apiClient.get('/airlines/');
export const createAirline = (data) => apiClient.post('/airlines/', data);
export const deleteAirline = (id) => apiClient.delete(`/airlines/${id}/`);

// Airports
export const getAirports = () => apiClient.get('/airports/');
export const createAirport = (data) => apiClient.post('/airports/', data);
export const deleteAirport = (id) => apiClient.delete(`/airports/${id}/`);

// Aircrafts
export const getAircrafts = () => apiClient.get('/aircrafts/');
export const createAircraft = (data) => apiClient.post('/aircrafts/', data);
export const deleteAircraft = (id) => apiClient.delete(`/aircrafts/${id}/`);

// Flights
export const getFlights = () => apiClient.get('/flights/');
export const createFlight = (data) => apiClient.post('/flights/', data);
export const deleteFlight = (id) => apiClient.delete(`/flights/${id}/`);



// Similarly add for Airports, Aircrafts, Flights...
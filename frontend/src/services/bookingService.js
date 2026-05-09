import api from './api';

export const createBooking = async (payload) => {
  const response = await api.post('/bookings', payload);
  return response.data;
};

export const fetchBookings = async ({ page = 1, limit = 10, status = '', expertId = '' } = {}) => {
  const response = await api.get('/bookings', {
    params: { page, limit, status, expertId }
  });

  return response.data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const response = await api.patch(`/bookings/${bookingId}/status`, { status });
  return response.data;
};

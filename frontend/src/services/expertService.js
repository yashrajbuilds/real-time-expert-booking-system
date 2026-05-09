import api from './api';

export const fetchExperts = async ({ page = 1, limit = 9, search = '', category = '' } = {}) => {
  const response = await api.get('/experts', {
    params: { page, limit, search, category }
  });

  return response.data;
};

export const fetchExpertById = async (id) => {
  const response = await api.get(`/experts/${id}`);
  return response.data;
};

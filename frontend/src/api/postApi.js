import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const api = axios.create({
  baseURL: `${API_BASE}/api/posts`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Returns response.data.data on success, or throws an Error with a readable message
const unwrap = (request) =>
  request
    .then((response) => response.data.data)
    .catch((error) => {
      const message =
        error.response?.data?.message ||
        (error.code === 'ECONNABORTED' ? 'The request timed out. Please try again.' : null) ||
        (error.request && !error.response
          ? 'Cannot reach the server. Check your connection or API URL.'
          : null) ||
        error.message ||
        'Something went wrong';
      throw new Error(message);
    });

export const postApi = {
  getAll: () => unwrap(api.get('')),
  getById: (id) => unwrap(api.get(`/${id}`)),
  create: (data) => unwrap(api.post('', data)),
  update: (id, data) => unwrap(api.put(`/${id}`, data)),
  remove: (id) => unwrap(api.delete(`/${id}`)),
};

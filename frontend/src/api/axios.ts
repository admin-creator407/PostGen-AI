import axios from 'axios';

// Bakend api
// Use the same-origin API by default. Vite proxies this to the local backend in
// development and Nginx proxies it in Docker/production.
const API_URL = (import.meta as any).env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to headers if it exists in local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Error handling like token expired 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    if (error.code === 'ECONNABORTED') {
      error.message = 'The request timed out. Please try again.';
    } else if (!error.response) {
      error.message = 'Unable to reach the server. Check your connection and try again.';
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const persistedAuth = localStorage.getItem('admin-auth');
      if (persistedAuth) {
        try {
          const parsed = JSON.parse(persistedAuth);
          const token = parsed.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error parsing admin-auth from localStorage', error);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

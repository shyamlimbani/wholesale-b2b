import axios from 'axios';

const rawUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://wholesale-backend-5l3e.onrender.com';

const cleanUrl = rawUrl.endsWith('/')
  ? rawUrl.slice(0, -1)
  : rawUrl;

const API_URL = `${cleanUrl}/api`;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {

    if (typeof window !== 'undefined') {

      const persistedAuth =
        localStorage.getItem('admin-auth');

      if (persistedAuth) {

        try {

          const parsed =
            JSON.parse(persistedAuth);

          const token =
            parsed.state?.token;

          if (token) {

            config.headers.Authorization =
              `Bearer ${token}`;

          }

        } catch (error) {

          console.error(
            'Error parsing admin-auth from localStorage',
            error
          );

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
import axios from 'axios';
import Cookies from 'js-cookie';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Create axios instance
const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

// Request interceptor to add Bearer token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid, redirect to login
//       Cookies.remove('admin_token');
//       localStorage.removeItem('admin_info');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default api; 
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';

/**
 * Axios instance with interceptors.
 * - Request: attaches Bearer token from Zustand store
 * - Response: handles 401, 422, 500, and network errors
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error('Tidak dapat terhubung ke server');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        useAuthStore.getState().logout();
        window.location.href = '/login';
        break;

      case 422:
        // Return error with .errors for form validation
        return Promise.reject({ ...error, errors: data.errors || {} });

      case 403:
        toast.error('Anda tidak memiliki akses untuk tindakan ini');
        break;

      case 404:
        toast.error('Data tidak ditemukan');
        break;

      case 500:
        toast.error('Terjadi kesalahan server');
        break;

      default:
        toast.error(data?.message || 'Terjadi kesalahan');
        break;
    }

    return Promise.reject(error);
  }
);

export default api;

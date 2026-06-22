import api from './axios';

/** POST /auth/login */
export const login = (credentials) => api.post('/auth/login', credentials);

/** POST /auth/register */
export const register = (data) => api.post('/auth/register', data);

/** POST /auth/logout */
export const logout = () => api.post('/auth/logout');

/** GET /auth/me */
export const getMe = () => api.get('/auth/me');

/** PUT /auth/profile */
export const updateProfile = (data) => api.put('/auth/profile', data);

/** POST /auth/change-password */
export const changePassword = (data) => api.post('/auth/change-password', data);

/** POST /auth/profile/photo */
export const uploadPhoto = (formData) =>
  api.post('/auth/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/** POST /auth/profile/ttd */
export const uploadTtd = (formData) =>
  api.post('/auth/profile/ttd', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

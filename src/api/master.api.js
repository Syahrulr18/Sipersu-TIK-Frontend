import api from './axios';

/** GET /users/penanda-tangan — List penanda tangan */
export const getPenandaTangan = () => api.get('/users/penanda-tangan');

/** GET /users/verifikator — List verifikator */
export const getVerifikator = () => api.get('/users/verifikator');

/** GET /users/dosen — Search dosen */
export const searchDosen = (search) =>
  api.get('/users/dosen', { params: { search } });

/** GET /users — All users (admin) */
export const getUserList = (params) => api.get('/users', { params });

/** POST /users — Create user */
export const createUser = (data) => api.post('/users', data);

/** PUT /users/:id — Update user */
export const updateUser = (id, data) => api.put(`/users/${id}`, data);

/** PATCH /users/:id/toggle — Toggle user active status */
export const toggleUser = (id) => api.patch(`/users/${id}/toggle`);

/** POST /users/:id/reset-password — Reset password */
export const resetPassword = (id) => api.post(`/users/${id}/reset-password`);

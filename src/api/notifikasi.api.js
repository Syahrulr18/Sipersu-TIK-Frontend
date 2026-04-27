import api from './axios';

/** GET /notifikasi — List notifikasi */
export const getNotifikasiList = () => api.get('/notifikasi');

/** GET /notifikasi/unread-count — Unread count */
export const getUnreadCount = () => api.get('/notifikasi/unread-count');

/** PATCH /notifikasi/:id/baca — Mark single as read */
export const bacaNotifikasi = (id) => api.patch(`/notifikasi/${id}/baca`);

/** PATCH /notifikasi/baca-semua — Mark all as read */
export const bacaSemua = () => api.patch('/notifikasi/baca-semua');
